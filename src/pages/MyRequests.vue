<template>
  <section class="my-requests">
    <h1 class="my-5 mx-5">My Request</h1>
    <v-container class="items">
      <v-row class="filters">
        <v-col
          cols="12"
          lg="10"
          md="8"
          sm="12"
        >
          <v-select
            :items="typeRequest"
            label="Types"
            v-model="typeRequestSelect"
          />
        </v-col>
        <v-col
          class="d-flex justify-space-between"
          cols="12"
          lg="2"
          md="4"
          sm="12"
        >
          <v-btn
            class="mr-2"
            :outlined="!switchOne"
            fal
            color="var(--base-color)"
            @click="switchOne = true"
          >
            <font-awesome-icon
              class="icon"
              icon="table"
            />
          </v-btn>
          <v-btn
            :outlined="switchOne"
            color="var(--base-color)"
            @click="switchOne = false"
          >
            <font-awesome-icon
              class="icon"
              icon="list-ul"
            />
          </v-btn>
        </v-col>
      </v-row>
      <div
        v-if="switchOne"
        class="d-flex align-end search"
      >
        <v-text-field
          v-model="search"
          label="Search"
          color="var(--base-color)"
          single-line
          hide-details
        />
        <v-btn
          text
          color="var(--base-color)"
          @click="search = ``"
        >
          CLEAR
        </v-btn>
      </div>
      <v-data-table
        v-if="switchOne"
        :headers="headers"
        :items="filterMyRequests"
        :items-key="filterMyRequests"
        :sort-by="['dateFrom']"
        :sort-desc="[false, true]"
        :search="search"
        multi-sort
        class="mt-8 elevation-1 my-table"
      >
        <template #item.typeRequest="{ item }">
          <v-chip
            class="type-request"
            :color="item.color"
          >
            {{ item.typeRequest }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip
            class="status"
            title="APPROVED"
            v-if="item.status === 'approved'"
            color="green"
          >
            <font-awesome-icon
              class="icon"
              icon="thumbs-up"/>
          </v-chip>
          <v-chip
            class="status"
            title="DECLINED"
            v-if="item.status === 'declined'"
            color="red"
          >
            <font-awesome-icon
              class="icon declined"
              icon="thumbs-up"/>
          </v-chip>
        </template>
        <template #item.description="{ item }">
          <div class="description">
            <span>{{ item.description }}</span>
          </div>
        </template>
        <template #item.action="{ item }">
          <div class="actions">
            <v-chip
              class="mr-4 my-2"
              title="EDIT"
              outlined
              :to="{ name: 'myRequest.edit', params: { id:item.id  } }"
            >
              <font-awesome-icon
                class="icon"
                icon="pen"
              />
            </v-chip>
            <v-dialog
              v-model="dialog"
              width="600"
            >
              <template #activator="{ on }">
                <v-chip
                  title="DELETE"
                  outlined
                  v-on="on"
                  @click="currentRequestId = item.id"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="trash-alt"/>
                </v-chip>
              </template>
              <v-card>
                <v-card-text class="dialog-message">
                  <span>Are you sure you want to delete this request?</span>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-around">
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="dialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="remove(currentRequestId)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-data-table>
      <v-row
        class="list"
        v-else
      >
        <v-col
          cols="12"
          v-for="request in filterMyRequests"
          :key="request.id"
        >
          <v-card
            class="overflow-hidden"
            color="grey lighten-1"
          >
            <v-toolbar
              flat
              color="grey"
            >
              <v-toolbar-title class="font-weight">
                <v-chip
                  class="type-request"
                  :color="request.color"
                >
                  {{ request.typeRequest }}
                </v-chip>
              </v-toolbar-title>
              <v-spacer/>
              <v-btn
                class="mr-4 list-actions"
                title="EDIT"
                text
                fab
                small
                :disabled="request.dateTo < dateNow"
                :to="{ name: 'myRequest.edit', params: { id:request.id  } }"
              >
                <font-awesome-icon
                  class="icon"
                  icon="pen"
                />
              </v-btn>
              <v-dialog
                v-model="dialog"
                width="600"
              >
                <template #activator="{ on }">
                  <v-btn
                    class="list-actions"
                    title="DELETE"
                    text
                    fab
                    small
                    v-on="on"
                    @click="currentRequestId = request.id"
                  >
                    <font-awesome-icon
                      class="icon"
                      icon="trash-alt"
                    />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text class="dialog-message">
                    <span>Are you sure you want to delete this request?</span>
                  </v-card-text>
                  <v-card-actions class="d-flex justify-space-around">
                    <v-btn
                      color="var(--base-color)"
                      text
                      @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="var(--base-color)"
                      text
                      @click="remove(currentRequestId)"
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-card-text class="item-description">
              <span>{{ request.description }}</span>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer/>
              <v-card-text class="card-footer">
                <v-row>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                  >
                    <div class="d-flex flex-column">
                      <span>Date from:</span>
                      <hr>
                      <span class="date-item">{{ request.dateFrom }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                  >
                    <div class="d-flex flex-column">
                      <span>Date to:</span>
                      <hr>
                      <span>{{ request.dateTo }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                  >
                    <div class="d-flex flex-column">
                      <span>Time from:</span>
                      <hr>
                      <span>{{ request.timeFrom }}</span>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    sm="12"
                  >
                    <div class="d-flex flex-column">
                      <span>Time to:</span>
                      <hr>
                      <span>{{ request.timeTo }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'MyRequests',
  created () {
    document.title = 'My requests'
  },
  data () {
    const dateNow = moment(new Date()).format().substr(0, 10)
    return {
      dateNow: dateNow,
      currentRequestId: null,
      dialog: false,
      headers: [
        {
          text: 'Type Request(edit)',
          align: 'left',
          value: 'typeRequest'
        },
        { text: 'Status', value: 'status' },
        { text: 'Description', value: 'description' },
        { text: 'Date from', value: 'dateFrom' },
        { text: 'Date to', value: 'dateTo' },
        { text: 'Time from', value: 'timeFrom' },
        { text: 'Time to', value: 'timeTo' },
        {
          text: 'Actions',
          value: 'action',
          sortable: false,
          align: 'center'
        }
      ],
      typeRequest: ['All', 'Vacation', 'Availability', 'Sick'],
      typeRequestSelect: 'All',
      switchOne: true,
      search: ''
    }
  },
  computed: {
    ...mapState('requests', ['myRequests']),
    filterMyRequests () {
      if (this.typeRequestSelect !== 'All') {
        return this.myRequests
          .filter(request => (
            request.typeRequest === this.typeRequestSelect
          ))
      } else {
        return this.myRequests
      }
    }
  },
  methods: {
    ...mapActions('requests', ['fetchMyRequests', 'deleteRequest']),
    remove (id) {
      this.dialog = false
      this.deleteRequest(id)
        .then(res => {
          if (res.status === 200) {
            this.fetchMyRequests()
          }
        })
    }
  },
  mounted () {
    this.fetchMyRequests()
  }
}
</script>

<style lang="scss" scoped>
.dialog-message {
  font-size: 1.5rem;
  font-weight: bold;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  & span {
    padding-top: 20px;
  }
}

.my-requests {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-size: 1.2rem;
  text-transform: uppercase;
  margin-bottom: 100px;

  & .items {
    width: 90vw;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;

    & .filters {
      width: 40vw !important;
      min-height: 100px;
    }

    & .filters:nth-child(n) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40vw;
      min-width: 300px;
    }

    & .search {
      width: 100%;
    }

    & .my-table {
      width: 95vw;

      & .type-request {
        width: 7rem;
        justify-content: center;
      }

      & .description {
        width: 30vw;
        min-width: 200px;
        font-size: 1.2rem;
        text-transform: none;
        word-wrap: break-word;
      }

      & .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
      }

      & .status {
        width: 2.2rem;
        height: 2.2rem;
        font-size: 1.5rem;
        border-radius: 50%;

        & svg {
          transform: translateX(-4px);
        }

        & .declined {
          transform: rotate(180deg) translate(4px, -3px);
        }
      }
    }

    & .list {
      width: 50vw;
      min-width: 300px;

      &-actions {
        font-size: 1.2rem;
      }
    }

    & .item-description {
      text-transform: none;
      font-size: 1rem;
    }

    & .card-footer {
      display: flex;
      justify-content: space-between;

      & span:first-child {
        font-size: 0.7rem;
      }

      & span:last-child {
        font-size: 1rem;
      }
    }
  }
}
</style>
