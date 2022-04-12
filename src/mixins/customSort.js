export default {
  methods: {
    sortBy () {
      const index = localStorage.getItem('anty-sorting-index')
      if (index && index !== 'undefined') {
        return localStorage.getItem('anty-sorting-index')
      }

      return []
    },

    sortDesc () {
      const isDesc = localStorage.getItem('anty-sorting-is-desc')
      if (isDesc && isDesc !== 'undefined') {
        return localStorage.getItem('anty-sorting-is-desc') === 'true'
      }

      return []
    },

    customSort (items, index, isDesc) {
      let filterSortBy = index[0]
      let filterOrder = isDesc[0]
      localStorage.setItem('anty-sorting-index', filterSortBy)
      localStorage.setItem('anty-sorting-is-desc', filterOrder)
      let pinedItems = []
      if (items.length > 0 && typeof items[0].pinned !== 'undefined') {
        pinedItems = items.filter(el => el.pinned === true)
        items = items.filter(el => el.pinned === false)
      }
      switch (filterSortBy) {
        case 'tags':
          filterSortBy = 'concat_tags'
          break
        case 'proxy':
          filterSortBy = 'proxyId'
          break
        case 'lastEdited':
          filterSortBy = 'updated_at'
          break
        case 'worktime':
          filterSortBy = 'totalSessionDuration'
          break
        case undefined:
          filterSortBy = ''
          break
        default:
          filterSortBy = filterSortBy !== undefined ? filterSortBy : ''
          break
      }

      switch (filterOrder) {
        case true:
          filterOrder = 'ASC'
          break
        case false:
          filterOrder = 'DESC'
          break
        default:
          filterOrder = ''
          break
      }
      if (!this.$_.isEmpty(items)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'sortBy', data: filterSortBy })
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'order', data: filterOrder })
      }

      return [...pinedItems, ...items]
    }
  }
}
