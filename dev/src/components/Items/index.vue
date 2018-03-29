<template>
<div>
  <b-modal :active.sync="imageGalleryActive">
    <gallery :images="imageUrls" @trash="deleteImage"/>
  </b-modal>

  <section class="section">
    <div class="columns">

      <div v-if="item.images" class="column is-one-third">
        <div class="images">
          <carousel :perPage="1">
            <slide v-if="item && item.images" v-for="image in item.images" :key="image.url" @click.native="imageGalleryActive = true">
              <img v-bind:src="image.url" alt="Placeholder image">
            </slide>
          </carousel>
        </div>
      </div>
      <b-modal :active.sync="uploading" has-modal-card>
        <image-upload-card :itemId="item.id" @upload="$store.dispatch('getItem', item.id)"/>
      </b-modal>

      <div class="column">
        <div class="section">
          <template v-if="!editing">
            <h1 class="title">{{ item.name }}</h1>
          </template>
          <template v-else>
            <b-field>
              <b-input v-model="editingName"></b-input>
            </b-field>
          </template>

          <p class="is-size-5">Owned by: <a>{{ item.user_name }}</a></p>
          <p class="is-size-5">Held by: <a>{{ item.holder_name }}</a></p>
          <p class="is-size-5">Status:
            <span v-if="item.holder_id !== $store.state.id || item.owner_id !== $store.state.id">{{ item.status }}</span>
            <b-dropdown v-else hoverable @change="changeStatus">
              <a slot="trigger">
                <span>{{ item.status }}</span>
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
                <i class="fa" :class="{ 'fa-heart liked': item.liked, 'fa-heart-o': !item.liked }"></i>
              </span>
              <span>{{ item.likes }} Likes</span>
            </a>
            <template v-if="item.status === 'Available'">
              <a class="button">
                <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
                <span>Request</span>
              </a>
            </template>
            <template v-if="$store.state.id === item.owner_id">
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
            <div class="content">{{ this.item.description }}</div>
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


  <item-log
    :entries="item.entries"
    :item="item"
    :itemId="item.id"
    :requested="item.requested"
    @update="$store.dispatch('getItem', item.id)"/>

  <section class="section">
    <div class="container">
      <h2 class="title is-size-5">Comments</h2>
      <comment-feed :comments="item.comments" @post="postComment"/>
    </div>
  </section>
</div>
</template>

<script>
import * as Api from '@/services/api'
import { Carousel, Slide } from 'vue-carousel'
import CommentFeed from '@/components/common/CommentFeed'
import ImageUploadCard from './ImageUploadCard'
import ItemLog from './Log'
import Gallery from '@/components/common/Gallery'

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
      imageGalleryActive: false
    }
  },
  computed: {
    item: function () {
      return this.$store.state.item
    },
    imageUrls: function () {
      if (!this.item.images) {
        return null
      }
      return this.item.images.map(image => {
        return image.url
      })
    }
  },
  mounted: async function () {
    this.resetEdit()
  },
  methods: {
    postComment: async function (comment) {
      await this.$store.dispatch('postItemComment', { id: this.item.id, comment: comment })
    },
    saveEdit: async function () {
      await this.$store.dispatch('putItem',
        {
          id: this.item.id,
          name: this.editingName,
          description: this.editingDescription
        }
      )
      this.resetEdit()
      this.$toast.open({
        message: 'Item updated',
        type: 'is-success'
      })
    },
    resetEdit: function () {
      this.editing = false
      this.editingName = this.item.name
      this.editingDescription = this.item.description
    },
    changeStatus: async function (status) {
      await Api.putItem(this.item.id, null, null, status)
      await this.$store.dispatch('getItem', this.item.id)
    },
    like: async function () {
      await Api.postLike(this.item.id)
      await this.$store.dispatch('getItem', this.item.id)
    },
    deleteImage: async function (index) {
      await Api.deleteImage(this.item.images[index].id)
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
