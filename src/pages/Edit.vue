<template>
  <section class="request_edit">
    <h1>Edit</h1>
    <TheRequestForm
      v-if="request"
      :requestEdit="request"
      @change="sendFormData"
    />
    <div class="message" v-if="success">
      <v-alert class="alert" type="success">
        Request <span>edit</span> complete
        <font-awesome-icon
        class="icon"
        icon="thumbs-up" />
      </v-alert>
    </div>
    <div class="message" v-if="requestFail">
      <v-alert class="alert" type="error">
        Request <span>edit</span> error :(
      </v-alert>
    </div>
  </section>
</template>

<script>
import TheRequestForm from '../components/TheRequestForm'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Edit',
  created () {
    document.title = 'Request Edit'
  },
  data: () => ({
    success: false,
    requestFail: false
  }),
  components: {
    TheRequestForm
  },
  computed: mapState('requests', ['request']),
  methods: {
    ...mapActions('requests', ['fetchRequestById', 'editRequest']),
    sendFormData (data) {
      this.editRequest({
        requestId: this.$route.params.id,
        data: data
      })
        .then(res => {
          if (res.status === 200) {
            this.success = true
            setTimeout(() => {
              this.success = false
              this.$router.push({ name: 'myRequests' })
            }, 2000)
          } else {
            this.requestFail = true
            setTimeout(() => {
              this.requestFail = false
            }, 2000)
          }
        })
    }
  },
  beforeMount () {
    return this.fetchRequestById(this.$route.params.id)
  }
}
</script>

<style lang="scss" scoped>
.request_edit {
  display: flex;
  flex-direction: column;
  align-items: center;
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
