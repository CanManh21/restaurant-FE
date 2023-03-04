<template>
  <div>
    <v-container style="background: #f3f4f3;" fluid grid-list-md>
      <div class="ps-3 pt-3 pe-3 pb-3 mb-5 rounded-lg box">
        <div v-for="(item, index) in table_data" :key="index" class="d-inline-block block-table-item">
          <v-card elevation="10" height="160" outlined>
            <v-card-title :class="item.status == 0 ? 'indigo--text' : 'red--text'">
              <v-icon small :class="['me-2', item.status == 0 ? 'indigo--text' : 'red--text']">mdi-circle</v-icon>
              {{ item.name }} - Chưa làm : 10
            </v-card-title>
            <v-card-text class="text-center">
              <v-btn outlined :color="item.status == 0 ? 'indigo' : 'red'" class="mt-5"
                @click="item.status == 0 ? createOrder(item._id) : ViewOrder(item.orderid)"
              >
                {{ item.status == 0 ? 'Tạo Order' : 'Chi tiết'}}
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <p :class="['ms-1', item.status == 0 ? 'indigo--text' : 'red--text']">{{item.isMerge ? `Bàn Ghép: ${item.mergeTable}` : `.`}}</p>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      responsive: false,
      screen_size: false,
      table_data: [],
    }
  },
  mounted() {
    this.GetData();
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
        .get(this.$store.state.api + 'restaurant/staff/table', config)
        .then(resp => {
          if (resp.data.status == 200)
          {
            this.table_data = resp.data.data;
          } else
          {
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
    createOrder(tableId) {
      this.itemload = true;
      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };
      let bodySend = {
        tableId
      }
      axios
        .post(this.$store.state.api + 'restaurant/staff/order', bodySend, config)
        .then(resp => {
          console.log(resp);
          if (resp.data.status == 200)
          {
            this.GetData();
          } else
          {
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
    ViewOrder(orderid) {
      this.$router.push("/table-view/" + orderid);
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
  },
  created() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style>
.block-table-item {
  width: 250px;
  height: 160px;
  margin: 0 20px 20px 0;
}

.box {
  border: 1px solid rgb(0 0 0 / 5%);
  background: white;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);
}

.border-red {
  border: 2px solid rgb(247, 7, 7);
}
</style>
