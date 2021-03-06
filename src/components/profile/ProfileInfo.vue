<template>
  <el-row class="profile-info-container">
    <el-col class="profile-img-container">
      <div>
        {{ $store.state.user.profile.firstName.charAt(0) }}
      </div>
    </el-col>
    <el-col v-loading="loading" class="user-info-container form-container">
      <transition name="slideUp" mode="out-in">
        <el-row class="no-margin" v-if="!isProfileChangeOn">
          <h2 class="name-field">{{ profileForm.firstName }} {{ profileForm.lastName }}</h2>
          <div class="no-margin name-field">
            <strong>{{ $t('profile.general.userName')}}: </strong>{{ profileForm.userName }}</div>
          <div class="no-margin name-field">
            <strong>{{ $t('profile.general.email')}}: </strong>{{ $store.state.user.profile.email }}</div>
          <el-button @click="isProfileChangeOn = !isProfileChangeOn" class="profile-button change-button">{{ $t('general.change')
            }}</el-button>
        </el-row>
        <el-form v-if="isProfileChangeOn" @keyup.enter.native="submitForm('profileForm', saveInfo)" :model="profileForm" :rules="profileFormRules"
          ref="profileForm">
          <el-row class="info-change">
            <el-row>
              <div class="col-3">
                <el-form-item prop="firstName">
                  <el-input class="profile-info-input" type="text" v-model="profileForm.firstName" :placeholder="$t('profile.general.firstName' )"></el-input>
                </el-form-item>
              </div>
              <div class="col-3">
                <el-form-item prop="lastName">
                  <el-input class="profile-info-input" type="text" v-model="profileForm.lastName" :placeholder="$t('profile.general.lastName' )"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="nickname-container">
                <el-form-item prop="userName">
                  <el-input class="profile-info-input" type="text" v-model="profileForm.userName" :placeholder="$t('profile.general.userName' )"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="email-container">
                <strong>{{ $t('profile.general.email')}}: </strong>{{ $store.state.user.profile.email }}</div>
            </el-row>
            <el-row>
              <el-button @click="submitForm('profileForm', saveInfo)" type="submit" v-show="isProfileChangeOn" class="profile-button no-margin">{{
                $t('general.save') }}</el-button>
            </el-row>
          </el-row>
        </el-form>
      </transition>
    </el-col>
  </el-row>
</template>

<script>
import FormMixin from '@/components/mixins/FormMixin'

export default {
  name: 'ProfileInfo',
  mixins: [FormMixin],
  data () {
    return {
      isProfileChangeOn: false,
      loading: false,
      profileForm: {
        firstName: '',
        lastName: '',
        userName: '',
        id: '',
        oldPassword: '',
        newPassowrd: '',
        updatePassword: false
      },
      profileFormRules: {
        firstName: [{
          required: true,
          message: this.$t('validation.firstNameEmpty'),
          trigger: 'blur'
        },
        {
          min: 2,
          message: this.$t('validation.firstNameTooShort'),
          trigger: 'blur'
        },
        {
          max: 50,
          message: this.$t('validation.nameTooLong'),
          trigger: 'blur'
        },
        {
          pattern: /^[A-z]+$/,
          message: this.$t('validation.firstNameInvalid'),
          trigger: 'blur'
        }
        ],
        lastName: [{
          required: true,
          message: this.$t('validation.lastNameEmpty'),
          trigger: 'blur'
        },
        {
          min: 2,
          message: this.$t('validation.lastNameTooShort'),
          trigger: 'blur'
        },
        {
          max: 50,
          message: this.$t('validation.nameTooLong'),
          trigger: 'blur'
        },
        {
          pattern: /^[A-z]+$/,
          message: this.$t('validation.lastNameInvalid'),
          trigger: 'blur'
        }
        ],
        userName: [{
          required: true,
          message: this.$t('validation.userNameEmpty'),
          trigger: 'blur'
        },
        {
          min: 6,
          message: this.$t('validation.userNameTooShort'),
          trigger: 'blur'
        },
        {
          max: 50,
          message: this.$t('validation.nameTooLong'),
          trigger: 'blur'
        },
        {
          pattern: /^[A-z]+$/,
          message: this.$t('validation.userNameInvalid'),
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    saveInfo () {
      this.loading = true
      this.axios.put('/account/edit', this.profileForm)
        .then(response => {
          this.loading = false
          this.isVerificationVisisble = true
          this.isProfileChangeOn = false
          this.$store.dispatch('user/changeProfileNames', response)
          this.updateInfo()
        })
        .catch(e => {
          this.loading = false
        })
    },
    updateInfo () {
      if (this.$store.state.user.profile) {
        this.profileForm.firstName = this.$store.state.user.profile.firstName
        this.profileForm.lastName = this.$store.state.user.profile.lastName
        this.profileForm.userName = this.$store.state.user.profile.userName
        this.profileForm.id = this.$store.state.user.profile.id
      }
    }
  },
  computed: {
    firstNameEntered () {
      return {
        'has-content': this.profileForm.firstName.length > 0
      }
    },
    lastNameEntered () {
      return {
        'has-content': this.profileForm.lastName.length > 0
      }
    }
  },
  mounted () {
    this.updateInfo()
  }
}

</script>
<style lang="scss" scoped>
  @import '~helpers/variables';
  @import '~helpers/mixins';
  @import '~helpers/transitions';

  .profile-img-container {
    width: 132px;

    div {
      width: 132px;
      height: 132px;
      background-size: cover;
      background-position: center center;
      border-radius: 50%;
      line-height: 132px;
      text-align: center;
      font-size: 48px;
      border-radius: 50%;
      background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  }

  .profile-info-container {
    display: flex;
    max-width: 650px;
    min-height: 220px;
    width: calc(100% - 100px);

    .form-container {
      max-width: 550px;
    }

    form {
      transition: all 200ms;
    }

    .col-3 {
      width: 37%;
    }

    .email-container {
      margin-top: 25px;
      margin-bottom: 10px;
    }

    .user-info-container {
      margin-left: 48px;
      margin-bottom: 20px;
      width: calc(100% - 96px);

      h2 {
        margin: 8px 0px 14px 0px;
      }

      .name-field {
        max-width: 70%;
        word-wrap: break-word;
      }

      div {
        margin-bottom: 8px;
        color: $light-grey;
        font-weight: 300;
      }

      .profile-button.change-button {
        margin-top: 22px;
      }
    }

    .nickname-container {
      height: 40px;
      width: 76.20%;
    }
  }

  .col-3 {
    float: left;
    width: 27.33%;
    position: relative;
    margin-right: 10px;
    display: block;
    height: 40px;
  }

  .no-margin {
    margin: 0 !important;
  }

  @media screen and (min-width: 100px) and (max-width: 680px) {
    .profile-info-container {
      flex-direction: column;
      transition: all 200ms;
      align-items: center;
      width: 100%;

      .user-info-container {
        margin-left: 0;
        text-align: center;
        width: 100%;

        .col-3 {
          width: 100%;
          margin-bottom: 12px;
        }

        div {
          margin-bottom: 0;
        }

        .name-field {
          max-width: 100%;
        }
      }

      .nickname-container {
        width: 100%;
      }

      .email-container {
        margin-top: 30px;
        margin-bottom: 10px;
      }

      .no-margin {
        margin: 8px !important;
      }
    }

  }
</style>
