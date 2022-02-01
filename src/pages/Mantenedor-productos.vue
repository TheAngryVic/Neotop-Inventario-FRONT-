<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Productos</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
      <tabla :cols="cols" tittle="Listado de productos (Mantenedor)" />
    </div>
    <div class="row justify-center q-mt-md">
      <q-btn
        color="secondary"
        icon="las la-check"
        label="Agregar"
        @click.prevent="toggleAgregar"
      />
      <q-btn
        color="accent"
        icon="las la-paperclip"
        label="Carga masiva"
        @click.prevent="toggleMasivo"
        class="q-mx-md"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, provide } from "vue";
import { api } from "src/boot/axios";
import tabla from "../components/productos/tablaProductos.vue";

const cols = [
  {
    name: "uid",
    label: "uid",
    field: "id",
    align: "left",
  },
  {
    name: "Modelo",
    label: "Modelo",
    field: (row) => row.Modelo.nombre,
    align: "left",
    sortable: true,
  },
  {
    name: "nSerie",
    label: "N° Serie",
    field: "nSerie",
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
    name: "usuario",
    label: "Creador",
    field: (row) => row.Usuario.nombre,
    align: "left",
  },
  { name: "actions", label: "Actions", field: "", align: "right" },
];

export default {
  components: {
    tabla,
  },
  data() {
    const isVisibleAgregar = ref(false);
    const isVisibleMasivo = ref(false);

    provide("isVisibleAgregar", isVisibleAgregar);
    provide("isVisibleMasivo", isVisibleMasivo);

    const productosArray = ref([]);
    const bodegaArray = [];
    const modeloArray = [];

    const axiosGet = async (currentPage = 0) => {
      try {
        const options = {
          headers: {
            "x-token": localStorage.token,
          },
          params: {
            pageSize: 5,
          },
        };

        const res = await api
          .get("/productos", options)
          .then((r) => {
            const { meta, rows } = r.data;
            productosArray.value = rows;
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    axiosGet();

    const getBodegas = async () => {
      try {
        const options = {
          headers: {
            "x-token": localStorage.token,
          },
        };

        await api
          .get("/bodegas/combo", options)
          .then((r) => {
            const combo = r.data;
            combo.forEach((element) => {
              bodegaArray.push(element);
            });
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    getBodegas();

    const getModelos = async () => {
      try {
        const options = {
          headers: {
            "x-token": localStorage.token,
          },
        };

        await api
          .get("/modelos/combo", options)
          .then((r) => {
            const combo = r.data;
            combo.forEach((element) => {
              modeloArray.push(element);
            });
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    getModelos();

    provide("productosArray", productosArray);
    provide("modeloArray", modeloArray);
    provide("bodegaArray", bodegaArray);

    const toggleAgregar = () => {
      isVisibleAgregar.value = !isVisibleAgregar.value;
    };
    const toggleMasivo = () => {
      isVisibleMasivo.value = !isVisibleMasivo.value;
    };
    return {
      cols,
      productosArray,
      isVisibleAgregar,
      toggleAgregar,
      toggleMasivo,
    };
  },
};
</script>
