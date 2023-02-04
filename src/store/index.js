import Vue from "vue";
import Vuex from "vuex";
const cookies = require('vue-cookies');
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: cookies.get('token') || "",
        rvc: cookies.get('rvc') || "",
        api: "http://localhost:3000/api/v1/",
        rpt: "http://localhost:3000/",
        routerload: false,
        rp: '',
        per: [],
        Snack: { show: false, msg: "", color: "" },
    },
    getters: {
        isLoggedIn: state => !!state.token,
        routerload: state => state.routerload,
        Snack: state => state.Snack,
        Data: state => state.Data,
        token: state => state.token,
        rp: state => state.rp,
        per: state => state.per,
    },
    mutations: {},
    actions: {},
    modules: {}
});
