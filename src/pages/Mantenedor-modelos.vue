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
        @click.prevent="toggle"
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
    field: "uid",
    align: "left",
  },
  {
    name: "categoria",
    label: "Categoria",
    field: (row) => row.categoria.nombre,
    align: "left",
  },
  {
    name: "nombre",
    label: "Nombre modelo",
    field: "nombre",
    align: "left",
    sortable: true,
  },
  
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "left",
  },
  {
    name: "stock_minimo",
    label: "Stock mínimo",
    field: "stock_minimo",
    align: "left",
  },
  {
    name: "usuario",
    label: "Usuario creador",
    field: (row) => row.usuario.nombre,
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
    provide("isVisibleAgregar", isVisibleAgregar);

    const modelosArray = ref([]);
    const comboArray = []

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
            const  combo  = r.data;
            combo.forEach(element => {
              comboArray.push(element)
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

    const toggle = () => {
      isVisibleAgregar.value = !isVisibleAgregar.value;
    };
    return {
      cols,
      modelosArray,
      isVisibleAgregar,
      toggle,
      comboArray,
    };
  },
};
</script>
