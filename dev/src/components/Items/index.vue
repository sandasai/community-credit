<template>
<div class="container is-large">
  <b-modal :active.sync="imageGalleryActive">
    <gallery :images="images.map(image => image.url)" @trash="deleteImage"/>
  </b-modal>

  <div class="columns section-item-images">
    <div v-if="images.length > 0" class="column is-one-third">
      <div class="images">
        <carousel :perPage="1">
          <slide v-if="images" v-for="image in images" :key="image.url" @click.native="imageGalleryActive = true">
            <img v-bind:src="transformCarouselImageUrl(image.url)" alt="Placeholder image">
          </slide>
        </carousel>
      </div>
    </div>
    <b-modal :active.sync="uploading" has-modal-card>
      <image-upload-card :item_id="id" @upload="getItem"/>
    </b-modal>

    <div class="column section-item-info">
      <template v-if="!editing">
        <h1 class="title">{{ name }}</h1>
      </template>
      <template v-else>
        <b-field>
          <b-input v-model="editingName"></b-input>
        </b-field>
      </template>
      <p class="is-size-5">Owned by: <a>{{ owner.name }}</a></p>
      <p class="is-size-5">Held by: <a>{{ holder.name }}</a></p>
      <p class="is-size-5">Status:
        <span v-if="holder_id !== myId || owner_id !== myId">{{ status }}</span>
        <b-dropdown v-else hoverable @change="changeStatus">
          <a slot="trigger">
            <span>{{ status }}</span>
          </a>
          <b-dropdown-item value="Available">
            Available
          </b-dropdown-item>
          <b-dropdown-item value="Unavailable">
            Unavailable
          </b-dropdown-item>
          <b-dropdown-item value="Removed from store">
            Remove from store
          </b-dropdown-item>
        </b-dropdown>
      </p>

      <br>

      <div class="item-header-actions">
        <a class="button" @click="like">
          <span class="icon is-small">
            <i class="fa" :class="{ 'fa-heart liked': liked, 'fa-heart-o': !liked }"></i>
          </span>
          <span>{{ likes.length }} Likes</span>
        </a>
        <a class="button" @click="request">
          <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
          <span>{{ requested ? 'Cancel Request' : 'Request' }}</span>
        </a>
        <template v-if="status === 'Available'">
          <a class="button" disabled>
            <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
            <span>Request</span>
          </a>
        </template>
        <template v-if="myId === owner_id">
          <template v-if="!editing">
            <a class="button" @click="editing = true">
              <span>Edit</span>
            </a>
          </template>
          <template v-else>
            <a class="button" @click="saveEdit">
              <span>Save</span>
            </a>
            <a class="button" @click="resetEdit">
              <span>Cancel</span>
            </a>
          </template>
        </template>
        <a class="button" disabled>
          <span>Wishlist</span>
        </a>
        <a class="button" @click="uploading = true">
          <i class="fa fa-camera" />&nbsp;
          Add a photo
        </a>
      </div>

      <br>

      <template v-if="!editing">
        <div class="content">{{ this.description }}</div>
      </template>
      <template v-else>
        <b-field>
          <b-input v-model="editingDescription" type="textarea" />
        </b-field>
      </template>
    </div>
  </div>

  <div class="section-item-info">
    <h2 class="title is-size-5">History</h2>
    <div class="content">
      <a class="button"
        @click="action === 'comment' ? action = null : action = 'comment'">
        <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
        <span>Comment</span>
      </a>
      <a class="button"
        v-if="!canDropoff"
        @click="action === 'pickup' ? action = null : action = 'pickup'">
        <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
        <span>Pick up</span>
      </a>
      <a class="button"
        v-if="canDropoff"
        @click="action === 'dropoff' ? action = null : action = 'dropoff'">
        <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
        <span>Drop off</span>
      </a>
    </div>
    <item-comment-form
      v-if="action === 'comment'"
      @submit="handleItemLogSubmit"
    />
    <item-transfer-form
      v-if="action === 'pickup' || action === 'dropoff'"
      :holder="holder_id"
      @submit="handleItemLogSubmit"
      :initialHolderName="holder.name  || null"
    />
    <log-entry v-for="log in logs" :key="log.id"
      :id="log.id"
      :type="log.type"
      :date="log.updated_at"
      :message="log.message"
      :userMessage="log.user_message"
      :canDelete="log.type === 'comment' && (log.user_id === myId || log.owner_id === myId)"
      @submit="handleItemLogSubmit"
    />
  </div>
</div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import CommentFeed from '@/components/common/CommentFeed'
import ImageUploadCard from './ImageUploadCard'
import Gallery from '@/components/common/Gallery'
import ItemCommentForm from './ItemCommentForm'
import ItemTransferForm from './ItemTransferForm'
import axios from 'axios'
import LogEntry from './LogEntry2'

export default {
  name: 'item-page',
  components: {
    Carousel, Slide, CommentFeed, ImageUploadCard, Gallery, ItemCommentForm, ItemTransferForm, LogEntry
  },
  data: function () {
    return {
      action: null,
      item: {},
      editing: false,
      editingName: '',
      editingDescription: '',
      uploading: false,
      imageGalleryActive: false,
      id: -1000,
      name: '',
      description: '',
      owner: {},
      holder: {},
      owner_id: -1000,
      holder_id: -1000,
      status: 'Not ready',
      images: [],
      likes: [],
      logs: [],
      liked: false,
      requested: false
    }
  },
  computed: {
    imageUrls: function () {
      return this.images.map(image => {
        return image.url
      })
    },
    canDropoff: function () {
      return this.myId === this.holder_id
    }
  },
  mounted: async function () {
    // this.resetEdit()
    await this.getItem()
    this.resetEdit()
  },
  methods: {
    getItem: async function () {
      try {
        let response = await axios({
          method: 'GET',
          url: `/api/items/${this.$route.params.id}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        this.item = response.data
        Object.assign(this, response.data)
      } catch (err) {
        this.$router.push({ name: '404' })
      }
    },
    postComment: async function (comment) {
      await this.$store.dispatch('postItemComment', { id: this.id, comment: comment })
    },
    saveEdit: async function () {
      try {
        await axios({
          method: 'PUT',
          url: `/api/items/${this.$route.params.id}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          },
          data: {
            name: this.editingName,
            description: this.editingDescription
          }
        })
        this.$toast.open({
          message: 'Item updated',
          type: 'is-success'
        })
        await this.getItem()
      } catch (err) {
        this.$toast.open({
          message: 'Unable to update :(',
          type: 'is-danger'
        })
      }
      this.resetEdit()
    },
    resetEdit: function () {
      this.editing = false
      this.editingName = this.name
      this.editingDescription = this.description
    },
    changeStatus: async function (status) {
      try {
        await axios({
          method: 'PUT',
          url: `/api/items/${this.$route.params.id}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          },
          data: {
            status
          }
        })
        this.$toast.open({
          message: 'Item updated',
          type: 'is-success'
        })
        await this.getItem()
      } catch (err) {
        this.$toast.open({
          message: 'Unable to update :(',
          type: 'is-danger'
        })
      }
    },
    like: async function () {
      try {
        await axios({
          method: this.liked ? 'DELETE' : 'POST',
          url: `/api/items/${this.$route.params.id}/likes`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        await this.getItem()
      } catch (err) {
        this.$toast.open({
          message: 'Error posting like',
          type: 'is-danger'
        })
      }
    },
    deleteImage: async function (index) {
      // await Api.deleteImage(this.item.images[index].id)
      await this.$store.dispatch('getItem', this.item.id)
    },
    request: async function () {
      try {
        await axios({
          method: this.requested ? 'DELETE' : 'POST',
          url: `/api/items/${this.$route.params.id}/requests`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        this.$toast.open({
          message: this.requested ? `Request canceled` : `${this.name} requested!`,
          type: this.requested ? 'is-default' : 'is-success'
        })
        await this.getItem()
      } catch (err) {
        this.$toast.open({
          message: `Error ${this.requested ? 'DELETE' : 'POST'} request`,
          type: 'is-danger'
        })
      }
    },
    handleItemLogSubmit: async function () {
      this.action = null
      await this.getItem()
    },
    transformCarouselImageUrl: function (cloudinaryUrl) {
      const pos = cloudinaryUrl.search('upload/') + 'upload/'.length
      const transformation = 'c_lpad,g_center,h_300,w_400'
      return cloudinaryUrl.slice(0, pos) + transformation + '/' + cloudinaryUrl.slice(pos)
    },
    transformCarouselImageUrlSameWidth: function (url) {
      const pos = url.search('upload/') + 'upload/'.length
      const transformation = 'c_scale,h_500'
      return url.slice(0, pos) + transformation + '/' + url.slice(pos)
    }
  }
}
</script>

<style scoped>
.item-header-actions {
  flex: 0 0 100%;
}

.fa-heart.liked {
  color: #F1453D;
}

.section-item-images {
  padding: 25px 0;
}

.section-item-info {
  padding: 0 25px;
}
</style>
