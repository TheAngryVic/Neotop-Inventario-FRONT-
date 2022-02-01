import { route } from "quasar/wrappers";
import  Store  from '../store/index.js'

import { Dialog } from 'quasar'


import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === "history"? createWebHistory: createWebHashHistory;

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(
    process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
  ),
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const autenticado = localStorage.getItem("token");
    const session = JSON.parse(sessionStorage.getItem("vuex"))

    if (to.matched.some(record => record.meta.bodegaOnly)) {
      
      let rol

      session.usuarioDB ? rol=session.usuarioDB.rol : rol=null

      console.log("ROL", rol);

      if(rol !== 2) {

         Dialog.create({
          title: 'Alerta de permisos',
          message: '¡No tienes los permismos suficientes para ingresar! \n Comuniquese con el Administrador'
        });
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
      else {
        next()
      }

    }
    else if(!autenticado) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
    else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
