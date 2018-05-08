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

function initialData () {
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
}

export default {
  name: 'item-form',
  components: {
    FileUpload, SearchAutocomplete
  },
  data: function () {
    return initialData()
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
      // first upload metadata
      try {
        let response = await axios({
          method: 'POST',
          url: '/api/items',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          },
          data: {
            name: this.item,
            description: this.description,
            user_id: this.userOption === 'For someone special' ? this.user : undefined,
            request_id: this.request ? this.request : undefined
          }
        })
        const newItemId = response.data.id
        // then upload any images
        if (this.files.length > 0) {
          const formData = new FormData()
          this.files.forEach((file, index) => {
            formData.append(`files[${index}]`, file, file.name)
          })
          response = await axios.post(`/api/items/${newItemId}/images`, formData, {
            headers: {
              'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
            }
          })
        }
      } catch (err) {
        this.$toast.open({
          message: 'Unable to post your item! :(',
          type: 'is-danger'
        })
      }
      Object.assign(this.$data, initialData())
      await this.getUsers()
      this.$toast.open({
        message: 'Item listed!',
        type: 'is-success'
      })
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

