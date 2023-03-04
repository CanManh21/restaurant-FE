<template>
  <v-app>
    <div id="main-app">
      <v-progress-linear v-if="routerload" height="2" fixed indeterminate color="blue"></v-progress-linear>
      <v-app-bar class="" v-if="isLoggedIn" style="background: #64c5b1;" dense>

        <v-app-bar-nav-icon class="ms-1" @click.stop="mini = !mini"></v-app-bar-nav-icon>

        <v-toolbar-title><span> SMILE SERVICE </span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu content-class="user-drop" tile bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="me-5" tile small text v-bind="attrs" v-on="on">
              ADMIN
            </v-btn>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list dense>
            <v-list-item @click="Logout()">
              <v-layout row wrap>
                <v-icon size="15">mdi-logout</v-icon>
                <span>Logout</span>
              </v-layout>
            </v-list-item>
            <v-list-item @click="changepass = true">
              <v-layout row wrap>
                <v-icon size="15">mdi-account</v-icon>
                <span>Đổi mật khẩu</span>
              </v-layout>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-layout class="">
        <v-navigation-drawer v-model="mini" absolute temporary>
          <v-list nav dense>
            <v-list-group @click="item.link != '' ? $router.push(item.link) : false"
              v-bind:class="item.link != '' ? { active: item.link === active } : {}" v-for="item in items"
              :key="item.title" no-action>
              <template v-slot:activator>
                <v-list-item-icon style="margin-right: 15px !important ;">
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title style="font-size: 13px;" v-text="item.title"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon v-if="item.list.length > 0">
                  <v-icon>mdi-menu-down</v-icon>
                </v-list-item-icon>
              </template>

              <v-list-item v-bind:class="{ active: child.link === active }" @click="$router.push(child.link)"
                v-for="child in item.list" :key="child.name">
                <v-list-item-content>
                  <v-list-item-title style="font-size: 13px;" v-text="child.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="item.list.length > 0"></v-divider>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>

        <div style="width: 100%">

          <div class="Content-view" :class="isLoggedIn ? 'pa-1' : ''">
            <v-card :height="isLoggedIn ? screenHeight - 48.5 : screenHeight" style="overflow: auto" tile flat>
              <router-view></router-view>
            </v-card>
          </div>
          <v-footer v-if="isLoggedIn" style="padding:0px;background: white;" height="20">
            <v-layout justify-center wrap>
            </v-layout>
          </v-footer>
        </div>
      </v-layout>
    </div>
    <v-snackbar v-model="Snack.show" top right :color="Snack.color" timeout="5000">
      <h3 style="text-transform: capitalize;">{{ Snack.msg }}</h3>
      <template v-slot:action="{ attrs }">
        <v-btn icon color="white" small v-bind="attrs" @click="Snack.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-if="changepass" v-model="changepass" persistent max-width="300px" transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          Đổi mật khẩu
          <v-spacer></v-spacer>
          <v-btn icon small @click="changepass = false" color="error">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field persistent-placeholder hide-details type="password" placeholder=" " v-model="oldpass" outlined
            dense label="Mật khẩu cũ"></v-text-field>
          <v-text-field persistent-placeholder hide-details type="password" placeholder=" " v-model="pass" outlined
            dense label="Mật khẩu mới"></v-text-field>
          <v-text-field persistent-placeholder hide-details type="password" placeholder=" " v-model="repass" outlined
            dense label="Nhập lại mật khẩu"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="changepassA();" :loading="passload" :disabled="passload" color="success">Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {
  screenHeight
} from "./Mixins/screenheight";
export default {
  mixins: [screenHeight],
  components: {},

  data() {
    return {
      drawer: true,
      items: [
        {
          title: 'Home',
          link: "/home",
          icon: 'mdi-home',
          list: []
        },
        {
          title: 'Manager',
          link: "",
          icon: 'mdi-cellphone-cog',
          list: [
            {
              name: 'Category ',
              link: '/manager/category'
            },
            {
              name: 'Dish',
              link: '/manager/dish'
            },
            {
              name: 'Table',
              link: '/manager/table'
            },
          ]
        },

      ],
      mini: false,
      headtitle: '',
      headicon: '',
      active: "",
      pass: '',
      repass: '',
      oldpass: '',
      changepass: false,
      passload: false
    };
  },
  mounted() {
    this.routerCatch();
    this.ping();
    if (this.isLoggedIn == true) {
    }
  },
  watch: {
    $route() {
      this.routerCatch();
    },
    token() {
      if (this.token != '') {
      }
    }
  },
  computed: {
    title() {
      let path = this.$route.path;
      let title = {};
      this.items.forEach(e => {
        if (e.link == path) {
          title = e;
        }
      });
      return title;
    },
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
    routerload: function () {
      return this.$store.getters.routerload;
    },
    Snack: function () {
      return this.$store.getters.Snack;
    },
    rp: function () {
      return this.$store.getters.rp;
    },
    per: function () {
      return this.$store.getters.per;
    },
    token: function () {
      return this.$store.getters.token;
    },
  },
  methods: {
    ping() {
      console.log(this.isLoggedIn);
    },
    routerCatch() {
      let path = this.$route.path.slice(1);
      this.active = "/" + path;
    },
    Logout() {
      this.$store.state.token = "";
      this.$cookies.remove('token');
      this.$router.push("/");
    },
    reportcf(c) {
      this.$store.state.rp = c.ReportName;
      this.$router.push('/report');
    },
    reportcf2() {
      sessionStorage.clear()
      window.location.href = window.location.origin + '/rpt?token=' + this.$store.state.token
      // console.log(this.$store.state.rpt +'rpt?token='+this.$store.state.token);
    },
    changepassA() {
      alert('func updating...');
      // if (this.pass == '' || this.oldpass == '') {
      //   this.$store.state.Snack.msg = 'Vui lòng nhập thông tin';
      //   this.$store.state.Snack.color = "error";
      //   this.$store.state.Snack.show = true;
      //   return;
      // }
      // if (this.pass != this.repass) {
      //   this.$store.state.Snack.msg = 'Nhập lại mật khẩu không khớp';
      //   this.$store.state.Snack.color = "error";
      //   this.$store.state.Snack.show = true;
      //   return;
      // }
      // this.passload = true;
      // let datatosend = {
      //   PassWord_Old: this.oldpass,
      //   PassWord: this.pass
      // };
      // let config = {
      //   headers: {
      //     Authorization: "Basic " + this.$store.state.token
      //   }
      // };
      // axios
      //   .post(this.$store.state.api + 'changepass', datatosend, config)
      //   .then(resp => {
      //     if (resp.data.success == false) {
      //       this.$store.state.Snack.msg = resp.data.msg;
      //       this.$store.state.Snack.color = "error";
      //       this.$store.state.Snack.show = true;
      //     } else {
      //       this.$store.state.Snack.msg = 'Thành công';
      //       this.$store.state.Snack.color = "success";
      //       this.$store.state.Snack.show = true;
      //       this.pass = '';
      //       this.repass = '';
      //       this.oldpass = '';
      //       this.changepass = false;
      //     }
      //     this.passload = false;
      //   })
      //   .catch(err => {
      //     this.$store.state.Snack.msg = err.message;
      //     this.$store.state.Snack.color = "error";
      //     this.$store.state.Snack.show = true;
      //     this.passload = false;
      //   });
    },
    lowercasse(s) {
      return s.toLowerCase().split(" ").join("");
    }
  }
};
</script>
