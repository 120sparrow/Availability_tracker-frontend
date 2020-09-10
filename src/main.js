import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faSignOutAlt,
  faThumbsUp,
  faExclamationTriangle,
  faStop,
  faTrashAlt,
  faListUl,
  faTable,
  faSearch,
  faPen,
  faHandPaper,
  faPlus,
  faCalendarAlt,
  faSmileWink,
  faGrinAlt,
  faBars
} from '@fortawesome/free-solid-svg-icons'
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faUser,
  faSignOutAlt,
  faThumbsUp,
  faExclamationTriangle,
  faStop,
  faTrashAlt,
  faListUl,
  faTable,
  faSearch,
  faPen,
  faHandPaper,
  faPlus,
  faCalendarAlt,
  faSmileWink,
  faGrinAlt,
  faBars
)
library.add(faFontAwesome)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
