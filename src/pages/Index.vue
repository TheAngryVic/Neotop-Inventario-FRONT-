<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Productos</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
      <tabla :cols="cols" tittle="Listado de productos" />
    </div>
  </q-page>
</template>

<script>
import { ref, provide } from "vue";
import { api } from "src/boot/axios";
import tabla from "../components/inventario/tablaInventario.vue";

const cols = [
  {
    name: "Modelo",
    label: "Modelo",
    field: (row) => row.Modelo.nombre,
    align: "left",
    sortable: true,
  },
  {
    name: "Bodega",
    label: "Bodega",
    field: (row) => row.Bodega.nombre,
    align: "left",
    sortable: true,

  },
  {
    name: "Cantidad",
    label: "Cantidad",
    // field: (row) => row.Cantidad,
    field: "Cantidad",
    align: "right",
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

    const inventarioArray = ref([]);

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
          .get("/productos/inventario", options)
          .then((r) => {
            const { meta, rows } = r.data;
            inventarioArray.value = rows;
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    axiosGet();

    provide("inventarioArray", inventarioArray);


    return {
      cols,
      inventarioArray,
      isVisibleAgregar,
      
    };
  },
};
</script>
