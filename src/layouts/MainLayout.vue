<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered  class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="las la-bars"  @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <img class="logo" src="../assets/logo.png" />
        </q-toolbar-title>
        <q-btn round color="secondary" icon="las la-user">
          <q-menu fit>
            <q-list style="min-width: 100px">         
              <q-item v-if="!logueado" clickable  @click="navigateTo('login')">
                <q-item-section>
                  <div class="row justify-center">
                    <q-icon name="las la-sign-in-alt" size="xs"> </q-icon> Ingresar
                  </div>
                </q-item-section
                >
              </q-item>
              <q-item clickable v-if="logueado" @click.prevent="cerrarSesion()">
                <q-item-section>
                  <div class="row justify-center">
                    <q-icon name="las la-door-closed" size="xs"> </q-icon> Cerrar Sesión
                  </div>
                </q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
      elevated
    >
      <!-- drawer content -->
      <q-list>
        <q-item-label header class="text-grey-8">Opciones</q-item-label>
        <EssentialLink
          v-for="link in linksList"
          :key="link.tittle"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref,computed } from "vue";
import { useRouter } from "vue-router";

import EssentialLink from "../components/EssentialLink";
import { useStore } from 'vuex';

const linksList = [
  {
    title: "Inventario",
    caption: "Productos, respuestos, etc",
    icon: "las la-warehouse",
    link: "home",
  },
  {
    title: "Mantenedor de productos",
    caption: "Crear, modificar, eliminar productos ",
    icon: "las la-wrench",
    link: "productos",
  },
  {
    title: "Mantenedor de modelos",
    caption: "Crear, modificar, eliminar modelos",
    icon: "las la-wrench",
    link: "modelos",
  },
  {
    title: "Mantenedor de bodegas",
    caption: "Crear, modificar, eliminar bodegas",
    icon: "las la-wrench",
    link: "bodegas",
  },
  {
    title: "Mantenedor de categorias",
    caption: "Crear, modificar, eliminar categorias",
    icon: "las la-wrench",
    link: "categorias",
  },
  {
    title: "Servicio Tecnico",
    caption: "Ingresar a servicio técnico, consultar servicio técnico",
    icon: "las la-tools",
    link: "stecnico",
  },
];


export default {
  components: {
    EssentialLink,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();

    const store = useStore();

    

    return {
      logueado: computed(()=>store.getters.usuarioLogueado),
      cerrarSesion: ()=> store.dispatch('cerrarSesion'),
      leftDrawerOpen,
      linksList,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      navigateTo(link='') {
        console.log(link)
        router.push({ name: link });
      },
    };
  },
};
</script>

<style>
.logo {
  padding-top: 1rem;
  max-height: 60px !important;
  width: auto;
}
</style>
