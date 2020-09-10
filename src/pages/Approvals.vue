<template>
  <section class="approvals">
    <h1 class="my-5 mx-5">Approvals</h1>
    <v-container
      v-if="requestNeedApproval.length > 0"
      class="items"
    >
      <v-row class="filters">
        <v-col
          cols="12"
          class="d-flex align-end"
          >
          <v-text-field
            v-model="search"
            label="Search"
            color="var(--base-color)"
            single-line
            hide-details
          >
          </v-text-field>
          <v-btn
            text
            color="var(--base-color)"
            @click="search = ``"
          >
            CLEAR
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :loading="fetchDataLoad"
        :headers="headers"
        :items="requestNeedApproval"
        :items-key="requestNeedApproval"
        :sort-by="['dateFrom']"
        :sort-desc="[false, true]"
        :search="search"
        multi-sort
        class="mt-8 elevation-1 my-table"
      >
        <template #item.typeRequest="{ item }">
          <v-chip
            :color="item.color"
          >
            {{ item.typeRequest }}
          </v-chip>
        </template>
        <template #item.description="{ item }">
          <v-card-text class="description">
            <span>{{ item.description }}</span>
          </v-card-text>
        </template>
        <template #item.descriptionApproval="{ item }">
          <v-card-text class="description">
            <span>{{ item.descriptionApproval }}</span>
          </v-card-text>
        </template>
        <template #item.action="{ item }">
          <div class="d-flex justify-space-between">
            <v-chip
              class="actions"
              color="green"
              :outlined="requestNeedApproval.filter(t => (t.id === item.id))[0].status !== 'approved'"
              @click="save(item.id, 'approved')"
              title="APPROVER"
            >
              <font-awesome-icon
                class="icon"
                icon="thumbs-up" />
            </v-chip>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template #activator="{ on }">
                <v-chip
                  class="actions"
                  color="red"
                  :outlined="requestNeedApproval.filter(t => (t.id === item.id))[0].status !== 'declined'"
                  v-on="on"
                  @click="form.id = item.id,
                   form.description = item.descriptionApproval"
                  title="DECLINED"
                >
                  <font-awesome-icon
                    class="icon declined"
                    icon="thumbs-up" />
                </v-chip>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Create</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>

                      <v-ol cols="12">
                        <v-textarea
                          v-model="form.description"
                          label="Description"
                          color="var(--base-color)"
                          auto-grow
                          outlined
                          :counter="500"
                          maxlength="500"
                          rows="5"
                          row-height="20"
                        />
                      </v-ol>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="reset"
                  >
                    Reset
                  </v-btn>
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="save(form.id, 'declined')"
                    :disabled="saveDisable"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDelete"
              width="600"
            >
              <template #activator="{ on }">
                <v-chip
                  class="actions"
                  title="DELETE"
                  outlined
                  v-on="on"
                  @click="form.id = item.id"
                  :disabled="!approvals.includes(item.id)"
                >
                  <font-awesome-icon
                    class="icon delete"
                    icon="plus" />
                </v-chip>
              </template>
              <v-card>
                <v-card-text
                  class="dialog-message"
                >
                  <span>Are you sure you want to delete this approval?</span>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-around">
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="dialogDelete = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="var(--base-color)"
                    text
                    @click="remove(form.id)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-data-table>
    </v-container>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Approvals',
  created () {
    document.title = 'Approval'
  },
  data () {
    return {
      fetchDataLoad: false,
      isManager: false,
      tableData: [],
      dialog: false,
      dialogDelete: false,
      saveDisable: false,
      form: {
        id: null,
        description: ''
      },
      headers: [
        {
          text: 'User name',
          align: 'left',
          value: 'userName'
        },
        { text: 'Request type', value: 'typeRequest' },
        { text: 'Description request', value: 'description' },
        { text: 'Date from', value: 'dateFrom' },
        { text: 'Date to', value: 'dateTo' },
        { text: 'Description approval', value: 'descriptionApproval' },
        {
          text: 'Actions',
          value: 'action',
          sortable: false,
          align: 'center'
        }
      ],
      search: ''
    }
  },
  computed: {
    ...mapState('requests', ['requestNeedApproval']),
    ...mapState('approval', ['approvals']),
    ...mapState('profile', ['user'])
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    ...mapActions('requests', ['fetchRequestNeedApproval']),
    ...mapActions('profile', ['fetchUser']),
    ...mapActions(
      'approval',
      [
        'createApproval',
        'fetchApprovals',
        'updateApproval',
        'deleteApproval'
      ]),
    fetchData () {
      this.fetchDataLoad = true
      this.fetchApprovals()
      this.fetchRequestNeedApproval()
        .then(() => (this.fetchDataLoad = false))
    },
    close () {
      this.dialog = false
      this.reset()
    },
    reset () {
      this.form.description = ''
    },
    save (id, status) {
      if (!this.requestNeedApproval.filter(t => (t.id === id))[0].status) {
        this.dialog = false
        this.saveDisable = true
        this.createApproval({
          request_id: id,
          approver_id: id,
          status: status,
          description: (status === 'declined')
            ? this.form.description
            : ''
        })
          .then(res => {
            if (res.status === 200) {
              this.fetchData()
              this.saveDisable = false
            }
          })
      } else {
        this.edit(id, status)
      }
    },
    edit (id, status) {
      this.dialog = false
      this.updateApproval({
        approvalId: (status === 'declined')
          ? this.form.id
          : id,
        data: {
          status: status,
          description: this.form.description
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.fetchData()
          }
        })
    },
    remove (approvalId) {
      this.dialogDelete = false
      this.deleteApproval(approvalId)
        .then(res => {
          if (res.status === 200) {
            this.fetchData()
          }
        })
    }
  },
  beforeMount () {
    this.fetchUser()
      .then(() => {
        if (!this.user.isManager) {
          this.$router.push({ name: 'dashboard' })
        }
      })
  },
  mounted () {
    this.fetchData()
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

.approvals {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-size: 1.2rem;
  text-transform: uppercase;
  margin-bottom: 100px;

  & .items {
    display: flex;
    flex-direction: column;
    align-items: center;

    & .filters {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      width: 50vw;
      min-width: 300px;
    }

    & .my-table {
      width: 95vw;

      & .description {
        text-transform: none;
        word-wrap: break-word;
      }

      & .description {
        text-transform: none;
        font-size: 1rem;
      }

      & .actions {
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        margin: 5px;
        font-size: 1.5rem;
        border-radius: 50%;

        & .dialog-message {
          display: flex;
          align-items: center !important;
          justify-content: center;

          & span {
            flex-grow: 1 !important;
            text-align: center;
          }
        }

        & svg {
          justify-content: center;
          transform: translateX(-3px);

          &.delete {
            font-size: 2rem;
            transform: translateX(-6px) rotate(45deg);
          }
        }

        & .declined {
          transform: rotate(180deg) translate(3px, -2px);
        }
      }
    }
  }
}
</style>
