//TODO: SORT y filtros
<template>
  <q-table
    :columns="cols"
    :filter="filter"
    :loading="loading"
    :rows-per-page-options="[5, 8, 10]"
    :rows="bodegas"
    :title="tittle"
    @request="onRequest"
    card-class="bg-red-1 text-grey-9"
    class="q-mt-xl"
    color="primary"
    row-key="id"
    rows-per-page-label="Filas por página"
    v-model:pagination="pagination"
    binary-state-sort
  >
    <template v-slot:top-right>
      <q-input
        v-model="filter"
        rounded
        outlined
        debounce="300"
        placeholder="buscador"
        bg-color="white"
      >
        <template v-slot:append>
          <q-icon name="las la-search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          dense
          round
          flat
          color="orange-13"
          @click="editarBodega(props)"
          icon="las la-edit"
        ></q-btn>
        <q-btn
          dense
          round
          flat
          color="red-14"
          @click="deleteBodega(props)"
          icon="las la-trash"
        ></q-btn>
      </q-td>
    </template>
    <template v-slot:no-data="{ message, filter }">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="las la-meh" />
        <span> Lamentablemente... {{ message }} </span>
        <q-icon
          size="2em"
          :name="filter ? 'las la-frown' : 'las la-exclamation-triangle'"
        />
      </div>
    </template>
  </q-table>
  <q-dialog v-model="isVisibleAgregar"
    ><agregarBodega :objeto="objeto" @changeToggle="changeToggle"
  /></q-dialog>
  <q-dialog v-model="isEditVisible"
    ><editarBodega :objeto="objeto" @changeToggle="changeToggle"
  /></q-dialog>
  <q-dialog v-model="isVisibleMasivo">
    <masivo @changeToggle="changeToggle" />
  </q-dialog>
</template>

<script>
import { ref, inject,provide } from "vue";

import { useQuasar } from "quasar";

import useBodega from "../../hooks/useBodega";
import masivo from "../dialogMasivo.vue"; // componente
import agregarBodega from "../bodega/dialogFormBodegaPOST";
import editarBodega from "../bodega/dialogFormBodegaPUT";
import { api } from "src/boot/axios";

export default {
  components: { agregarBodega, editarBodega, masivo },
  props: {
    tittle: String,
    cols: Array,
  },
  setup(props) {
    const bodegas = inject("bodegasArray"); //Array con las bodegas
    const isVisibleAgregar = inject("isVisibleAgregar"); //toggle de formulario crear

    const q = useQuasar(); //Para las alertas de quasar
    const isEditVisible = ref(false); //toggle form Edit
    const objeto = ref({}); // Objeto que va a contener el prop de la tabla

    //pagination
    const filter = ref(""); //filtro
    const loading = ref(false); //Para efecto de cargando...

    const pagination = ref({
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 6,
    });
    const paginationGet = async (page = 0, size = 5, filter, sortBy, desc) => {
      const options = {
        headers: {
          "x-token": localStorage.token,
        },
        params: {
          currentPage: page,
          pageSize: size,
        },
      };
      const filtrado = {
        headers: {
          "x-token": localStorage.token,
        },
        params: {
          currentPage: page,
          pageSize: size,
          filter,
        },
      };
      const ordenado = {
        headers: {
          "x-token": localStorage.token,
        },
        params: {
          currentPage: page,
          pageSize: size,
          sorter: sortBy,
          desc,
        },
      };

      let response;

      if (filter !== "") {
        response = await api.get("/bodegas", filtrado);
      } else {
        if (sortBy) {
          response = await api.get("/bodegas", ordenado);
        } else {
          response = await api.get("/bodegas", options);
        }
      }

      const { currentPage, pageSize, count } = response.data.meta;

      const rows = response.data.rows;

      bodegas.value.splice(0, count, ...rows);

      pagination.value.page = currentPage;
      pagination.value.rowsPerPage = pageSize;
      pagination.value.rowsNumber = count;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = desc;

      setInterval(() => {
        loading.value = false;
      }, 1000);
    };

    function onRequest(props) {
      loading.value = true;
      let upperFilter = props.filter.toUpperCase();
      paginationGet(
        props.pagination.page,
        props.pagination.rowsPerPage,
        upperFilter,
        props.pagination.sortBy,
        props.pagination.descending
      );
    }

    const { axiosDelete } = useBodega(props.objeto);

    //MAsivo
    const isVisibleMasivo = inject("isVisibleMasivo");
    const url = "bodegas/masivo";
    provide("url", url);
    //campos para carga masiva
    const fields = {
      nombre: { required: true, label: "Nombre" },
      local: { required: true, label: "Ubicación" },
    };
    provide("fields", fields);

    return {
      axiosDelete,
      bodegas,
      filter,
      isEditVisible,
      isVisibleMasivo,
      isVisibleAgregar,
      loading,
      objeto,
      onRequest,
      pagination,
      changeToggle: (status) => {
        isEditVisible.value = status;
      },
      editarBodega: (prop) => {
        isEditVisible.value = !isEditVisible.value;
        objeto.value = prop.row;
      },
      deleteBodega: (prop) => {
        objeto.value = prop.row;
        q.dialog({
          title: `Advertencia`,
          message: `Está seguro de querer eliminar ${objeto.value.nombre}`,
          cancel: true,
        }).onOk(() => {
          axiosDelete(objeto.value.id);
          bodegas.value = bodegas.value.filter((c) => c.id !== objeto.value.id);
          console.log("ok");
        });
      },
    };
  },
};
</script>

<style></style>
