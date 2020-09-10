<template>
  <div>
    <v-btn
      color="rgba(0, 250, 0, 0.4)"
      height="6rem" width="15rem"
      :href="buttonProperties.link"
      class="login-button my-4"
    >
      <span>{{buttonProperties.buttonName}}</span>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LoginButton',
  methods: {
    ...mapActions('auth', ['isSessionExist'])
  },
  computed: {
    ...mapState('auth', ['isUserLoggedIn']),
    buttonProperties () {
      return {
        link: this.isUserLoggedIn ? 'http://cm.availability.ua/api/v1/auth/logout' : 'http://cm.availability.ua/api/v1/auth/google',
        buttonName: this.isUserLoggedIn ? 'LOGOUT' : 'LOGIN'
      }
    }
  }
}
</script>

<style scoped>
  .login-button {
    color: white;
    border-radius: 10px;
    font-size: 2.5em;
    transition: all 0.5s;
  }

  .login-button span {
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }

  .login-button span:after {
    content: '\00bb';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }

  .login-button:hover span {
    padding-right: 25px;
  }

  .login-button:hover span:after {
    opacity: 1;
    right: 0;
  }
</style>
