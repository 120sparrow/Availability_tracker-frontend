<template>
  <article>
    <v-form
      v-if="requestType.length > 0"
      class="re-form"
      ref="form"
      lazy-validation
      @submit.prevent="submit"
      @reset.prevent="reset"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="form.typeRequest"
              color="var(--base-color)"
              :items="typeRequest"
              :rules="requestTypeRules"
              label="Type request"
              @input="validate"
              required
            />
          </v-col>
          <v-col
            class="form-date"
            cols="12"
            md="6"
          >
            <v-label>Date From</v-label>
            <v-date-picker
              year-icon="mdi-calendar-blank"
              v-model="form.dateFrom"
              reactive
              color="var(--base-color)"
              full-width
              :allowed-dates="allowedDates"
              show-current
              :min="form.dateNow"
              @click:date="validate"
              :events="functionEventsDate"
              :disabled="inputDisabled"
            />
          </v-col>
          <v-col
            class="form-date"
            cols="12"
            md="6"
          >
            <v-label>Date to</v-label>
            <v-date-picker
              year-icon="mdi-calendar-blank"
              v-model="form.dateTo"
              reactive
              color="var(--base-color)"
              full-width
              :allowed-dates="allowedDates"
              show-current
              :min="form.dateFrom >= form.dateNow ? form.dateFrom : form.dateNow"
              @click:date="validate"
              :events="functionEventsDate"
              :disabled="inputDisabled"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.timeFrom"
              label="Time from"
              color="var(--base-color)"
              :rules="timeDisabled ? [true] : timeRules"
              type="time"
              @input="validate"
              required
              :disabled="timeDisabled"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.timeTo"
              label="Time to"
              color="var(--base-color)"
              :rules="timeDisabled ? [true] : timeRules"
              type="time"
              @input="validate"
              required
              :disabled="timeDisabled"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Description"
              :rules="descriptionRules"
              color="var(--base-color)"
              auto-grow
              outlined
              :counter="500"
              maxlength="500"
              rows="5"
              row-height="20"
              @input="validate"
              required
              :disabled="inputDisabled"
            />
          </v-col>
          <v-col
            class="d-flex justify-space-between flex-md-row flex-column align-sm-start"
            cols="12"
          >
            <v-btn
              :disabled="!isValid"
              class="my-3"
              color="success"
              type="submit"
            >
              Submit
            </v-btn>
            <v-btn
              class="my-3"
              color="error"
              @click="reset"
            >
              Reset Form
            </v-btn>
            <v-btn
              v-if="requestEdit"
              class="my-3"
              color="error"
              @click="resetData"
            >
              Reset Data
            </v-btn>
            <v-btn
              class="my-3"
              color="warning"
              @click="resetValidation"
            >
              Reset Validation
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

function createForm () {
  const dateNow = moment(new Date()).format().substr(0, 10)
  return {
    typeRequest: null,
    dateNow: dateNow,
    dateFrom: dateNow,
    dateTo: dateNow,
    timeFrom: '',
    timeTo: '',
    description: ''
  }
}

export default {
  name: 'TheRequestForm',
  props: {
    requestEdit: Object
  },
  data () {
    const form = createForm()
    if (this.requestEdit) {
      Object.assign(form, this.requestEdit)
    }
    return {
      isValid: false,
      form: form,
      typeRequest: [],
      inputDisabled: true,
      timeDisabled: true,
      requestTypeRules: [v => !!v || 'Type request is required'],
      timeRules: [v => !!v || 'Time is required'],
      descriptionRules: [v => !!v || 'Description is required'],
      select: null
    }
  },
  computed: {
    ...mapState('requests', ['myRequests', 'requestType']),
    myRequestsData () {
      return this.myRequests.filter(t => (t.dateTo >= this.form.dateNow))
    },
    functionEventsDate () {
      return this.month ? this.monthFunctionEvents : this.dateFunctionEvents
    }
  },
  methods: {
    ...mapActions('requests', ['fetchMyRequests', 'fetchRequestType']),
    allowedDates (date) {
      for (let i of this.myRequestsData) {
        if (date >= i.dateFrom && date <= i.dateTo) {
          return (this.requestEdit && this.requestType.length !== 0)
            ? (
              this.requestEdit.id === i.id ||
              i.timePeriod
            )
            : false
        }
      }
      return true
    },
    dateFunctionEvents (date) {
      for (let i of this.myRequestsData) {
        if (date >= i.dateFrom && date <= i.dateTo) {
          return (this.requestEdit &&
            this.requestEdit.dateFrom <= date &&
            this.requestEdit.dateTo >= date)
            ? [i.color, 'black']
            : i.color
        }
      }
      return false
    },
    monthFunctionEvents () {
      return false
    },
    validate () {
      this.isValid = !!this.$refs.form.validate()
      if (this.form.dateFrom > this.form.dateTo) {
        this.form.dateTo = this.form.dateFrom
      }
      if (this.form.typeRequest && this.requestType.length !== 0) {
        this.inputDisabled = false
        if (this.requestType
          .filter(t => t.slug === this.form.typeRequest)[0].timePeriod ||
          this.requestType.timePeriod) {
          this.timeDisabled = false
        } else {
          this.form.timeFrom = ''
          this.form.timeTo = ''
          this.timeDisabled = true
        }
      }
    },
    submit () {
      this.$emit('change', ({
        date_from: this.form.dateFrom,
        date_to: this.form.dateTo,
        time_from: this.form.timeFrom,
        time_to: this.form.timeTo,
        description: this.form.description,
        type_id: this.typeRequest.indexOf(this.form.typeRequest) + 1
      }))
    },
    reset () {
      this.form = createForm()
      this.resetValidation()
      this.inputDisabled = true
      this.timeDisabled = true
      this.isValid = false
    },
    resetData () {
      Object.assign(this.form, this.requestEdit)
      this.timeDisabled = this.requestType.timePeriod
      this.validate()
      this.isValid = false
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  },
  mounted () {
    this.fetchMyRequests()
      .then(() => this.fetchRequestType())
      .then(() => {
        if (this.requestEdit) {
          this.validate()
          this.isValid = false
        }
        this.typeRequest = this.requestType.map(item => item.slug)
      })
  }
}
</script>

<style lang="scss" scoped>
.re-form {
  width: 50vw;
  min-width: 300px;

  & .form-date {

    .v-picker {
      border: 1px solid grey;
    }

    & .message {
      height: 20px;

      & .alert {
        padding: 5px;
        font-size: 12px;
      }
    }
  }
}

</style>
