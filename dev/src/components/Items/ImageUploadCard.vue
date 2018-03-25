<template>
  <form @submit="submit">
    <b-loading :active.sync="isLoading"></b-loading>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Upload Image</p>
      </header>
      <section class="modal-card-body has-text-centered">
        <!-- Content ... -->
        <file-upload v-model="files" 
          prompt="Drop your photos here or click to upload!"
          accept="image/*"
        />
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" type="submit">Upload!</button>
        <button class="button" @click="$parent.close()">Cancel</button>
      </footer>
    </div>
  </form>
</template>

<script>
import * as Api from '@/services/api'
import FileUpload from '@/components/common/FileUpload'

export default {
  name: 'image-upload-card',
  data: function () {
    return {
      files: [],
      isLoading: false
    }
  },
  props: ['itemId'],
  components: {
    FileUpload
  },
  methods: {
    submit: async function () {
      const formData = new FormData()
      this.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file, file.name)
      })
      this.isLoading = true
      const image = await Api.postItemImage(this.itemId, formData)
      if (image) {
        this.$toast.open({
          message: 'Photos added!',
          type: 'is-success'
        })
      } else {
        this.$toast.open({
          message: 'Unable to upload photos',
          type: 'is-danger'
        })
      }
      this.$emit('upload')
      this.isLoading = false
      this.$parent.close()
    }
  }
}
</script>
