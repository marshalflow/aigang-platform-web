<template>
  <div class="models-container">
    <div v-loading="loading">
      <h4 class="info-title">{{$t('data.dataset.model.models')}}</h4>
      <h3 v-if="modelsNotFound">{{$t('data.dataset.model.modelsNotFound')}}</h3>
      <DatasetModelCard v-for="(model, index) in modelsList" :model="model" :key="index" />
    </div>
  </div>
</template>
<script>
import DatasetModelCard from '@/components/data/model/DatasetModelCard'

export default {
  components: {
    DatasetModelCard
  },
  props: ['requestPath'],
  data () {
    return {
      loading: false,
      modelsList: [],
      modelsNotFound: false
    }
  },
  methods: {
    async fetchModels (dataId) {
      this.loading = true
      try {
        let response = await this.axios.get(this.requestPath)

        if (response.data.items) {
          this.modelsList = response.data.items
        } else {
          this.modelsNotFound = true
        }

        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  },
  mounted () {
    this.fetchModels(this.$route.params.id)
  }
}
</script>
<style lang="scss" scoped>
  .models-container {
    padding: 0 54px 54px 54px;
  }

  @media screen and (min-width: 100px) and (max-width: 680px) {
    .models-container {
      padding: 0 20px 54px 20px;
    }
  }
</style>
