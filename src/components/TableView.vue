<template>
  <div>
    <v-container style="background: #f3f4f3;" fluid grid-list-md>
      <v-row>
        <v-col :cols="responsive ? 12 : 8">
          <div class="ps-3 pt-3 pe-3 pb-3 mb-5 rounded-lg box">
            <div class="menu-header">
              <p class="text-h4">Menu</p>
              <div class="menu-header-category">
                <v-row>
                  <v-col :cols="responsive ? 12 : 6">
                    <v-select @click="GetCategory()" :items="data_categorys" item-text="name" item-value="_id"
                      label="Chọn Danh Mục" outlined dense hide-details height="29"
                      v-model="select_categoryId"></v-select>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div class="menu-body mt-5">
              <div class="menu-item" v-for="item in data_products" :key="item._id"
                :style="`background-image: url(${item.image});`" @click="addOrder(item._id)">
                <v-footer class="text-center
                    ps-1 pe-1" style="height: 85px; margin-top: 113px;
                    background-color: rgb(0 0 0 / 50%);
                    ">
                  <div class="white--text">
                    <p class="mb-1 text-h6">{{ item.name }}</p>
                    <p class="mt-1 text-body-1">{{ item.price }}</p>
                  </div>
                </v-footer>
              </div>
            </div>
          </div>
        </v-col>
        <v-col :cols="responsive ? 12 : 4">
          <div class="ps-3 pt-3 pe-3 pb-3 mb-5 rounded-lg box">
            <div class="infor-header d-flex">
              <span class="text-h5 me-auto">Thông Tin</span>
              <v-btn color="primary" size="small" icon id="btn-edit-order">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-menu activator="#btn-edit-order">
                <v-list>
                  <v-list-item class=""><button>Gộp Bàn</button></v-list-item>
                  <v-list-item class=""><button>Tách Bàn</button></v-list-item>
                  <v-list-item class=""><button>Hủy Bàn</button></v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="infor-body mt-5">
              <v-row>
                <v-col cols="5" class="ps-5 pb-0"><span class="text-h6">ID</span></v-col>
                <v-col cols="2" class="pb-0"><span class="text-h6">Bàn</span></v-col>
                <v-col cols="5" class="pb-0"><span class="text-h6">Thanh Toán</span></v-col>
                <v-col cols="5" class="ps-5"><span class="text-h6 blue--text">{{ page_order._id }}</span></v-col>
                <v-col cols="2"><span class="text-h6 blue--text">{{ page_order.tableId }}</span></v-col>
                <v-col cols="5"><span class="text-h6 blue--text">{{ page_order.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán' }}</span></v-col>
              </v-row>
              <v-divider class="mt-2 mb-2"></v-divider>
              <v-row v-for="item in page_order.orderDetai" :key="item.id">
                <v-col cols="8">
                  <span class="text-h6">{{ item.product_name }}</span>
                    <div class="box-amount d-inline-block ms-5">
                      <v-btn class="text-h3 pb-3" icon> - </v-btn>
                      <span class="text-h5 blue--text">x{{ item.product_amount }}</span>
                      <v-btn class="text-h4 pb-1" icon> + </v-btn>
                    </div>
                  <p class="text-h6 blue-grey--text"> size: {{ item.product_size }} </p>
                </v-col>
                <v-col cols="4" class="text-end">
                  <span class="ms-2 text-h6 blue--text"> {{ item.product_price *  item.product_amount }}Đ</span>
                </v-col>
              </v-row>
              <v-divider class="mt-2 mb-2"></v-divider>
              <v-row>
                <v-col cols="8">
                  <span class="text-h6">Tổng</span>
                </v-col>
                <v-col cols="4" class="text-end">
                  <span class="ms-2 text-h6 red--text"> {{page_order.total_money}}đ</span>
                </v-col>
              </v-row>
              <div class="text-end">
                <v-btn outlined dense color="red" class="mt-5 font-weight-black">
                  Thanh Toán
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {

  data() {
    return {

      page_orderId: '',
      page_order: '',
      page_orderDetails: [],

      data_categorys: [],
      data_products: [],

      select_categoryId: '',

      responsive: false,
      screen_size: false,
      itemload: false,

    }
  },
  mounted() {
    this.page_orderId = this.$route.params.orderid;
    this.GetCategory();
    this.GetProduct();
    this.loadOrder();
  },
  methods: {
    GetCategory() {
      this.itemload = true;
      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };
      axios
        .get(this.$store.state.api + 'restaurant/staff/category', config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.data_categorys = resp.data.data;
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
    GetProduct() {
      this.itemload = true;
      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };
      axios
        .get(this.$store.state.api + 'restaurant/staff/product', config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.data_products = resp.data.data;
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
    loadOrder() {
      this.itemload = true;
      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };
      axios
        .get(this.$store.state.api + 'restaurant/staff/order/' + this.page_orderId, config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.page_order = resp.data.data;
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
    addOrder(product_id) {
      let datatosend = {
        orderId: this.page_orderId,
        productId: product_id,
      };

      let config = {
        headers: {
          authorization: this.$store.state.token
        }
      };

      axios
        .post(this.$store.state.api + 'restaurant/staff/orderAdd', datatosend, config)
        .then(resp => {
          if (resp.data.status == 200) {
            this.$store.state.Snack.msg = "Thành công !";
            this.$store.state.Snack.color = "success";
            this.$store.state.Snack.show = true;
            this.loadOrder();
          } else {
            this.$store.state.Snack.msg = resp.data.message;
            this.$store.state.Snack.color = "error";
            this.$store.state.Snack.show = true;
          }
        })
        .catch(err => {
          this.$store.state.Snack.msg = err.message;
          this.$store.state.Snack.color = "error";
          this.$store.state.Snack.show = true;
          console.log(err.message)
        });
    }
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
.menu-item {
  width: 180px;
  height: 200px;
  background-position: center;
  background-color: #E0E0E0;
  background-size: 180px 180px;
  background-repeat: no-repeat;
  border: 1px solid rgb(0, 0, 0);
  display: inline-block;
  margin: 0 10px 10px 0;
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
