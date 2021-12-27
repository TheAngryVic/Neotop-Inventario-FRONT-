<template>
  <q-page>
    <div class="row" v-if="userDb">
      <h4>Bienvenido: {{userDb.nombre}}</h4>
    </div>
    <div class="row md-9 justify-center">
      <Suspense>
        <tablaInventario />
      </Suspense>
    </div>
    <!-- <tabla-inventario :col="col" :row="row"/>    -->
  </q-page>
</template>

<script>
import { useStore } from "vuex";
import tablaInventario from "../components/tablaInventario.vue";
import { computed } from "vue";

export default {
  name: "PageIndex",
  components: {
    tablaInventario,
  },
  setup(props) {
    const store = useStore();

    let userDb = computed(() => store.state.usuarioDB)

    console.log(userDb)
    return {
      userDb
    }
  },
};
</script>
