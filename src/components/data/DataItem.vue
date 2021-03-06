<template>
  <div class="aig-data-item">
    <div>
      <div class="aig-data-item-head">
        <div class="desc">{{ $t('data.card.added') }} {{ created }}</div>
        <el-tooltip v-if="data.state === 'closed'" :content="$t('data.dataset.closedTooltip')" placement="top-start">
          <div class="status-bubble grey"></div>
        </el-tooltip>
        <el-tooltip
          v-else-if="data.state === 'created'"
          :content="$t('data.dataset.notApprovedTooltip')"
          placement="top-start"
        >
          <div class="status-bubble yellow"></div>
        </el-tooltip>
        <el-tooltip v-else-if="data.isPublic" :content="$t('data.dataset.publicTooltip')" placement="top-start">
          <div class="status-bubble green"></div>
        </el-tooltip>
        <el-tooltip v-else :content="$t('data.dataset.privateTooltip')" placement="top-start">
          <div class="status-bubble green-border"></div>
        </el-tooltip>
      </div>
      <router-link :to="{ name: 'DatasetInfo', params: { id: data.id}}">
        <div class="aig-data-item-head">
          <div class="title">{{ data.title | truncate(35) }}</div>
        </div>
        <div class="aig-data-item-body">
          <div class="desc">
            <p>{{ data.description | truncate(60) }}</p>
          </div>
          <div>
            <span v-if="data.tags.length" class="tags-list"> {{formatTags | truncate(30)}} </span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="aig-data-item-footer">
      <div class="aig-footer-container">
        <img src="/static/models24px.svg" alt="models" />
        <router-link class="label" :to="{ name: 'DatasetModels', params: { id: data.id}}">
          {{ $t('data.card.models') }} <span v-if="data.modelsCount > 0"> ({{ data.modelsCount }})</span>
        </router-link>
      </div>
      <div class="aig-footer-container-right">
        <img src="/static/threads24px.svg" alt="comment" />
        <router-link class="label" :to="{ name: 'DatasetComment', params: { id: data.id}}">
          {{ $t('data.card.comment') }} <span v-if="data.commentsCount > 0">({{ data.commentsCount }})</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import CreatedDate from '@/components/mixins/CreatedDate'

export default {
  name: 'DataItem',
  mixins: [CreatedDate],
  props: {
    data: {
      required: false,
      type: Object
    },
    modelsCount: {
      required: false,
      type: Number
    }
  },
  data () {
    return {
      models: 3,
      comments: 12,
      createdUtc: ''
    }
  },
  computed: {
    formatTags () {
      if (this.data.tags.length) {
        return this.data.tags.map(item => `#${item}`).join(' ')
      }
    }
  },
  created () {
    this.createdUtc = this.data.createdUtc
  }
}
</script>

<style lang="scss" scoped>
  @import '~helpers/variables';
  @import '~helpers/mixins';

  .aig-data-item {
    @include transition;
    padding: 20px;
    background: white;
    box-shadow: 0 0 30px 0 #e9f0f6;
    border: 1px solid $light-border-blue;
    height: 245px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .aig-data-item-body {
      height: 100%;
      max-height: 110px;
      p {
        margin: 0;
        max-height: 50px;
        font-size: 14px;
      }
      .tags-list {
        margin: 0px;
        padding: 0px;
        font-size: 13px;
        color: #b2c1d2;
      }
    }
    .aig-data-item-head {
      display: flex;
      justify-content: space-between;
      margin-top: 0;
      width: 100%;
    }
    .aig-data-item-footer {
      border-top: 1px solid $light-border-blue;
      height: 40px;
      width: 100%;
      font-size: 0;
      display: flex;
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
      height: 30px;
      background: white;

      .aig-footer-container {
        justify-content: left;
        display: flex;
        width: 50%;
        height: 100%;
        .label {
          font-family: $font-secondary;
          font-size: 14px;
          margin-left: 2px;
          display: flex;
          span {
            margin-left: 2px;
          }
        }
      }
      .aig-footer-container-right {
        justify-content: right;
        @extend .aig-footer-container;
      }
    }

    .title {
      font-family: $font-primary;
      color: $purple;
      font-weight: 600;
      font-size: 17pt;
      word-wrap: break-word;
      max-width: 100%;
    }

    .desc {
      min-height: 20px;
      line-height: 1.3;
      font-size: 13px;
      word-wrap: break-word;
      max-width: 100%;
    }

    .status {
      padding: 10px 0;
      font-weight: 600;
    }

    .status-bubble {
      height: 15px;
      width: 15px;

      border-radius: 50%;

      &.green {
        background: #87d37c;
      }

      &.grey {
        background: #dadfe1;
      }

      &.yellow {
        background: #f4d03f;
      }

      &.green-border {
        border: 3px solid #87d37c;
      }
    }
  }

  /* Tablet */

  @media screen and (min-width: 680px) and (max-width: 1024px) {
    .aig-data .aig-data-item-footer .aig-footer-container-right {
      padding-left: 0px;
    }
  }

  @media screen and (min-width: 100px) and (max-width: 680px) {
    .aig-data {
      height: 245px;
      padding: 18px;

      .aig-data-item-head {
        .title {
          width: 100%;
          word-wrap: break-word;
        }
      }

      .aig-data-item-body {
        p {
          font-size: 13px;
        }
      }
      .aig-data-footer {
        justify-content: space-between;
        .aig-footer-container-right {
          padding-left: 0;
        }
      }
    }
  }
</style>
