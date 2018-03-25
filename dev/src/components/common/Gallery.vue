<template>
<div class="image-gallery">
  <carousel :perPage="1" @pageChange="page => currentPage = page">
    <slide v-for="image in images" :key="image.url">
      <img :src="image" alt="Image unavailable">
    </slide>
  </carousel>
  <a class="button is-inverted is-outlined" @click="trash">
    <span class="icon is-small">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
    </span>
  </a>
</div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  components: {
    Carousel, Slide
  },
  data: function () {
    return {
      currentPage: 0
    }
  },
  props: ['images'],
  methods: {
    trash: function () {
      this.$dialog.confirm({
        message: 'Remove this image?',
        onConfirm: async () => {
          this.$emit('trash', this.currentPage)
        }
      })
    }
  }
}
</script>

<style scoped>
.image-gallery {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}
</style>

