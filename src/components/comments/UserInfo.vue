<template>
  <div>
    <div class="profile">
      <div class="photo">
        {{ userName.charAt(0) }}
      </div>
      <div class="information">
        <div v-if="showUsername">
          {{userName}}
        </div>
        <div class="date" v-if="date">
          <div>{{ created }}</div>
          <div v-if="modified">({{$t('data.dataset.comment.edited')}} {{ modified }})</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CreatedDate from '@/components/mixins/CreatedDate'
import ModifiedDate from '@/components/mixins/ModifiedDate'
export default {
  props: ['date', 'modifiedDate', 'userName', 'showUsername'],
  mixins: [CreatedDate, ModifiedDate],
  computed: {
    createdUtc () {
      return this.date
    },
    modifiedUtc () {
      return this.modifiedDate
    }
  }
}

</script>
<style lang="scss">
  @import '~helpers/variables';
  .profile {
    font-size: 11px;
    font-family: $font-primary;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .photo {
      // pointer-events: none;
      flex-shrink: 0;
      height: 46px;
      width: 46px;
      border-radius: 50%;
      margin-left: 7px;
      background: #f3f0f0cc;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-right: 17px;
    }
    .information {
      color: $purple;
      margin-right: 10px;
      font-weight: 800;
      font-size: 10pt;
      .date {
        color: $light-grey;
        font-size: 9pt;
        font-weight: 100;
        padding-top: 2px;
      }
    }
  }

  @media screen and (min-width: 100px) and (max-width: 680px) {
    .profile {
      justify-content: center;
    }

  }

</style>
