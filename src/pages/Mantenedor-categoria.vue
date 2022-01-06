<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Categorias</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
      <Suspense>
        <!-- <tablaInventario :cols="cols" tittle="Categorias" :rows="arrayRef" /> -->
        <tablaInventario :cols="cols" tittle="Categorias" />
      </Suspense>
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
import tablaInventario from "../components/categoria/tablaCategorias.vue";

const cols = [
  {
    name: "uid",
    label: "uid",
    field: "uid",
    align: "left",
    sortable: true,
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
    sortable: true,
  },
  {
    name: "usuario",
    label: "Usuario",
    field: (row) => row.usuario.nombre,
    align: "left",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "", align: "right" },
];

export default {
  components: {
    tablaInventario,
  },
  data() {
    const isVisibleAgregar = ref(false);

    provide("isVisibleAgregar", isVisibleAgregar);

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

    const toggle = () => {
      isVisibleAgregar.value = !isVisibleAgregar.value;
    };
    return {
      cols,
      arrayRef,
      isVisibleAgregar,
      toggle,
    };
  },
};
</script>
