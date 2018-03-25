<template>
  <section>
    <b-field>
      <b-upload v-model="dropFiles"
        :accept="accept"
        multiple
        drag-drop
        @input="handleFileChange"
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon
                icon="upload"
                size="is-large">
              </b-icon>
            </p>
            <p>{{ prompt }}</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="tags">
      <span v-for="(file, index) in dropFiles"
        :key="index"
        class="tag is-primary" >
        {{file.name}}
        <button class="delete is-small"
          type="button"
          @click="deleteDropFile(index)">
        </button>
      </span>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'file-upload',
    data () {
      return {
        dropFiles: []
      }
    },
    props: {
      'prompt': {
        type: String,
        default: 'Drop your files here or click to upload'
      },
      'accept': {
        default: null
      },
      'value': {
        default: []
      }
    },
    watch: {
      'value': function (val) {
        this.dropFiles = val
      }
    },
    methods: {
      deleteDropFile (index) {
        this.dropFiles.splice(index, 1)
        this.handleFileChange()
      },
      handleFileChange () {
        this.$emit('input', this.dropFiles)
      }
    }
  }
</script>
