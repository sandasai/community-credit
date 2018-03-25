<template>
  <div class="section">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Store" icon-pack="fa" icon="balance-scale">
        <item-store />
      </b-tab-item>
      <b-tab-item label="List an Item" icon="upload">
        <item-form />      
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import ItemForm from './ItemForm'
import ItemStore from './ItemStore'

export default {
  name: 'items',
  components: {
    ItemForm, ItemStore
  },
  data: function () {
    return {
      activeTab: 0
    }
  },
  mounted: function () {
    this.routing()
  },
  methods: {
    routing: function () {
      if (this.$route.query.list) {
        this.activeTab = 1
      } else if (this.$route.query.store) {
        this.activeTab = 0
      }
    }
  }
}
</script>

