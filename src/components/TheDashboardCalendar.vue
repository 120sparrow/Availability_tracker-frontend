<template>
  <article class="dashboard-calendar">
    <v-container class="calendar pt-0" fluid>
      <div class="header">
        <div class="title">
          <div class="mr-5">
            <v-btn
              outlined
              class="mx-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
            >
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
            >
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
          <div>
            <span>{{ calendarTitle }}</span>
          </div>
        </div>
        <div class="filter">
          <v-select
            :items="years"
            label="Year"
            v-model="selectYear"
            @input="setCalendar(selectYear, selectMonth)"
          />
          <v-select
            :items="months"
            label="Month"
            v-model="selectMonth"
            @input="setCalendar(selectYear, selectMonth)"
          />
        </div>
      </div>
      <div class="body">
        <div class="users">
          <div class="title">
            <span>User</span>
          </div>
          <div
            class="user-name"
            v-for="user of users"
            :key="user.id"
          >
            <span>{{ user.userName }}</span>
          </div>
        </div>
        <div class="calendar-data">
          <div class="days">
            <div
              v-for="(dayWeek, index) of calendarDays"
              :key="index"
              :class="[{ 'day-now': index + 1 === dayMonthNow }, 'day', 'day-week']"
            >
              <div>
                <span>{{ index + 1 }}</span>
              </div>
              <div :class="{ 'free': dayWeek === 'Su' || dayWeek === 'Sa' }">
                <span>{{ dayWeek }}</span>
              </div>
            </div>
          </div>
          <div
            class="days"
            v-for="user in calendarData"
            :key="user.id"
          >
            <div
              class="day req-type"
              v-for="day in user.days"
              :key="day.id"
            >
              <v-menu
                bottom
                class="list"
                v-if="day.request"
                origin="center center"
                transition="scale-transition"
              >
                <template #activator="{ on }">
                  <v-chip
                    class="type"
                    v-on="on"
                    :color="day.request.color"
                    :outlined="day.request.needApproval && day.request.status !== 'approved'"
                  >
                    <span>{{ day.request.typeRequest[0] }}</span>
                  </v-chip>
                </template>
                <v-card>
                  <v-card-text class="d-flex flex-column open-window">
                    <div class="d-flex flex-column">
                      <span class="mb-3">Description:</span>
                      <span>{{ day.request.description }}</span>
                    </div>
                    <div v-if="day.request.timePeriod">
                      <span>Time from: <strong>{{ day.request.timeFrom }}</strong></span>
                      <span>Time to: <strong>{{ day.request.timeTo }}</strong></span>
                    </div>
                    <div
                      v-if="day.request.status === 'declined'"
                      class="d-flex flex-column"
                    >
                      <span class="mb-2">Declined description:</span>
                      <span>{{ day.request.descriptionApproval }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'TheDashboardCalendar',
  data () {
    const yearNow = new Date().getFullYear()
    const monthNow = new Date().getMonth()
    const yers = []
    for (let i = yearNow - 5; i <= yearNow + 10; i++) {
      yers.push(i)
    }
    return {
      days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      calendarDays: [],
      years: yers,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      yearNow: yearNow,
      monthNow: monthNow,
      calendarRenderYear: null,
      calendarRenderMonth: null,
      dayNow: null,
      title: '',
      selectMonth: null,
      selectYear: null
    }
  },
  computed: {
    ...mapState('requests', ['requestsByDate']),
    ...mapState('users', ['users']),
    dayMonthNow () {
      return (
        this.calendarRenderYear === this.yearNow &&
        this.calendarRenderMonth === this.monthNow
      )
        ? moment().date()
        : null
    },
    calendarTitle () {
      return `${this.months[this.calendarRenderMonth]} ${this.calendarRenderYear}`
    },
    lastDay () {
      return moment({
        year: this.calendarRenderYear,
        month: this.calendarRenderMonth
      }).daysInMonth()
    },
    firstDayWeekInMonth () {
      return moment({
        year: this.calendarRenderYear,
        month: this.calendarRenderMonth
      }).day()
    },
    calendarData () {
      return this.users.map(user => {
        user = {
          ...user,
          days: []
        }
        const userRequests = this.requestsByDate.filter(request => request.userId === user.id)
        for (let i = 1; i <= this.lastDay; i++) {
          const date = moment({
            year: this.calendarRenderYear,
            month: this.calendarRenderMonth,
            day: i
          })
          user.days[i - 1] = {
            id: i,
            request: userRequests
              .filter(request => (
                date.isBetween(request.dateFrom, request.dateTo, null, '[]')
              )).pop()
          }
        }
        return user
      })
    }
  },
  methods: {
    ...mapActions('requests', ['fetchRequestsByDate']),
    ...mapActions('users', ['fetchUsers']),
    createCalendar (calendarRenderYear, calendarRenderMonth) {
      this.calendarRenderYear = calendarRenderYear
      this.calendarRenderMonth = calendarRenderMonth
      this.selectMonth = this.months[calendarRenderMonth]
      this.selectYear = calendarRenderYear
      this.calendarDays = []
      for (let i = 0; i < this.lastDay; i++) {
        this.calendarDays.push(this.days[(this.firstDayWeekInMonth + i) % 7])
      }
    },
    setCalendar () {
      this.fetchRequestsByDate({
        year: this.selectYear,
        month: this.months.indexOf(this.selectMonth)
      })
        .then(() => {
          this.createCalendar(this.selectYear, this.months.indexOf(this.selectMonth))
        })
    },
    setToday () {
      this.fetchRequestsByDate({
        year: this.yearNow,
        month: this.monthNow
      })
        .then(() => {
          this.createCalendar(this.yearNow, this.monthNow)
        })
    },
    prev () {
      let prevMonth = this.calendarRenderMonth - 1
      let prevYear = this.calendarRenderYear
      if (prevMonth < 0) {
        prevMonth = 11
        prevYear--
      }
      this.fetchRequestsByDate({
        year: prevYear,
        month: prevMonth
      })
        .then(() => this.createCalendar(prevYear, prevMonth))
    },
    next () {
      let nextMonth = this.calendarRenderMonth + 1
      let nextYear = this.calendarRenderYear
      if (nextMonth === 12) {
        nextMonth = 0
        nextYear++
      }
      this.fetchRequestsByDate({
        year: nextYear,
        month: nextMonth
      })
        .then(() => this.createCalendar(nextYear, nextMonth))
    }
  },
  beforeMount () {
    this.fetchUsers()
      .then(() => this.setToday())
  }
}
</script>

<style lang="scss" scoped>
  .open-window {
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: rgba(20,20,20, .2);

    & div:first-child {
      font-size: 1.2rem;
      padding-top: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--table-color);
    }

    & div:last-child {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
    }
  }

.dashboard-calendar {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;

  & .calendar {
    width: 97vw;
    display: flex;
    flex-direction: column;
    background-color: white;

    & .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--table-color);

      & .title {
        display: flex;
        align-items: center;
      }

      & .filter {
        display: flex;
        align-items: center;

        & .v-input {
          width: 100px;
          margin-left: 20px;
        }
      }
    }

    & .body {
      display: flex;

      & .users {
        display: flex;
        flex-direction: column;

        & .title {
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid var(--table-color);

          & span {
            font-size: 1rem;
          }
        }

        & .user-name {
          height: 60px;
          padding: 0 10px;
          font-size: 0.9rem;
          display: flex;
          justify-content: start;
          align-items: center;
          border-bottom: 1px solid var(--table-color);

          @media screen and (min-width: 500px) {
            & span {
              white-space: nowrap;
            }
          }
        }
      }

      & .calendar-data {
        flex-grow: 1;
        overflow: auto;

        & .days {
          width: 2000px;
          height: 60px;
          display: flex;

          & .day {
            flex-basis: 80px;
            display: flex;
            height: 60px;
            border-bottom: 1px solid var(--table-color);
          }

          & .day-now {
            color: var(--base-color);
            font-weight: 900;
            border: 1px solid var(--base-color);
          }

          & .day-week {
            flex-direction: column;
            justify-content: space-around;
            align-items: center;

            & div:first-child {
              font-size: 0.9rem;
              font-weight: 500;
            }

            & div:last-child {
              font-size: 1rem;
              text-transform: none;
            }

            & .free {
              color: rgba(255,40,40, .8);
            }
          }

          & .req-type {
            justify-content: center;
            align-items: center;

            & .type {
              width: 100%;
              height: 100%;
              font-size: 1.5rem;
              background-color: white;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 0;
            }
          }
        }
      }
    }
  }
}
</style>
