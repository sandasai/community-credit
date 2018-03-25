<template>
  <div class="section">
    <div class="container is-fluid">
      <div class="columns is-desktop">
        <div class="column is-two-thirds-desktop">
          <h1 class="title is-one"><strong>Welcome to Community Credit!</strong></h1>
          <h3 class="subtitle is-three">Community Credit is a cooperative system between you and your friends for borrowing and sharing personal items.</h3>
          <p>Collaborate with your friends</p>
          <div class="content">
            <ul>
              <li>Organizing a LAN party and need extra controllers or a game console? Borrow it!</li>
              <li>You bought old textbooks for a class and would rather not think it about again? Share it!</li>
              <li>Planning a climbing trip but you don't have equipment or a tent? Ask your friends!</li>
              <li>Are you hoarding a bunch of ebooks? Share it with others who are living far away!</li>
              <li>Only use your vacuum cleaner once a year? Your friends need clean homes!</li>
            </ul>
          </div>
        </div>
        <div class="column is-one-third-desktop">
          <h1 class="title is-4" style="text-align: center;"><strong>Sign Up</strong></h1>
          <sign-up />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignUp from './SignUp'

export default {
  name: 'home-page',
  components: {
    SignUp
  }
}
</script>
