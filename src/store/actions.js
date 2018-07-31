import * as types from './mutation-types'
import router from '@/router'
import axios from 'axios'
import getWeb3 from '@/utils/web3/getWeb3'
import { sleep } from '@/utils/methods'

const logIn = ({ commit }, loginResponse) => {
  // after successful login setup interceptor (save authorization header with token for next requests)
  // axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.headers['set-authorization']}`
  // axios.interceptors.request.use(config => {
  //   config.headers['Authorization'] = `Bearer ${loginResponse.headers['set-authorization']}`
  //   return config
  // }, error => {
  //   return Promise.reject(error)
  // })

  commit(types.LOGIN, loginResponse.data)
  getWeb3()
    .then(result => {
      commit(types.SET_WEB3_INSTANCE, result)
    })
    .catch(e => {})
  router.push('/')
  // get account profile
  // axios.get('/account').then(response => {
  //   // save token and user profile to store
  //   commit(types.LOGIN, loginResponse.data)
  //   // push to / route
  //   router.push('/')
  // })
}

const logOut = ({ commit }) => {
  commit(types.LOGOUT)
  commit(types.CLEAR_WEB3_INSTANCE)
  delete axios.defaults.headers.common['Authorization']
}

const changeProfileNames = ({ commit }, response) => {
  commit(types.CHANGE_PROFILE_NAMES, response)
}

const loadProfileWallets = async ({ commit }, page) => {
  commit(types.SET_LOADING, true)
  const response = await axios.get('/account/mywallets?page=' + page)
  if (response.data) {
    commit(types.LOAD_PROFILE_WALLETS, response.data)
    commit(types.SET_LOADING, false)
  }
}

const loadProfileTransactions = async ({ commit }, page) => {
  commit(types.SET_LOADING, true)
  const response = await axios.get('/transaction/mytransactions?page=' + page)
  if (response.data) {
    commit(types.LOAD_PROFILE_TRANSACTIONS, response.data)
    commit(types.SET_LOADING, false)
  }
}

const setNotificationPermission = async ({ commit }, payload) => {
  commit(types.SET_LOADING, true)
  const response = await axios.post('/account/updateemailoptout', {
    emailTypeId: payload.id,
    value: payload.value
  })

  if (response.data) {
    commit(types.SET_EMAIL_OPT_OUT, payload)
    commit(types.SET_LOADING, false)
  }
}

const loadNotificationPermissions = async ({ commit }, emailPermissionGroups) => {
  commit(types.SET_LOADING, true)
  const response = await axios.get('/account/myemailoptouts')

  if (response.data) {
    commit(types.SET_NOTIFICATION_PERMISSIONS, { emailPermissionGroups, response: response.data })
    commit(types.SET_LOADING, false)
  }
}

const loadCurrentDataset = async ({ commit, state }, id) => {
  const response = await axios.get('/data/' + id)
  if (response.data.data) {
    commit(types.LOAD_CURRENT_DATASET, response.data)
  } else {
    commit(types.CLEAR_CURRENT_DATASET)
  }
}

const clearCurrentDataset = ({ commit }) => {
  commit(types.CLEAR_CURRENT_DATASET)
}

const clearCurrentModel = ({ commit }) => {
  commit(types.CLEAR_CURRENT_MODEL)
}

const setRemoteFileAccessPoint = ({ commit }, response) => {
  commit(types.SET_REMOTE_FILE_ACCESS_POINT, response)
}

const setCurrentDatasetFile = ({ commit }, response) => {
  commit(types.SET_CURRENT_DATASET_FILE, response)
}

const setIsFileRemote = ({ commit }, response) => {
  commit(types.SET_IS_FILE_REMOTE, response)
}

const setHasFileChanged = ({ commit }, response) => {
  commit(types.SET_HAS_FILE_CHANGED, response)
}

const registerWeb3Instance = ({ commit }, response) => {
  getWeb3()
    .then(result => {
      commit(types.SET_WEB3_INSTANCE, result)
    })
    .catch(e => {})
}

const clearWeb3Instance = ({ commit }, response) => {
  commit(types.CLEAR_WEB3_INSTANCE, response)
}

const loadCurrentModel = async ({ commit, state }, payload) => {
  const response = await axios.get(`/data/${payload.datasetId}/models/${payload.modelId}`)
  commit(types.LOAD_CURRENT_MODEL, response.data)
}

const loadCurrentProduct = async ({ commit }, id) => {
  commit(types.CLEAR_CURRENT_PRODUCT)
  commit(types.SET_LOADING, true)

  let response = null

  try {
    response = await axios.get('insurance/products/' + id)
  } catch (e) {
    commit(types.SET_LOADING, false)
  }

  if (response && response.data.product) {
    commit(types.LOAD_CURRENT_PRODUCT, response.data)
    commit(types.SET_LOADING, false)
  } else {
    commit(types.CLEAR_CURRENT_PRODUCT)
    commit(types.SET_LOADING, false)
  }
}

const createNewPolicy = async ({ commit, state }, { deviceId, productId }) => {
  try {
    await loadTaskId(commit, deviceId)
  } catch (e) {
    return
  }

  // Creating policy
  let response = null
  while (!response || (!response.data.policyId && !response.data.validationResultCode)) {
    response = await axios.post('insurance/policy', {
      TaskId: state.policyLoadingInfo.taskId,
      ProductId: productId
    })

    await sleep(1000)
  }

  var newPolicyLoadingInfo = Object.assign({}, state.policyLoadingInfo)

  commit(types.CLEAR_POLICY_LOADING_INFO)
  if (response.data.validationResultCode) {
    newPolicyLoadingInfo.validationResultCode = response.data.validationResultCode
  } else {
    newPolicyLoadingInfo.policyId = response.data.policyId
  }

  commit(types.SET_POLICY_LOADING_INFO, newPolicyLoadingInfo)
}

const getPolicy = async ({ commit }, policyId) => {
  commit(types.SET_LOADING, true)
  commit(types.CLEAR_CURRENT_POLICY)

  const response = await axios.get('insurance/policy/' + policyId)

  if (response && response.data) {
    commit(types.SET_CURRENT_POLICY, response.data)
  }

  commit(types.SET_LOADING, false)
}

const sendPolicyPayment = async ({ commit, dispatch, state }) => {
  const web3 = state.userWeb3.web3Instance()
  const productAddress = state.currentPolicy.contractAddress

  const TokenInstance = new web3.eth.Contract(process.env.CONTRACT_INFO.ABI, process.env.CONTRACT_INFO.ADDRESS)
  const paymentValue = web3.utils.toWei(state.currentPolicy.premium.toString())
  const policyIdBytes = web3.utils.fromAscii(state.currentPolicy.id)

  TokenInstance.methods
    .approveAndCall(productAddress, paymentValue, policyIdBytes)
    .send({ gas: 190000, from: state.userWeb3.coinbase })
    .once('transactionHash', async txHash => {
      const policyId = state.currentPolicy.id

      const request = {
        policyId,
        txId: txHash,
        txType: 'PolicyPayment',
        txMetadata: JSON.stringify({ policyId })
      }

      await axios.post('/insurance/transaction', request)

      commit(types.SET_TX_HASH, txHash)

      dispatch('getPolicy', policyId)
    })
}

const loadUserPolicies = async ({ commit }, page) => {
  const response = await axios.get('/insurance/mypolicies?page=' + page)
  if (response.data) {
    commit(types.LOAD_USER_POLICIES, response.data)
  }
}

const verifyClaim = async ({ commit, dispatch, state }) => {
  // Getting task id
  try {
    await loadTaskId(commit, state.currentPolicy.deviceId)
  } catch (e) {
    return
  }

  // Creating policy
  commit(types.SET_LOADING, true)

  let response = null
  while (!response || !response.data.isClaimable) {
    response = await axios.put('/insurance/verifypolicyclaim', {
      TaskId: state.policyLoadingInfo.taskId,
      PolicyId: state.currentPolicy.id
    })

    await sleep(1000)
  }

  if (response.data.isClaimable) {
    commit(types.SET_LOADING, false)
    dispatch('getPolicy', state.currentPolicy.id)
  }
}

const claim = async ({ commit, state }) => {
  commit(types.SET_LOADING, true)

  await sleep(3000)

  commit(types.SET_LOADING, false)
}

export {
  logIn,
  logOut,
  changeProfileNames,
  loadProfileWallets,
  loadProfileTransactions,
  setNotificationPermission,
  loadNotificationPermissions,
  loadCurrentDataset,
  setRemoteFileAccessPoint,
  setCurrentDatasetFile,
  setIsFileRemote,
  setHasFileChanged,
  registerWeb3Instance,
  clearWeb3Instance,
  loadCurrentModel,
  clearCurrentDataset,
  clearCurrentModel,
  loadCurrentProduct,
  loadUserPolicies,
  createNewPolicy,
  getPolicy,
  sendPolicyPayment,
  verifyClaim,
  claim
}

const loadTaskId = async (commit, deviceId) => {
  commit(types.SET_LOADING, false) // ?
  commit(types.CLEAR_POLICY_LOADING_INFO)

  // We need custom axios instance to handle 404 differently
  const customAxios = axios.create({ baseUrl: process.env.API_ADDRESS })

  const policyLoadingInfo = {
    deviceId: deviceId
  }

  commit(types.SET_POLICY_LOADING_INFO, policyLoadingInfo)

  let response = null

  // STEP 1: getting task ID
  try {
    response = await customAxios.get('insurance/policy/android/pair/' + deviceId)
  } catch (error) {
    var newPolicyLoadingInfo = Object.assign({}, policyLoadingInfo)

    if (error.response.status === 404) {
      newPolicyLoadingInfo.notFound = true
    } else if (error.response.status === 503 || error.response.status === 500) {
      newPolicyLoadingInfo.serverError = true
    }

    commit(types.SET_POLICY_LOADING_INFO, newPolicyLoadingInfo)
    throw new Error('Getting task id failed.')
  }

  commit(types.CLEAR_POLICY_LOADING_INFO)
  policyLoadingInfo.taskId = response.data.taskId
  commit(types.SET_POLICY_LOADING_INFO, policyLoadingInfo)

  return response
}
