<template>
<div>
  <b-modal :active.sync="imageGalleryActive">
    <gallery :images="imageUrls" @trash="deleteImage"/>
  </b-modal>

  <section class="section">
    <div class="columns">
      <div v-if="images.length > 0" class="column is-one-third">
        <div class="images">
          <carousel :perPage="1">
            <slide v-if="images" v-for="image in images" :key="image.url" @click.native="imageGalleryActive = true">
              <img v-bind:src="image.url" alt="Placeholder image">
            </slide>
          </carousel>
        </div>
      </div>
      <b-modal :active.sync="uploading" has-modal-card>
        <image-upload-card :item_id="id" @upload="getItem"/>
      </b-modal>

      <div class="column">
        <div class="section">
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
            <a class="button" @click="like" disabled>
              <span class="icon is-small">
                <i class="fa" :class="{ 'fa-heart liked': liked, 'fa-heart-o': liked }"></i>
              </span>
              <span>{{ likes }} Likes</span>
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
    </div>
  </section>

  <!--
  <item-log
    :entries="item.entries"
    :item="item"
    :itemId="item.id"
    :requested="item.requested"
    @update="$store.dispatch('getItem', item.id)"/>
  -->
  <section class="section">
    <div class="container">
      <h2 class="title is-size-5">Comments</h2>
      <!--
      <comment-feed :comments="item.comments" @post="postComment"/>
      -->
    </div>
  </section>
</div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import CommentFeed from '@/components/common/CommentFeed'
import ImageUploadCard from './ImageUploadCard'
import ItemLog from './Log'
import Gallery from '@/components/common/Gallery'
import axios from 'axios'

export default {
  name: 'item-page',
  components: {
    Carousel, Slide, CommentFeed, ImageUploadCard, ItemLog, Gallery
  },
  data: function () {
    return {
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
      likes: 0,
      liked: false
    }
  },
  computed: {
    imageUrls: function () {
      return ['asdf']
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
      // await Api.postLike(this.item.id)
      await this.$store.dispatch('getItem', this.item.id)
    },
    deleteImage: async function (index) {
      // await Api.deleteImage(this.item.images[index].id)
      await this.$store.dispatch('getItem', this.item.id)
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

.images {
  padding: 3rem 0;
}
</style>
