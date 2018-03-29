<template>
  <div>
    <form v-on:submit.prevent="upload">
      <div class="columns">

        <div class="column is-two-thirds">
          <b-field label="Item"
            :type="itemFieldDanger ? 'is-danger' : null"
            :message="itemFieldDanger ? 'Your item should have a name or title' : null"
            >
            <b-input
              v-model="item"
              placeholder="What is the item?"
              @blur="itemFieldTouched = true"
              type="text">
            </b-input>
          </b-field>

          <b-field label="Description">
            <b-input v-model="description" placeholder="Description" type="textarea"></b-input>
          </b-field>

          <label class="label">Who is this for?</label>
          <div class="field"
            v-bind:class="{ 'has-addons': displayUser }"
          >
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="userOption">
                  <option>Anyone</option>
                  <option>For someone special</option>
                </select>
              </div>
            </div>
          </div>

          <b-field v-if="displayUser" label="Find a friend">
            <b-autocomplete
              v-model="name"
              :data="filteredDataArray"
              placeholder="This item is for..."
              icon="magnify"
              @select="handleAutocompleteSelection"
            >
              <template slot="empty">No results found</template>
            </b-autocomplete>
          </b-field>

          <div class="field">
            <b-checkbox disabled v-model="placeOnStore">
              Place on the store afterwards?
            </b-checkbox>
          </div>

        </div>

        <div class="column is-one-third has-text-centered">
          <file-upload
            v-model="files"
            prompt="Drop your photos here or click to upload!"
            accept="image/*"
          />
        </div>
      </div>

      <button class="button is-primary">List item!</button>
    </form>
  </div>
</template>

<script>
import FileUpload from '@/components/common/FileUpload'
import SearchAutocomplete from '@/components/common/SearchAutocomplete'
import axios from 'axios'

export default {
  name: 'item-form',
  components: {
    FileUpload, SearchAutocomplete
  },
  data: function () {
    return {
      item: '',
      description: '',
      files: [],
      userOption: 'Anyone',
      user: null,
      users: [],
      name: '',
      placeOnStore: true,
      request: null,
      itemFieldTouched: false
    }
  },
  computed: {
    displayUser: function () {
      return this.userOption === 'For someone special'
    },
    names: function () {
      return this.users.map((user) => {
        return user.name
      })
    },
    filteredDataArray () {
      return this.names.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      })
    },
    itemFieldDanger: function () {
      return this.itemFieldTouched && (!this.item || this.item.length === 0)
    }
  },
  mounted: async function () {
    const requestId = this.$route.query.request
    if (this.$route.query.list && this.$route.query.request) {
      const response = await axios({
        method: 'GET',
        url: `/api/requests/${requestId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
        }
      })
      this.request = response.data.id
      this.item = response.data.item
      this.userOption = 'For someone special'
      this.user = response.data.user.id
      this.name = response.data.user.name
    }
    await this.getUsers()
  },
  methods: {
    handleRecievedFiles (files) {
      this.files = Array.from(files)
    },
    handleAutocompleteSelection (option) {
      const user = this.users.filter((user) => {
        return user.name === option
      })[0]
      if (user) {
        this.user = user.id
      }
    },
    async upload (e) {
      if (this.itemFieldDanger) {
        return
      }
      const formData = new FormData()
      formData.append('name', this.item)
      formData.append('description', this.description)
      formData.append('userOption', this.userOption)
      formData.append('user', this.userOption === 'For someone special' ? this.user : '')
      if (this.request) {
        formData.append('request', this.request)
      }
      this.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file, file.name)
      })
      const results = 'test' // await Api.postItem(formData)
      if (results) {
        this.$toast.open({
          message: 'Item listed!',
          type: 'is-success'
        })
        Object.assign(this.$data, this.$options.data())
      }
    },
    async getUsers () {
      const response = await axios({
        method: 'GET',
        url: '/api/users',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
        }
      })
      this.users = response.data
    }
  }
}
</script>

<style scoped>
</style>

