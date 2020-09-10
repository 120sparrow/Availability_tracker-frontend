<template>
  <section class="request">
    <h1 class="my-5 mx-5">Request Form</h1>
    <the-request-form @change="sendFormData"></the-request-form>
    <div class="message" v-if="success">
      <v-alert class="alert" type="success">
        Request <span>create</span> complete
        <font-awesome-icon
          class="icon"
          icon="thumbs-up"/>
      </v-alert>
    </div>
    <div class="message" v-if="requestFail">
      <v-alert class="alert" type="error">
        Request <span>create</span> error :(
      </v-alert>
    </div>
  </section>
</template>

<script>
import TheRequestForm from '../components/TheRequestForm'
import { mapActions } from 'vuex'

export default {
  name: 'RequestForm',
  created () {
    document.title = 'Request form'
  },
  data: () => ({
    success: false,
    requestFail: false
  }),
  components: {
    TheRequestForm
  },
  methods: {
    ...mapActions('requests', ['createRequest']),
    sendFormData (data) {
      this.createRequest(data)
        .then(res => {
          if (res.status === 200) {
            this.success = true
            setTimeout(() => {
              this.success = false
              this.$router.push({ name: 'dashboard' })
            }, 2000)
          } else {
            this.requestFail = true
            setTimeout(() => {
              this.requestFail = false
            }, 2000)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.request {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-size: 1.2rem;
  text-transform: uppercase;

  & .message {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    background-color: rgba(0,0,0, .5);

    & .alert {
      font-size: 1.5rem;
      text-align: center;

      & span {
        font-size: 2rem;
      }
    }
  }
}
</style>
