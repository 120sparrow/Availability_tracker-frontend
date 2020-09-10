<template>
  <article class="greetings">
    <div class="bg-image"></div>
    <div class="bg-text">
      <h1>{{ greetingsText }}
        <font-awesome-icon
          v-if="isUserLoggedIn"
          class="icon"
          icon="smile-wink"
        />
        <font-awesome-icon
          v-else
          class="icon"
          icon="grin-alt"
        />
      </h1>
      <login-button/>
    </div>
  </article>
</template>

<script>
import LoginButton from '../components/LoginButton'
import { mapState } from 'vuex'

export default {
  name: 'WelcomePage',
  created () {
    document.title = 'WelcomePage'
  },
  components: {
    LoginButton
  },
  computed: {
    ...mapState('auth', ['isUserLoggedIn']),
    greetingsText () {
      return this.isUserLoggedIn ? 'Good bye ' : 'Welcome to Availability tracker '
    }
  }
}
</script>

<style lang="scss" scoped>
  .greetings {
    background-color: white;
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;

    & h1 {
      font-size: 2rem;
      text-transform: uppercase;
    }

    & .bg-image {
      background-image: url("https://picsum.photos/1920/1080?random");
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    & .bg-text {
      background-color: rgba(0,0,0, 0.8);
      color: white;
      font-weight: bold;
      border: 3px solid #f1f1f1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      width: 80%;
      padding: 20px;
      text-align: center;
    }
  }
</style>
