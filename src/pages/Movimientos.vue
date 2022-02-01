<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Movimientos de productos</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
      <tabla :cols="cols" tittle="Listado de productos" />
    </div>
  </q-page>
</template>

<script>
import { ref, provide } from "vue";
import { api } from "src/boot/axios";
import tabla from "../components/movimientos/tablaMovimientos.vue";

const cols = [
  {
    name: "nSerie",
    label: "Serie de producto",
    field: (row) => row.Producto.nSerie,
    align: "left",
  },
  {
    name: "local_original",
    label: "Original",
    field:"local_original" ,
    // field: (row) => row.Modelo.nombre,
    align: "left",
  },
  {
    name: "local_nuevo",
    label: "Nuevo",
    field:"local_nuevo" ,
    // field: (row) => row.Modelo.nombre,
    align: "left",
  },
  {
    name: "fecha",
    label: "Fecha de actualización",
    field:"fecha" ,
    // field: (row) => row.Modelo.nombre,
    align: "left",
    sortable: true,
  },


];

export default {
  components: {
    tabla,
  },
  data() {
    const isVisibleAgregar = ref(false);
    provide("isVisibleAgregar", isVisibleAgregar);

    const movimientoArray = ref([]);

    const axiosGet = async (currentPage = 1) => {
      try {
        const options = {
          headers: {
            "x-token": localStorage.token,
          },
          params: {
            pageSize: 5,
            currentPage
          },
        };

        const res = await api
          .get("/movimientos", options)
          .then((r) => {
            const { meta, rows } = r.data;
            movimientoArray.value = rows;
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    axiosGet();

    provide("movimientoArray", movimientoArray);


    return {
      cols,
      movimientoArray,
      isVisibleAgregar,
      
    };
  },
};
</script>
