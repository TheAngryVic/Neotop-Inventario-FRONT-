import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import decode from "jwt-decode";

import router from "../router/index";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      token: "",
      usuarioDB: null,
      productos: null
    },
    mutations: {
      obtenerUsuario(state, payload) {
        state.payload = payload;
        if (payload === "") {
          state.usuarioDB = null;
        } else {
          state.usuarioDB = decode(payload);
          console.log(state.usuarioDB)
          router.push({name: 'home'})

        }
      },
      obtenerProductos(state, payload){
        state.payload = payload;
        if (payload === "") {
          state.productos = null;
        } else {
          state.productos = payload;
        }
      }
    },
    actions: {
      guardarUsuario({ commit }, payload) {
        localStorage.setItem("token", payload);
        commit("obtenerUsuario", payload);
      },
      guardarProductos({ commit }, payload) {
        commit("obtenerProductos", payload);
      },
    },
    getters: {
      usuarioLogueado(state){
        return !!state.usuarioDB
      }
    },

    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    // strict: process.env.DEBUGGING,
  });

  return Store;
});
