<template>
  <v-data-footer
    v-if="goToPagePayload"
    :show-first-last-page="!shortPagination"
    :disable-items-per-page="disablePagination"
    :disable-pagination="disablePagination"
    :options="footerOptions"
    :pagination="footerPagination"
    :items-per-page-options="itemsPerPage"
    class="footer-with-custom-pager"
    @update:options="updateFooterOptions"
  >
    <template
      v-if="!shortPagination"
      #page-text
    >
      <div class="d-flex justify-between align-center">
        <v-autocomplete
          :value="pagination.currentPage"
          :items="pages"
          :disabled="disablePagination"
          dense
          hide-details
          class="compact-input footer-select-page"
          @change="goToPage"
        >
          <template #prepend>
            <div style="margin-top: 2px;">
              {{ `${$t('common.page')}: ` }}
            </div>
          </template>
        </v-autocomplete>

        <span
          id="browserProfilesMainTableFooterPaginationInfo"
          class="ml-9"
        >
          {{ `${footerPagination.itemsLength ? footerPagination.pageStart + 1 : 0} - ${footerPagination.itemsLength ? footerPagination.pageStop : 0} ${$t('common.from')} ${footerPagination.itemsLength}` }}
        </span>
      </div>
    </template>
  </v-data-footer>
</template>

<script>
export default {
  name: 'Pagination',
  props: {

    disablePagination: {
      type: Boolean,
      default: false
    },
    shortPagination: {
      type: Boolean,
      default: false
    },
    goToPagePayload: {
      type: Object,
      default: () => {
        return {}
      }
    },
    goToPageAction: {
      type: String,
      default: ''
    },
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    footerOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    itemsPerPage: {
      type: Array,
      default: () => {
        return [25, 50, 100]
      }
    }

  },
  computed: {
    footerPagination () {
      const pagination = {}

      pagination.page = this.pagination.currentPage
      pagination.itemsPerPage = this.pagination.perPage
      pagination.pageStart = this.pagination.from - 1
      pagination.pageStop = this.pagination.to
      pagination.pageCount = this.pagination.lastPage
      pagination.itemsLength = this.pagination.total

      return pagination
    },
    pages () {
      const pages = []

      if (this.footerPagination && this.footerPagination.pageCount) {
        for (let i = 1; i <= this.footerPagination.pageCount; i++) {
          pages.push(i)
        }
      }

      return pages
    }

  },
  methods: {
    updateFooterOptions (options) {
      const payload = {
        page: options.page,
        itemsPerPage: options.itemsPerPage,
        query: this.pagination.query,
        ...this.goToPagePayload
      }
      this.$store.dispatch(this.goToPageAction, payload)
    },

    goToPage (page) {
      const payload = {
        page: page,
        itemsPerPage: this.pagination.perPage,
        query: this.pagination.query,
        ...this.goToPagePayload
      }
      this.$store.dispatch(this.goToPageAction, payload)
    }
  }
}
</script>

<style scoped>

</style>
