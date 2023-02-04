<template>
  <div>
    <v-container style="padding-top: 20px;background: #f3f4f3;" fluid grid-list-md>
      <v-layout wrap row>
        <v-flex xs3 class="box rounded-lg" style="margin: 0; padding: 0;">
          <span class="mt-1 ms-1 blue--text text-body-1">Infor</span>
          <v-btn @click="SubDialog3 = true" dense small color="float-end green white--text mt-1">
            <v-icon>mdi-magnify</v-icon>Search
          </v-btn>
          <v-layout class="mt-5" v-if="selected" wrap row>
            <v-flex xs6><span class="indigo--text">Owner Name :</span> <span>{{ selected.OwnerName }}</span></v-flex>
            <v-flex xs6><span class="indigo--text">Room :</span> <span>{{ selected.RoomCode }}</span></v-flex>
            <v-flex xs12><span class="indigo--text">Room Type :</span> <span class="red--text accent-4">{{
                selected.RoomTypeName
            }}</span></v-flex>
            <v-flex xs12><span class="indigo--text">Room Type Code :</span> <span class="green--text accent-4">
                {{ selected.RoomTypeCode }}</span></v-flex>
            <v-flex xs12><span class="indigo--text">Balance :</span> <span class="red--text accent-4">{{
                moneydot(amount)
            }} VNĐ</span></v-flex>
            <v-flex xs12><span class="indigo--text">Notice :</span> <span class="green--text accent-4"></span></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs9 class="box rounded-lg" style="margin: 0; padding: 0;">
          <v-card class="hideFildset" tile flat>
            <div style="overflow: auto;">
              <v-data-table :search="searchtable" :loading="itemload" loader-height="2"
                :footer-props="{ 'items-per-page-options': [10, 15, 20], 'items-per-page-text': '' }" height="200" dense
                fixed-header :headers="headers" :items="cashierdefdata">
                <template v-slot:item="{ item }">
                  <tr :class="{ active: item === selected }"
                    @click="selected == item ? selected = null : selected = item; loadTRN()">
                    <td class="text-center">{{ item.RoomCode }}</td>
                    <td>{{ item.RoomTypeName }}</td>
                    <td>{{ item.RoomTypeCode }}</td>
                    <td>{{ item.OwnerName }}</td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-flex>
      </v-layout>

      <div class="box mt-3">
        <v-tabs class="box2" v-model="tab" color="blue" background-color="transparent" grow>
          <v-tab style="flex:none;" @dragover="move_item($event), 0" @drop="drop_item($event, 0)" key="1">
            <v-badge :color="LL ? 'green' : 'white'" :content="LL">
              A - GUEST FOLIO
            </v-badge>
          </v-tab>
          <v-tab @click="clickVoidTab()" @dragover="move_item($event, 1)" @drop="drop_item($event, 1)"
            style="flex:none;" key="2">
            <v-badge :color="RL ? 'green' : 'white'" :content="RL">
              V - VOID FOLIO

            </v-badge>
          </v-tab>
        </v-tabs>
        <v-tabs-items class="green lighten-4 box2" v-model="tab">
          <v-tab-item key="1">
            <div class="hideFildset">
              <v-data-table loader-height="2"
                :footer-props="{ 'items-per-page-options': [10, 15, 20], 'items-per-page-text': '' }" dense fixed-header
                :headers="headers2" :items="service_tab">
                <template v-slot:item="{ item }">
                  <tr :class="{ active: item === selected2 }" draggable="true"
                    @dragstart="item_move = { id: item.TransactionID, from_tab: 0 }"
                    @click="selected2 == item ? selected2 = null : selected2 = item;">
                    <td class="text-center">{{ fomatDate(item.TransactionDate) }}</td>
                    <td class="text-center">{{ item.TransactionCode }}</td>
                    <td class="text">{{ caches[item.TransactionCode] }}</td>
                    <td class="text-center">{{ item.RefNumber }}</td>
                    <td class="text-center red--text">{{ moneydot(item.TransactionAmount) }}</td>
                    <td class="text-center">{{ item.OriginRoom }}</td>
                    <td class="text-center green--text">{{ item.TaxCode }}</td>
                    <td class="text-center">{{ item.InvoiceDate }}</td>
                    <td class="text-center">{{ item.PostingClerkID }}</td>
                    <td class="text green--text">{{ item.Comment }}</td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
          <v-tab-item key="2">
            <div class="hideFildset">
              <v-data-table loader-height="2"
                :footer-props="{ 'items-per-page-options': [10, 15, 20], 'items-per-page-text': '' }" dense fixed-header
                :headers="headers2" :items="corrected_tab">
                <template v-slot:item="{ item }">
                  <tr>
                    <td class="text-center">{{ fomatDate(item.TransactionDate) }}</td>
                    <td class="text-center">{{ item.TransactionCode }}</td>
                    <td class="text">{{ caches[item.TransactionCode] }}</td>
                    <td class="text-center">{{ item.RefNumber }}</td>
                    <td class="text-center red--text">{{ moneydot(item.TransactionAmount) }}</td>
                    <td class="text-center">{{ item.OriginRoom }}</td>
                    <td class="text-center green--text">{{ item.TaxCode }}</td>
                    <td class="text-center">{{ item.InvoiceDate }}</td>
                    <td class="text-center">{{ item.PostingClerkID }}</td>
                    <td class="text green--text">{{ item.Comment }}</td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>

      <v-layout class="button" style="padding: 0px 3px;margin-bottom: 5px;" wrap>
        <v-flex xs6 style="height: 60px;">
          <v-btn width="60" height="50" class="mt-2" v-if="selected" @click="SubDialog = true;" color="primary" outlined
            small dense tile>
            <v-layout justify-center align-center column>
              <v-icon>
                mdi-plus
              </v-icon>
              TRN
            </v-layout>
          </v-btn>
          <v-btn width="60" height="50" class="mt-2" v-if="selected2"
            @click="item_move = { id: selected2.TransactionID } ; SubDialog2 = true;" color="primary" outlined small dense
            tile>
            <v-layout justify-center align-center column>
              <v-icon>
                mdi-plus
              </v-icon>
              VOID
            </v-layout>
          </v-btn>
        </v-flex>
        <v-flex xs2>
        </v-flex>
        <v-flex xs4>

        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="SubDialog" max-width="420">
      <v-card>
        <v-card-title class="">
          Post Transaction
        </v-card-title>
        <v-card-text>
          <span class="text-caption">
            Add room service
          </span>
          <v-row class="mt-1">

            <v-col cols="6" class="pa-1">
              <v-select :items="folioBalanceCodes" item-text="Name" item-value="Code" label="folio Balance Code"
                outlined dense hide-details height="29" :value="folioBalanceCode" v-model="folioBalanceCode"></v-select>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-select @click="loadtransactionCode();" @change="loadtransactionSubCode();" :items="transactionCodes"
                item-text="SLT" item-value="Code" label="transaction Code" outlined dense hide-details height="29"
                :value="transactionCode" v-model="transactionCode"></v-select>
            </v-col>
            <v-col v-if="transactionSubCodes" cols="6" class="pa-1">
              <v-select :items="transactionSubCodes" item-text="SLT" item-value="Code" label="transaction Sub Code"
                outlined dense hide-details height="29" :value="transactionSubCode" v-model="transactionSubCode">
              </v-select>
            </v-col>

            <v-col cols="6" class="pa-1">
              <v-text-field v-model="refNumber" hide-details outlined dense label="REF"></v-text-field>
            </v-col>

            <v-col cols="6" class="pa-1">
              <v-text-field v-model="transactionAmount" hide-details outlined dense label="Amount"></v-text-field>
            </v-col>

            <v-col cols="12" class="pa-1">
              <v-textarea hide-details outlined dense label="Description" hint="Hint text" v-model="comment">
              </v-textarea>
            </v-col>
            <v-col cols="12" class="pa-1">
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="SubDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red" text @click="OnPOST();">
            Post
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="SubDialog2" max-width="420">
      <v-card>
        <v-card-title class="">
          Void a Trantaction
        </v-card-title>
        <v-card-text>
          <span class="text-caption">
            Comment why void a trantaction
          </span>
          <v-row class="mt-1">
            <v-col cols="12" class="pa-1">
              <v-textarea hide-details outlined dense label="Description" hint="Hint text" v-model="comment2">
              </v-textarea>
            </v-col>
            <v-col cols="12" class="pa-1">
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="SubDialog2 = false">
            Cancel
          </v-btn>
          <v-btn color="red" text @click="OnVoid();">
            VOID
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="SubDialog3" max-width="420">
      <v-card>
        <v-card-title class="">
          Advanced Search
        </v-card-title>
        <v-card-text>
          <span class="text-caption">
            Find by room code or folio
          </span>
          <v-row class="mt-1">
            <v-col cols="12" class="pa-1">
              <v-select :items="Owners" @click="loadOwner()" item-text="OwnerName" item-value="OwnerID" label="Owner"
                multiple outlined dense hide-details height="29" :value="Owner" v-model="Owner"></v-select>
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field v-model="roomSearch" hide-details outlined dense label="Room Code"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="SubDialog3 = false">
            Cancel
          </v-btn>
          <v-btn color="red" text @click="GetCashierDef(); SubDialog3 = false">
            Search
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
    roomSearch: '',
    Owner: '',
    Owners: [],
    selected2: '',
    SubDialog3: true,
    SubDialog2: false,
    comment2: '',
    overlay: false,
    caches: [],
    tab: null,
    service_tab: [],
    corrected_tab: [],
    headers2: [{
      text: 'Date',
      align: 'center',
    }, {
      text: 'Code',
      align: 'center',
    }, {
      text: 'Description',
      align: 'center',
    }, {
      text: 'Ref',
      align: 'center',
    }, {
      text: 'Amount',
      align: 'center',
    }, {
      text: 'Org Rm',
      align: 'center',
    }, {
      text: 'TAG',
      align: 'center',
    }, {
      text: 'Inv Date',
      align: 'center',
    }, {
      text: 'User',
      align: 'center',
    }, {
      text: 'Comment',
      align: 'center',
    },
    ],
    headers: [{
      text: 'Room Code',
      value: 'RoomCode',
      align: 'center',
    },
    {
      text: 'Room Type Name',
      value: 'RoomTypeName',
      align: 'center',
    },
    {
      text: 'Room Type Code',
      value: 'RoomTypeCode',
      align: 'center',
    },
    {
      text: 'Owner Name',
      value: 'OwnerName',
      align: 'center',
    },
    ],
    selected: null,
    rules: {
      required: value => !!value || "",
      regex: v => /^[a-z0-9]+([-_\s]{1}[a-z0-9]+)*$/i.test(v) || ""
    },
    SubDialog: false,
    itemload: false,
    cashierdefdata: [],
    department: '',
    fullname: '',
    active: true,
    delload: false,
    searchtable: '',
    item_move: null,
    folioBalanceCodes: [{
      Name: 'A - Guest folio',
      Code: 'A',
    },
    {
      Name: 'V - VOID FOLIO',
      Code: 'V',
    }],
    folioBalanceCode: 'A',
    transactionCodes: [],
    transactionCode: '',
    transactionSubCodes: false,
    transactionSubCode: '',
    refNumber: '',
    transactionAmount: '',
    comment: '',
    LL: 0,
    RL: 0,
    amount: 0,

  }),
  computed: {
    Data: function () {
      return this.$store.getters.Data
    },
    per: function () {
      return this.$store.getters.per;
    },
  },
  mounted() {
    if (this.Data.user.toLowerCase().split(" ").join("") != 'sml' && this.per.filter(q => q.FunctionID == 'Config').length == 0) {
      this.$router.push("/home");
      return;
    }
  },
  methods: {
    occ(e) {
      console.log(e);
      console.log('hicc');
    },
    loadTRN() {
      if (!this.selected) {
        return;
      }
      this.overlay = true;
      this.amount = 0;
      let datatosend = {
        roomCode: this.selected.RoomCode
      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'gettrn', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            const data = JSON.parse(resp.data.data)
            this.service_tab = [];
            this.corrected_tab = [];
            for (const iterator of data) {
              this.amount += iterator.TransactionAmount;
              if (iterator.FolioBalanceCode == 'A') {
                this.service_tab.push(iterator);
              } else {
                this.corrected_tab.push(iterator);
              }
            }
            this.LL = this.service_tab.length;
            this.RL = this.corrected_tab.length;
            console.log(this.service_tab);
          }
          this.overlay = false;
        })
        .catch(err => {
          this.overlay = false;
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    },
    move_item(e) {
      e.preventDefault();
    },
    drop_item(e, to_tab) {
      this.tab = to_tab;
      if (this.item_move.from_tab == to_tab) {
        return;
      }
      if (to_tab == 1) {
        this.SubDialog2 = true;
      }
    },
    OnVoid() {
      let datatosend = {
        trnId: this.item_move.id,
        comment: this.comment2,
      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'voidtrn', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            this.$store.state.Snack.msg = "Thành công !";
            this.$store.state.Snack.color = "success";
            this.$store.state.Snack.show = true;
            this.SubDialog2 = false;
            this.item_move = false;
            this.selected2 = false;
            this.rs();
            this.loadTRN();
          }
          this.overlay = false;
        })
        .catch(err => {
          this.overlay = false;
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    },
    GetCashierDef() {
      this.itemload = true;
      let datatosend = {
      };
      if (this.Owner) {
        datatosend.owner = this.Owner.toString();
      }
      if (this.roomSearch) {
        datatosend.roomCode = this.roomSearch;
      }
      console.log(datatosend);
      let config = {
        headers: {
          Authorization: this.$store.state.token,
          'Content-Type': 'application/json'
        },
      };
      axios
        .post(this.$store.state.api + 'getownerroom', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            let data = JSON.parse(resp.data.data)
            this.cashierdefdata = data;
            if (!data.length) {
              this.$store.state.Snack.msg = 'Room not found !';
              this.$store.state.Snack.color = "error";
              this.$store.state.Snack.show = true;
              this.SubDialog3 = true;
            }
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
    loadtransactionCode() {
      let datatosend = {
      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'trncode', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            this.transactionCodes = JSON.parse(resp.data.data).map(v => {
              return {
                ...v,
                SLT: `${v.Code} - ${v.Name}`
              }
            })

            this.ATCC(JSON.parse(resp.data.data), 'Name', 'Code');
          }

        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    },
    loadtransactionSubCode() {
      let datatosend = {
        trnCode: this.transactionCode
      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'trnsubcode', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            this.transactionSubCodes = JSON.parse(resp.data.data).map(v => {
              return {
                ...v,
                SLT: `${v.Code} - ${v.Name}`
              }
            })
            this.transactionSubCodes = this.transactionSubCodes.length ? this.transactionSubCodes : false;
            if (!this.transactionSubCodes) {
              this.transactionSubCode = '';
            }
            if (this.transactionSubCodes) {
              // this.ATCC(this.transactionSubCodes,'Name','Code');
            }
          }

        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    },
    rs() {
      this.folioBalanceCode = '';
      this.transactionCode = '';
      this.transactionSubCode = '';
      this.refNumber = '';
      this.transactionAmount = '';
      this.comment = '';
      this.comment2 = '';
    },
    OnPOST() {

      if (!this.folioBalanceCode) {
        this.$store.state.Snack.msg = 'must choose folio Balance Code';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        return;
      }
      if (!this.transactionCode) {
        this.$store.state.Snack.msg = 'must choose transaction Code';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        return;
      }
      if (!this.transactionSubCode) {
        this.$store.state.Snack.msg = 'must choose transaction Sub Code';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        return;
      }
      if (!this.refNumber) {
        this.$store.state.Snack.msg = 'Ref Number cannot be empty';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        return;
      }
      if (!this.selected.RoomCode) {
        this.$store.state.Snack.msg = 'Room Code cannot be empty';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        return;
      }
      if (!this.transactionAmount) {
        this.$store.state.Snack.msg = 'Transaction Amount cannot be empty';
        this.$store.state.Snack.color = "error";
        this.$store.state.Snack.show = true;
        return;
      }


      let datatosend = {
        folioBalanceCode: this.folioBalanceCode,
        transactionCode: this.transactionCode,
        transactionSubCode: this.transactionSubCode,
        refNumber: this.refNumber,
        roomCode: this.selected.RoomCode,
        comment: this.comment,
        transactionAmount: this.transactionAmount,
      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'posttrn', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            this.$store.state.Snack.msg = "Thành công !";
            this.$store.state.Snack.color = "success";
            this.$store.state.Snack.show = true;
            this.SubDialog = false;
            this.rs();
            this.loadTRN();
          }

        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    },
    clickVoidTab() {
      this.selected2 = false;
      this.item_move = false;
    },
    loadOwner() {
      let datatosend = {

      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'getowner', datatosend, config)
        .then(resp => {
          if (resp.data.success == false) {
            this.$store.state.Snack.msg = resp.data.msg;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          } else {
            let data = JSON.parse(resp.data.data)
            this.Owners = data;
          }

        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    },
    moneydot(monney) {
      return monney.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    },
    ATCC(key, val, name) {
      if (Array.isArray(key)) {
        for (const it of key) {
          if (it) {
            this.caches[it[name]] = it[val];
          }
        }
      } else {
        this.caches[val] = key;
      }
    },
    fomatDate(date) {
      const val = new Date(date);
      return `${val.getDate()}/${(val.getMonth() + 1) < 10 ? `0${val.getMonth() + 1}` : val.getMonth() + 1}`
    },
    ping() {
      let datatosend = {
      };
      let config = {
        headers: {
          Authorization: this.$store.state.token
        }
      };
      axios
        .post(this.$store.state.api + 'getowner', datatosend, config)
        .then().catch(err => {
          if (err.message == 'Request failed with status code 401') {
            this.$store.state.token = "";
            this.$cookies.remove('token');
            this.$router.push("/");
          }
        });;
    },
    // onResize() {
    //   if (window.innerWidth < 700) {
    //     this.$router.push('/posttransaction-mobile');
    //   }
    // },
  },


  created() {
    // window.addEventListener('resize', this.onResize);
    this.ping();
    this.loadtransactionCode();
    this.loadOwner();
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.onResize)
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
