<template>
  <div>
    <transition name="slideDown">
      <div class="aig-navigation">
        <div class="aig-navigation-body">
          <router-link to="/data/all" class="aig-logo">
            <img src="/static/logo.png" alt="">
            <div class="alpha-container" v-if="isDevEnv">
              {{ $t('general.testPlatform') }}
            </div>
          </router-link>
          <nav class="aig-navigation-menu">
            <ul>
              <li v-for="(bar, index) in navigationBars" :key="index">
                <router-link v-if="bar.type === 'internal'" active-class="aig-bar-active" :class="{'disabled': bar.disabled}" :to="bar.routeLink">
                  {{ bar.name }}
                </router-link>
                <a v-if="bar.type === 'external'" active-class="aig-bar-active" target="_blank" :href="bar.link" :class="{'disabled': bar.disabled}">
                  {{ bar.name }}
                </a>
              </li>
            </ul>
          </nav>
          <div class="aig-profile-wrapper" v-if="$store.getters['user/isAuthenticated']">
            <UserTab />
          </div>
          <el-button type="primary" class="aig--login" @click="selectLogin" v-else>{{ $t('navigation.login')}}</el-button>
          <div v-on:click="dropDownMenuActive = !dropDownMenuActive" class="aig-hamburger-wrapper">
            <hamburger v-bind:menuActive="dropDownMenuActive"></hamburger>
          </div>
        </div>
      </div>
    </transition>
    <div class="aig-dropdown" v-if="dropDownMenuActive">
      <ul>
        <li v-for="bar in navigationBars" :key="bar.name">
          <router-link v-if="bar.type === 'internal'" :class="{'disabled': bar.disabled}" active-class="aig-bar-active" :to="bar.routeLink"
            @click.native="dropDownMenuActive = false">
            {{ bar.name }}
          </router-link>
          <a v-if="bar.type === 'external'" active-class="aig-bar-active" target="_blank" :href="bar.link" :class="{'disabled': bar.disabled}">
            {{ bar.name }}
          </a>
        </li>
        <li v-if="$store.getters['user/isAuthenticated']">
          <router-link :to="'/profile'" active-class="aig-bar-active" @click.native="dropDownMenuActive = false">
            {{ $t('navigation.profile') }}
          </router-link>
        </li>
        <li v-else>
          <router-link active-class="aig-bar-active" to="/login" @click.native="dropDownMenuActive = false" exact>{{
            $t('navigation.login')}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import UserTab from '@/components/UserTab'
import Hamburger from './Hamburger'

export default {
  name: 'Navigation',
  components: {
    UserTab,
    Hamburger
  },
  data () {
    return {
      navigationBars: [{
        name: this.$t('navigation.data'),
        routeLink: '/data',
        type: 'internal',
        disabled: !process.env.FEATURE_TOGGLE.DATA
      },
      {
        name: this.$t('navigation.predictions'),
        routeLink: '/predictions',
        type: 'internal',
        disabled: !process.env.FEATURE_TOGGLE.PREDICTIONS
      },
      {
        name: this.$t('navigation.pools'),
        routeLink: '/pools',
        type: 'internal',
        disabled: !process.env.FEATURE_TOGGLE.POOLS
      },
      {
        name: this.$t('navigation.insurance'),
        routeLink: '/insurance',
        type: 'internal',
        disabled: !process.env.FEATURE_TOGGLE.INSURANCE
      },
      {
        name: this.$t('navigation.wiki'),
        type: 'external',
        link: 'https://aigangnetwork.github.io/'
      },
      {
        name: this.$t('navigation.discussions'),
        type: 'internal',
        routeLink: '/discussions'
      }
      ],
      dropDownMenuActive: false
    }
  },
  methods: {
    selectLogin () {
      this.$router.push({
        name: 'Login'
      })
    }
  },
  computed: {
    isDevEnv () {
      return process.env.NODE_ENV !== 'production'
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '~helpers/variables';
  @import '~helpers/mixins';

  .aig-dropdown {
    font-family: $font-primary;
    position: absolute;
    width: 100%;
    z-index: 1002;
    background-color: $purple;
    line-height: 3em;

    ul {
      list-style-type: none;
      padding-left: 0;

      li {
        width: 100%;

        .disabled {
          pointer-events: none;
          opacity: 0.25;
        }

        a {
          color: $white;
          padding: 10px;
          padding-left: 40px;
          display: block;
        }
      }
    }

    @include breakpoint(min-width 1000px) {
      display: none;
    }
  }

  .aig-hamburger-wrapper {
    display: none;
  }

  .aig-profile-wrapper {
    width: 200px;
    line-height: 1.4;
  }

  .aig-bar-active {
    background-color: $active-dark-purple;
    border-bottom: solid 5px;
    border-bottom-color: $orange;
  }

  .aig-logo {
    float: left;
    font-size: 0;
    height: 100%;
    padding: 10px;
    margin-left: 15px;
    margin-top: 5px;

    img {
      vertical-align: middle;
      height: 30px;
    }

    .alpha-container {
      color: white;
      font-size: 9px;
      display: flex;
      justify-content: right;
      font-weight: 600;
    }
  }

  .aig-navigation {
    margin: 0 auto;
    width: 100%;
    background: $purple;
    width: 100%;

    .aig-navigation-body {
      margin: 0 auto;
      max-width: 1440px;
      font-size: 0;
      background: $purple;
      height: 70px;
      display: flex;

      .aig--login {
        height: 40px;
        margin-top: 13px;
        margin-right: 15px;
      }

      @include breakpoint(max-width 1000px) {
        .aig-hamburger-wrapper {
          display: block;
          cursor: pointer;
        }

        .aig-navigation-menu ul {
          display: none;
        }

        .aig-profile-wrapper {
          display: none;
        }

        .aig--login {
          display: none;
        }
      }
    }

    .aig-logo {
      &:hover {
        opacity: 0.65;
      }

      &:active {
        opacity: 1;
      }
    }
  }

  .disabled {
    pointer-events: none;
    opacity: 0.25;
  }

  .aig-navigation-menu {
    width: 100%;

    ul {
      display: flex;
      height: 100%;
      justify-content: center;

      li {
        list-style: none;

        &+li {
          margin-left: 25px;
        }

        a {
          padding: 15px;
          @include transition(all, 100ms, ease-in-out);
          font-family: $font-primary;
          display: flex;
          align-items: center;
          height: 100%;
          color: $white;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 2px;

          &:hover {
            color: rgba($white, .65);
          }
        }
      }
    }

    @include breakpoint(max-width 1000px) {
      ul {
        background: white;
      }
    }
  }
</style>
