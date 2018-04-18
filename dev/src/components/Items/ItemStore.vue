<template>
  <div class="container">
    <b-field>
      <b-input placeholder="Search..."
        type="search"
        icon="magnify"
        expanded
        v-model="search"
        @keyup.enter.native="searchFilter"
      />
      <b-select placeholder="Sort by" v-model="sortBy">
        <option>Alphabetical</option>
        <option>Recently Available</option>
      </b-select>
      <p class="control">
        <button class="button is-primary" @click="searchFilter">Search</button>
      </p>
    </b-field>

    <b-field>
      <div class="block">
        <b-radio v-model="filter" native-value="Available">
          Available
        </b-radio>
        <b-radio v-model="filter" native-value="All">
          All
        </b-radio>
        <b-radio v-model="filter" native-value="My Items">
          My Items
        </b-radio>
        <b-radio v-model="filter" native-value="Borrowed Items">
          Borrowed Items
        </b-radio>
      </div>
    </b-field>

    <div class="item-list">
      <item-card
        v-for="(item, index) in whichItems"
        v-bind:key="item.id"
        v-bind:item="item"
        v-on:click.native="handleCardClick(index)"
        size="small"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ItemCard from './ItemCard'
import qs from 'query-string'

function sortItemsAlphabetically (a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1
  } else {
    return 1
  }
}

function sortItemsRecentlyAvailable (a, b) {
  if (a.updated_at > b.updated_at) {
    return -1
  } else {
    return 1
  }
}

export default {
  components: {
    ItemCard
  },
  data: function () {
    return {
      search: '',
      selectedItem: null,
      filter: 'All',
      sortBy: 'Recently Available',
      items: [],
      itemPage: 1,
      loadingItems: false
    }
  },
  computed: {
    myItems: function () {
      return this.items.filter(item => {
        return Number(item.owner_id) === this.myId
      })
    },
    borrowedItems: function () {
      return this.items.filter(item => {
        return item.holder_id === this.myId && item.owner_id !== this.myId
      })
    },
    whichItems: function () {
      const mapping = {
        'Available': this.availableItems,
        'All': this.items,
        'My Items': this.myItems,
        'Borrowed Items': this.borrowedItems
      }
      const sortingFn = this.sortBy === 'Recently Available' ? sortItemsRecentlyAvailable : sortItemsAlphabetically
      return mapping[this.filter].sort(sortingFn)
    },
    availableItems: function () {
      return this.items.filter(item => {
        return item.status === 'Available'
      })
    }
  },
  mounted: async function () {
    await this.getItems()
  },
  created: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getItems: async function (search) {
      this.loadingItems = true
      const params = qs.stringify({
        page: this.itemPage,
        search: search || undefined
      })
      try {
        const response = await axios({
          method: 'GET',
          url: `/api/items?${params}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        this.items = this.items.concat(response.data)
        this.itemPage++
      } catch (err) {
        console.log(err)
        console.log('Unable to load items')
      }
      this.loadingItems = false
    },
    searchFilter: async function () {
      this.items = []
      this.itemPage = 1
      if (this.search.length === 0) {
        return
      }
      this.getItems(this.search)
    },
    handleCardClick: function (index) {
      this.selectedItem = index
      this.$router.push({ name: 'ItemPage', params: { id: this.items[index].id } })
    },
    handleScroll: function (event) {
      if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && !this.loadingItems) {
        this.getItems(this.search)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .item-list {
//   column-count: 4;
//   column-width: 275px;
//   column-gap: 0px;
//   margin: 0;
// }

// .item-list > * {
//   margin: 10px;
//   display: inline-block;
//   -webkit-column-break-inside: avoid; /* Chrome, Safari, Opera */
//   page-break-inside: avoid; /* Firefox */
//   break-inside: avoid; /* IE 10+ */
//   width: calc(100% - 20px)
// }

.item-list {
  display: flex;
  flex-wrap: wrap;
}

.item-list > * {
  margin: 10px;
  width: calc(20vw);
}

.item-detail {
  position: absoulte;
}
</style>
