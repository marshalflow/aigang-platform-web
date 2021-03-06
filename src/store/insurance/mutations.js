export default {
  resetState (state, newState) {
    Object.assign(state, newState)
  },

  loadCurrentProduct (state, payload) {
    state.product = payload.product
  },

  clearCurrentProduct (state) {
    state.product = {}
  },

  setPolicy (state, payload) {
    state.policy = payload.policy
    state.policy.isClaimable = true
  },

  clearPolicy (state) {
    state.policy = {}
  },

  setPolicyLoadingInfo (state, policyLoadingInfo) {
    state.policyLoadingInfo = policyLoadingInfo
  },

  clearPolicyLoadingInfo (state) {
    state.policyLoadingInfo = {}
  },

  setTxHash (state, txHash) {
    state.txHash = txHash
  },

  setPolicyLoadingFailed (state, value) {
    state.policyLoadingInfo.failed = value
  },

  setIsPolicyLoadingVisible (state, value) {
    state.isPolicyLoadingVisible = value
  },

  loadUserPolicies (state, policies) {
    state.userPolicies = policies
  },

  setTransactionError (state, value) {
    state.transactionError = value
  }
}
