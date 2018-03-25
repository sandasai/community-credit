<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a class="pagination-previous" v-on:click="handlePrevious">Previous</a>
    <a class="pagination-next" v-on:click="handleNext">Next page</a>
    <ul class="pagination-list">
      <li v-for="link in links"v-bind:key="link.number">
        <a class="pagination-link"
          v-bind:class="{ 'is-current': currentPage === link.number }"
          v-on:click="handleClick(link.number)">{{ link.number }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'pagination',
  data: function () {
    return {
      numButtons: 10
    }
  },
  props: {
    currentPage: Number,
    totalPages: Number
  },
  computed: {
    links: function () {
      let buttons = []
      let lb
      let ub
      if (this.totalPages <= 10) {
        lb = 1
        ub = this.totalPages
      } else if (this.currentPage + this.numButtons / 2 > this.totalPages) {
        lb = this.totalPages - this.numButtons + 1
        ub = this.totalPages
      } else {
        lb = this.currentPage - this.numButtons / 2 + 1
        ub = this.currentPage + this.numButtons / 2
      }
      for (let i = lb; i <= ub; i++) {
        buttons.push({ number: i, selected: this.currentPage === i })
      }
      return buttons
    }
  },
  methods: {
    handleClick: function (number) {
      this.$emit('select', number)
    },
    handleNext: function () {
      this.$emit('select', this.currentPage === this.totalPages ? this.currentPage : this.currentPage + 1)
    },
    handlePrevious: function () {
      this.$emit('select', this.currentPage === 1 ? this.currentPage : this.currentPage - 1)
    }
  }
}
</script>
