<template>
  <div class="search-autocomplete">
    <p class="control has-icon has-icon-right">
      <input
        class="input"
        placeholder="Search..."
        @input="onInput($event.target.value)"
        @keyup.esc="isOpen = false"
        @blur="isOpen = false"
        @keydown.down="moveDown"
        @keydown.up="moveUp"
        @keydown.enter="select"
        v-model="keyword"
      >
    </p>
    <ul v-show="isOpen"
      class="options-list"
    >
      <li v-for="(option, index) in options"
        :key="index"
        :class="{
          'highlighted': index === highlightedPosition
        }"
        @mouseenter="highlightedPosition = index"
        @mousedown="select"
      >
        <slot name="item"
          :id="option.id"
          :title="option.title"
          :description="option.description"
          :thumbnail="option.thumbnail"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'search-autocomplete',
  data: function () {
    return {
      isOpen: false,
      highlightedPosition: 0,
      keyword: ''
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    initialKeyword: String
  },
  methods: {
    onInput (value) {
      this.isOpen = !!value
      this.$emit('input', this.keyword)
    },
    moveDown () {
      if (!this.isOpen) {
        return
      }
      this.highlightedPosition = (this.highlightedPosition + 1) % this.options.length
    },
    moveUp () {
      if (!this.isOpen) {
        return
      }
      this.highlightedPosition = this.highlightedPosition - 1 < 0
        ? this.options.length - 1
        : this.highlightedPosition - 1
    },
    select () {
      const selectedOption = this.options[this.highlightedPosition]
      this.keyword = selectedOption.title
      this.isOpen = false
      console.log('bloop', selectedOption)
      this.$emit('select', selectedOption, selectedOption.id)
    }
  },
  mounted: function () {
    this.keyword = this.initialKeyword
  }
}
</script>

<style lang="scss" scoped>

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.search-autocomplete {
  position: relative;
}

ul.options-list {
  display: flex;
  flex-direction: column;
  margin-top: 0px;
  border: 1px solid #dbdbdb;
  border-radius: 0 0 3px 3px;
  position: absolute;
  width: 100%;
  overflow: hidden;
  z-index: 10;
}

ul.options-list li {
  width: 100%;
  flex-wrap: wrap;
  background: white;
  margin: 0;
  border-bottom: 1px solid #eee;
  color: #363636;
  padding: 7px;
  cursor: pointer;
}

ul.options-list li.highlighted {
  background: #f8f8f8
}


</style>
