<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Categorias</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
      <tablaInventario :cols="cols" tittle="Categorias" />
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
import tablaInventario from "../components/categoria/tablaCategorias.vue";



const cols = [
  {
    name: "uid",
    label: "uid",
    field: "id",
    align: "left",
  },
  {
    name: "nombre",
    label: "Nombre categoria",
    field: "nombre",
    align: "left",
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado categoria",
    field: "estado",
    align: "left",
  },
  { name: "actions", label: "Actions", field: "", align: "right" },
];

export default {
  components: {
    tablaInventario,
  },
  data() {
    //Carga masiva

    // 
    const isVisibleAgregar = ref(false);
    const isVisibleMasivo = ref(false);
  

    provide("isVisibleAgregar", isVisibleAgregar);
    provide("isVisibleMasivo", isVisibleMasivo);
  

    const arrayRef = ref([]);
    const axiosGet = async () => {
      try {
        const options = {
          headers: {
            "x-token": localStorage.token,
          },
        };

        const res = await api.get("/categorias", options).then((r) => {
          const { meta, rows } = r.data;

          arrayRef.value = rows;
        });
      } catch (error) {
        console.log(error);
      }
    };
    axiosGet();

    provide("arrayRef", arrayRef);

    const toggleAgregar = () => {
      isVisibleAgregar.value = !isVisibleAgregar.value;
    };
    const toggleMasivo = () => {
      isVisibleMasivo.value = !isVisibleMasivo.value;
    };
    return {
      cols,
      arrayRef,
      isVisibleAgregar,
      isVisibleMasivo,
      toggleAgregar,
      toggleMasivo,
     
    };
  },
  methods: {
    onValidate(results) {
      results.value = results;
    },
  },
};
</script>
