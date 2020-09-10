<template>
  <aside class="header mb-5">
    <v-card
      v-if="user"
      class="overflow-hidden"
    >
      <v-app-bar
        color="var(--base-color)"
        dark
        src="https://picsum.photos/1920/1080?random"
      >
        <template #img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
          />
        </template>
        <v-toolbar-title class="header-title hidden-md-and-up">availability tracker</v-toolbar-title>
        <v-spacer class="hidden-md-and-up"/>
        <v-app-bar-nav-icon to="/dashboard" class="ml-1 mt-3">
          <v-img
            src="../assets/logo-customsmobile.svg"
            contain
            aspect-ratio="1"
          />
        </v-app-bar-nav-icon>
        <v-toolbar-title class="header-title hidden-sm-and-down">availability tracker</v-toolbar-title>
        <v-spacer class="hidden-sm-and-down"/>
        <v-btn icon to="/profile" class="btn-icon hidden-sm-and-down mr-4">
        <span>
          <font-awesome-icon class="icon" icon="user"/>
        </span>
        </v-btn>
        <v-btn icon to="/welcome" class="btn-icon hidden-sm-and-down mr-2">
        <span>
          <font-awesome-icon class="icon" icon="sign-out-alt"/>
        </span>
        </v-btn>
        <template #extension>
          <div class="hidden-sm-and-down">
            <v-tabs
              align-with-title
              background-color="transparent"
            >
              <v-tab class="header-tab" to="/dashboard">Calendar</v-tab>
              <v-tab class="header-tab" to="/request_form">Request Form</v-tab>
              <v-tab class="header-tab" to="/my_requests">My Request</v-tab>
              <v-tab v-if="user.isManager" class="header-tab" to="/approval">Approval</v-tab>
            </v-tabs>
          </div>
          <div class="hidden-md-and-up">
            <v-menu
              transition="slide-x-transition"
              bottom
              right
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="menu-button"
                  text
                  dark
                  v-on="on"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="bars"/>
                </v-btn>
              </template>
              <v-list
                rounded
                class="d-flex flex-column"
              >
                <v-chip class="menu-btn close" outlined>
                  <font-awesome-icon
                    style="font-size: 2rem"
                    class="icon delete"
                    icon="plus"
                  />
                </v-chip>
                <v-btn class="menu-btn" text to="/dashboard">Calendar</v-btn>
                <v-btn class="menu-btn" text to="/request_form">Request Form</v-btn>
                <v-btn class="menu-btn" text to="/my_requests">My Request</v-btn>
                <v-btn class="menu-btn" text to="/approval" v-if="user.isManager">Approval</v-btn>
                <v-btn class="menu-btn" text to="/profile">
                  <font-awesome-icon style="font-size: 2rem" class="icon" icon="user"/>
                </v-btn>
                <v-btn class="menu-btn" text to="/welcome">
                  <font-awesome-icon style="font-size: 2rem" class="icon" icon="sign-out-alt"/>
                </v-btn>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-app-bar>
    </v-card>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TheHeader',
  computed: mapState('profile', ['user']),
  methods: {
    ...mapActions('profile', ['fetchUser'])
  },
  mounted () {
    this.fetchUser()
  }
}
</script>

<style lang="scss" scoped>
  .menu-btn {
    font-size: 1.2rem !important;
    height: 60px !important;
  }

  .menu-btn.close {
    align-self: end;
    border: none;
    margin-bottom: 10px;
    transform: rotate(45deg);
  }

.header {
  z-index: 2;
  box-shadow: 0 2px 15px 0 black;

  &-tab {
    font-size: 1.2em;
  }

  & .kkk {
    font-size: 10rem;
  }

  & .overflow-hidden {
    border-radius: 0 !important;
  }

  & .header-title {
    margin-left: 30px;
    text-transform: uppercase;
  }

  & .btn-icon span{
    font-size: 2rem;
  }

  & .menu-button {
    font-size: 2.5rem;
  }
}

</style>
