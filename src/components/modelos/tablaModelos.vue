//TODO: SORT y filtros
<template>
  <q-table
    v-model:pagination="pagination"
    @request="onRequest"
    class="q-mt-xl"
    :loading="loading"
    :title="tittle"
    :rows="modelos"
    :columns="cols"
    rows-per-page-label="Filas por página"
    :rows-per-page-options="[5, 8, 0]"
    row-key="uid"
    color="primary"
    card-class="bg-red-1 text-grey-9"
  >
    <template v-slot:top-right>
      <q-input
        :v-model="filter"
        rounded outlined
        debounce="300"
        placeholder="buscador"
        bg-color="red-2"
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
          @click="editarModelo(props)"
          icon="las la-edit"
        ></q-btn>
        <q-btn
          dense
          round
          flat
          color="red-14"
          @click="deleteModelo(props)"
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
          :name="filter ? 'filter_b_and_w' : 'las la-exclamation-triangle'"
        />
      </div>
    </template>
  </q-table>
  <q-dialog v-model="isVisibleAgregar"><agregarModelo :objeto="objeto" @changeToggle="changeToggle"/></q-dialog>
  <q-dialog v-model="isEditVisible"><editarModelo :objeto="objeto" @changeToggle="changeToggle"/></q-dialog>

</template>

<script>
import { ref, inject } from "vue";

import { useQuasar } from "quasar";

import useModelo from "../../hooks/useModelos";

import agregarModelo from "../modelos/dialogFormModeloPOST";
import editarModelo from "../modelos/dialogFormModeloPUT.vue";
import { api } from "src/boot/axios";

export default {
  components: { agregarModelo,editarModelo },
  props: {
    tittle: String,
    cols: Array,
  },
  setup(props) {
    const modelos = inject("modelosArray"); //Array con las modelos
    const isVisibleAgregar = inject("isVisibleAgregar"); //toggle de formulario crear

    const q = useQuasar(); //Para las alertas de quasar
    const isEditVisible = ref(false); //toggle form Edit
    const objeto = ref({}); // Objeto que va a contener el prop de la tabla

    //

    //pagination
    const filter = ref(""); //filtro
    const loading = ref(false); //Para efecto de cargando...

    const pagination = ref({
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 6,
    });
    const paginationGet = (page = 0, size = 8) => {
      const options = {
        headers: {
          "x-token": localStorage.token,
        },
        params: {
          pageSize: size,
          currentPage: page,
        },
      };
      api
        .get("/modelos", options)
        .then((response) => {
          const { currentPage, pageSize, count } = response.data.meta;

          let rows = response.data.rows;
          pagination.value.page = currentPage;
          pagination.value.rowsPerPage = pageSize;
          pagination.value.rowsNumber = count;

          modelos.value.splice(0, count, ...rows);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    function onRequest(props) {
      loading.value = true;
      paginationGet(props.pagination.page, props.pagination.rowsPerPage);
    }

    const { axiosDelete } = useModelo(props.objeto);

    return {
      axiosDelete,
      modelos,
      filter,
      isEditVisible,
      isVisibleAgregar,
      loading,
      objeto,
      onRequest,
      pagination,
      changeToggle: (status) => {
        isEditVisible.value = status;
      },
      editarModelo: (prop) => {
        isEditVisible.value = !isEditVisible.value;
        objeto.value = prop.row;
      },
      deleteModelo: (prop) => {
        objeto.value = prop.row;
        q.dialog({
          title: `Advertencia`,
          message: `Está seguro de querer eliminar ${objeto.value.nombre}`,
          cancel: true,
        }).onOk(() => {
          axiosDelete(objeto.value.uid);
          modelos.value = modelos.value.filter(
            (c) => c.uid !== objeto.value.uid
          );
        });
      },
    };
  },
};
</script>

<style></style>
