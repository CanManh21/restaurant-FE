import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index.js'
import Home from "../components/Home.vue";
import Login from "../components/Login.vue";


Vue.use(VueRouter);

const routes = [{
        path: "",
        component: Login,
        meta: {
            Auth: true
        }
    },
    {
        path: "/home",
        component: Home,
        meta: {
            requiresAuth: true
        }
    },
    {
      path: "/table-view/:orderid",
      component: () =>
      import ('../components/TableView.vue'),
      meta: {
          requiresAuth: true
      }
  },
    {
        path: "/manager/category",
        component: () =>
            import ('../components/Category.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
      path: "/manager/dish",
      component: () =>
          import ('../components/Dish.vue'),
      meta: {
          requiresAuth: true
      },

  },
  {
    path: "/manager/table",
    component: () =>
        import ('../components/Table.vue'),
    meta: {
        requiresAuth: true
    }
  },


]
const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});
router.beforeEach((to, from, next) => {
    store.state.routerload = true;
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next()
            return
        }
        next('')
    } else {
        next()
    }
    if (to.matched.some(record => record.meta.Auth)) {
        if (!store.getters.isLoggedIn) {
            next()
            return
        }
        next('/home')
    } else {
        next()
    }
})
router.afterEach(() => {
    setTimeout(function() {
        store.state.routerload = false;
    }, 500);
})
export default router;
