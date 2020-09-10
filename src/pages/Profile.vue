<template>
  <section class="profile">
    <v-card
      v-if="user"
      class="card mx-auto my-3"
      max-width="400"
    >
      <v-img
        class="white--text align-end"
        height="100%"
        src="../assets/User_photo.jpg"
      >
        <v-card-title class="title">User profile:</v-card-title>
      </v-img>
      <v-card-subtitle class="pb-0">User id: {{ form.id }}</v-card-subtitle>
      <v-card-text class="text--primary">
        <div>First name: {{ form.firstName }}</div>
        <div>Last name: {{ form.lastName }}</div>
        <div>User name: {{ form.userName }}</div>
        <div>Email: {{ form.email }}</div>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Profile',
  created () {
    document.title = 'Profile'
  },
  data () {
    return {
      form: {
        id: null,
        firstName: '',
        lastName: '',
        userName: '',
        email: ''
      }
    }
  },
  computed: mapState('profile', ['user']),
  methods: {
    ...mapActions('profile', ['fetchUser'])
  },
  mounted () {
    this.fetchUser()
      .then(() => {
        this.form.id = decodeURIComponent(this.user.id)
        this.form.firstName = decodeURIComponent(this.user.firstName)
        this.form.lastName = decodeURIComponent(this.user.lastName)
        this.form.userName = decodeURIComponent(this.user.userName)
        this.form.email = decodeURIComponent(this.user.email)
      })
  }
}
</script>

<style lang="scss" scoped>
  .profile {

    & .card {
      border-radius: 10px;
      filter: drop-shadow(3px 5px 10px black);

      & .title {
        background-color: rgba(0, 0, 0, .3);
        color: var(--base-color);
      }
    }
  }

</style>
