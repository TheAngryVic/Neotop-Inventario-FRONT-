<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Modelos</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
      <tabla :cols="cols" tittle="Listado de modelos" />
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
import { ref, provide, watchEffect } from "vue";
import { api } from "src/boot/axios";
import tabla from "../components/modelos/tablaModelos.vue";

const cols = [
  {
    name: "uid",
    label: "uid",
    field: "id",
    align: "right",
  },
  {
    name: "nombre",
    label: "Nombre modelo",
    field: "nombre",
    align: "left",
    sortable: true,
  },
  {
    name: "CategoriumId",
    label: "Categoria",
    field: (row) => row.Categorium.nombre,
    align: "left",
    sortable: true,
  },
  {
    name: "stock_minimo",
    label: "Stock mínimo",
    field: "stock_minimo",
    align: "right",
    sortable: true,
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

    const modelosArray = ref([]);
    const comboArray = [];

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
          .get("/modelos", options)
          .then((r) => {
            const { meta, rows } = r.data;
            modelosArray.value = rows;
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    axiosGet();

    const getCombo = async () => {
      try {
        const options = {
          headers: {
            "x-token": localStorage.token,
          },
        };

        await api
          .get("/categorias/combo", options)
          .then((r) => {
            const combo = r.data;
            combo.forEach((element) => {
              comboArray.push(element);
            });
          })
          .catch((e) => console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    getCombo();

    provide("modelosArray", modelosArray);
    provide("comboArray", comboArray);

    const toggleAgregar = () => {
      isVisibleAgregar.value = !isVisibleAgregar.value;
    };
    const toggleMasivo = () => {
      isVisibleMasivo.value = !isVisibleMasivo.value;
    };
    return {
      cols,
      modelosArray,
      isVisibleAgregar,
      toggleAgregar,
      toggleMasivo,
      comboArray,
    };
  },
};
</script>
