<template>
  <div>
    <v-container :style="`min-height: ${screenHeight}px; padding: 20px;background: #f3f4f3;`" fluid grid-list-md>
      <v-row>
        <v-col :cols="responsive ? 12 : 10" class="box rounded-lg">
          <v-card tile flat>
            <v-card-title class="pt-0 ps-1 pe-0 pb-0">
              Table Manager
            </v-card-title>
            <div class="func-box">
              <v-btn class="ma-2 ms-0" outlined color="indigo" small @click="dialog1 = true; selected = false; refetch()">
                New
              </v-btn>
              <v-btn class="ma-2" outlined color="indigo" small v-show="selected" @click="onEdit();">
                Edit
              </v-btn>
              <div style="width: 120px;" class=" float-end">
                <v-text-field persistent-placeholder placeholder=" " outlined dense height="28" hide-details
                  v-model="searchtable" append-outer-icon="mdi-magnify">
                </v-text-field>
              </div>
            </div>
            <div class="hideFildset" style="overflow: auto;">
              <v-data-table mobile-breakpoint="10" :search="searchtable" :loading="itemload" loader-height="2"
                height="260" dense hide-default-footer fixed-header :headers="headers" :items="table_data"
                class="elevation-1">
                <template v-slot:item="{ item }">
                  <tr :class="{ active: item === selected }"
                    @click="selected == item ? selected = null : selected = item;">
                    <td class="ps-3">{{ item._id }}</td>
                    <td>{{ item.name }}</td>
                    <td class="ps-3">{{ item.active ? 'on' : 'off' }}</td>
                  </tr>
                </template>
              </v-data-table>
              <div class="mt-3">
                  <v-pagination
                  v-model="page"
                  :length="total_page"
                  :total-visible="7"
                  @input="GetData()"
                  @next="GetData()"
                  @previous="GetData()"
                ></v-pagination>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog1" max-width="420">
      <v-card>
        <v-card-title class="">
          table Manager
        </v-card-title>
        <v-card-text>
          <span class="text-caption">
            Restaurant service manager.
          </span>
          <v-row class="mt-1">
            <v-col cols="12" class="pa-1">
              <v-text-field :disabled="!!selected" hide-details v-model="dlg_id" outlined dense
                label="ID"></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field hide-details v-model="dlg_name" outlined dense label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-switch class="mt-1 " dense label="Active" v-model="dlg_active"></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog1 = false">
            Cancel
          </v-btn>
          <v-btn v-if="!selected" color="red" text @click="dialog_create();">
            Create
          </v-btn>
          <v-btn v-if="!!selected" color="red" text @click="dialog_edit();">
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  screenHeight
} from "../Mixins/screenheight";
import axios from "axios";
export default {
  mixins: [screenHeight],
  data: () => ({

    table_data: [],
    page: 1,
    limit: 10,
    total_page: 1,

    dlg_id: '',
    dlg_name: '',
    dlg_active: '',

    dialog1: false,

    dialog2: false,
    dialog2_file: null,

    overlay: false,


    responsive: false,
    screen_size: 1,
    headers: [
      {
        text: 'ID',
        value: '_id',
        width: 50,
        align: 'center',
      },
      {
        text: 'Name',
        value: 'name',
        align: 'center',
      },
      {
        text: 'Active',
        value: 'active',
        align: 'center',
        width: 70,

      },
    ],

    selected: null,
    rules: {
      required: value => !!value || "",
      regex: v => /^[a-z0-9]+([-_\s]{1}[a-z0-9]+)*$/i.test(v) || ""
    },
    itemload: false,
    active: true,
    searchtable: '',
    item_move: null,
  }),
  computed: {
  },
  mounted() {
    this.GetData();
    this.GetTotalPgae();
  },
  methods: {

    GetData() {
      this.itemload = true;
      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };
      axios
        .get(this.$store.state.api + 'admin/table' + `?page=${this.page - 1}&limit=${this.limit}`, config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.table_data = resp.data.data;
          } else {
            this.$store.state.Snack.msg = "Lỗi khi lấy dữ liệu";
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          }
          this.itemload = false;
        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          this.itemload = false;
          console.log(err.message)
        });
    },

    GetTotalPgae() {
      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };
      axios
        .get(this.$store.state.api + 'admin/table/count', config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.total_page = Math.ceil(resp.data.count / this.limit);
          } else {
            this.$store.state.Snack.msg = "Lỗi khi lấy dữ liệu";
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          }
          this.itemload = false;
        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          this.itemload = false;
          console.log(err.message)
        });
    },

    dialog_create() {

      if (!this.dlg_id || !this.dlg_name) {
        this.$store.state.Snack.msg = 'Hãy nhập đủ dữ liệu';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        this.itemload = false;
        return;
      }

      let datatosend = {
        _id: this.dlg_id,
        name: this.dlg_name,
        active: this.dlg_active,
      };

      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };

      axios
        .post(this.$store.state.api + 'admin/table', datatosend, config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.$store.state.Snack.msg = "Thành công !";
            this.$store.state.Snack.color = "success";
            this.$store.state.Snack.show = true;

            this.refetch();
            this.selected = false;
            this.dialog1 = false;
            this.GetData();

          } else {
            this.$store.state.Snack.msg = resp.data.message;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          }
          this.itemload = false;
        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          this.itemload = false;
          console.log(err.message)
        });
    },

    dialog_edit() {

      if (!this.dlg_id || !this.dlg_name) {
        this.$store.state.Snack.msg = 'Hãy nhập đủ dữ liệu';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        this.itemload = false;
        return;
      }

      let datatosend = {
        _id: this.dlg_id,
        name: this.dlg_name,
        active: this.dlg_active,
      };

      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };

      axios
        .put(this.$store.state.api + 'admin/table', datatosend, config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.$store.state.Snack.msg = "Thành công !";
            this.$store.state.Snack.color = "success";
            this.$store.state.Snack.show = true;

            this.refetch();
            this.selected = false;
            this.dialog1 = false;
            this.GetData();

          } else {
            this.$store.state.Snack.msg = resp.data.message;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          }
          this.itemload = false;
        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          this.itemload = false;
          console.log(err.message)
        });
    },
    onResize() {
      if (window.innerWidth > 700) {
        this.responsive = false;
        this.screen_size = 1;
      }
      else if (window.innerWidth > 500) {
        this.responsive = true;
        this.screen_size = 2;
      } else {
        this.responsive = true;
        this.screen_size = 3;
      }
    },

    refetch() {

      this.dlg_id = '';
      this.dlg_name = '';
      this.dlg_active = '';

    },
    onEdit() {
      this.dlg_id = this.selected._id;
      this.dlg_name = this.selected.name;
      this.dlg_active = this.selected.active;

      this.dialog1 = true;
    },

  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>
<style>
.box {
  border: 1px solid rgb(0 0 0 / 5%);
  background: white;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);
}

.box2 {
  border: 1px solid rgb(0 0 0 / 5%);
  background: white;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);
}

.service_item {
  border: 1px solid rgba(0, 0, 0, 0.288);
  background: white;
  width: 300px;
  min-height: 165px;
  display: inline-block;
  margin: 5px;
  padding: 5px;
}
</style>
