<template>
  <div class="container">
    <div class="center">
      <h1 class="title is-4">Sign Up for Community Credit</h1>
      <sign-up />
      <div class="box" style="text-align: center">
        <p>Already have an account?<br><router-link to='/login'>Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import SignUp from '@/components/SignUp'

export default {
  components: {
    SignUp
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

.box {
  text-align: left;
  margin: 10px 10px;
  width: 350px;
  max-width: 50%;
}
</style>
