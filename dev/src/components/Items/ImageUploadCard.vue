<template>
  <form>
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
        <button class="button is-success" type="submit" @click="submit">Upload!</button>
        <button class="button" @click="$parent.close()">Cancel</button>
      </footer>
    </div>
  </form>
</template>

<script>
import FileUpload from '@/components/common/FileUpload'
import axios from 'axios'

export default {
  name: 'image-upload-card',
  data: function () {
    return {
      files: [],
      isLoading: false
    }
  },
  props: ['item_id'],
  components: {
    FileUpload
  },
  methods: {
    submit: async function () {
      this.isLoading = true
      const formData = new FormData()
      this.files.forEach(function (file, index) {
        formData.append(`files[${index}]`, file, file.name)
      })
      try {
        await axios.post(`/api/items/${this.item_id}/images`, formData, {
          headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        this.$toast.open({
          message: 'Image posted!',
          type: 'is-success'
        })
        this.$emit('upload', this.files)
      } catch (err) {
        this.$toast.open({
          message: 'Unable to upload image',
          type: 'is-danger'
        })
      }

      this.isLoading = false
      this.$parent.close()
    }
  }
}
</script>
