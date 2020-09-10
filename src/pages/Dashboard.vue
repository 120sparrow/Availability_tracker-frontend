<template>
  <article class="dashboard">
    <h1 class="my-5 mx-5">Availability tracker calendar</h1>
    <the-dashboard-calendar/>
  </article>
</template>

<script>
import TheDashboardCalendar from '../components/TheDashboardCalendar'

export default {
  name: 'Dashboard',
  data () {
    return {
      dataComplete: false
    }
  },
  created () {
    document.title = 'Availability tracker'
  },
  components: {
    TheDashboardCalendar
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  text-transform: uppercase;
}
</style>
