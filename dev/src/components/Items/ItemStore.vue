<template>
  <div class="container">

    <b-field>
      <b-input placeholder="Search..."
        type="search"
        icon="magnify"
        expanded
        v-model="search"
      />
      <b-select placeholder="Sort by" v-model="sortBy">
        <option>Alphabetical</option>
        <option>Recently Available</option>
      </b-select>
      <p class="control">
        <button class="button is-primary" @click="$store.dispatch('getItems', search)">Search</button>
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
import ItemCard from './ItemCard'

function sortItemsAlphabetically (a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1
  } else {
    return 1
  }
}

function sortItemsRecentlyAvailable (a, b) {
  if (a.date > b.date) {
    return -1
  } else {
    return 1
  }
}

export default {
  data: function () {
    return {
      search: '',
      selectedItem: null,
      filter: 'All',
      sortBy: 'Recently Available'
    }
  },
  computed: {
    items: function () {
      return this.$store.state.items
    },
    myItems: function () {
      return this.items.filter(item => {
        return item.owner_id === this.$store.state.id
      })
    },
    borrowedItems: function () {
      return this.items.filter(item => {
        return item.holder_id === this.$store.state.id && item.owner_id !== this.$store.state.id
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
  components: {
    ItemCard
  },
  beforeRouteUpdate (from, to, next) {
    this.$store.dispatch('getItems')
    next()
  },
  methods: {
    handleCardClick: function (index) {
      this.selectedItem = index
      this.$router.push({ name: 'ItemPage', params: { id: this.items[index].id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.item-list {
  column-count: 4;
  column-width: 275px;
  column-gap: 0px;
  margin: 0;
}

.item-list > * {
  margin: 10px;
  display: inline-block;
  -webkit-column-break-inside: avoid; /* Chrome, Safari, Opera */
  page-break-inside: avoid; /* Firefox */
  break-inside: avoid; /* IE 10+ */
}

.item-detail {
  position: absoulte;
}
</style>
