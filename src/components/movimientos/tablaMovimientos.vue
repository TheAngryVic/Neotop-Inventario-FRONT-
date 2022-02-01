//TODO: SORT y filtros //TODO: Filtro incompleto, al no encontrar data despues
la tabla queda sin data, hay que reiniciar el objeto de paginacion
<template>
  <q-table
    :columns="cols"
    :filter="filter"
    :loading="loading"
    :rows-per-page-options="[5, 8, 10]"
    :rows="movimientos"
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
</template>

<script>
import { ref, inject,computed } from "vue";

import { api } from "src/boot/axios";

export default {
  props: {
    tittle: String,
    cols: Array,
  },
  setup(props) {
    const movimientos = inject("movimientoArray"); //Array con las productos
    const objeto = ref({}); // Objeto que va a contener el prop de la tabla
    //pagination
    const filter = ref(""); //filtro
    const loading = ref(false); //Para efecto de cargando...

    const pagination = ref({
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 6,
      sortBy: "Fecha",
      descending: false,
    });
    const paginationGet = async (page = 0, size = 5, filter, sortBy, desc) => {
      try {
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
            sorter:sortBy,
            desc
          },
        };

        let response;

        if (filter!=="") {
          
          response = await api.get("/movimientos", filtrado)
        } else {
          if (sortBy) {
            
            response = await api.get("/movimientos", ordenado)
          } else {
            
            response = await api.get("/movimientos", options);
          }
        }

        const { currentPage, pageSize, count } = response.data.meta;

        const rows = response.data.rows;

        movimientos.value.splice(0, count, ...rows);

        pagination.value.page = currentPage;
        pagination.value.rowsPerPage = pageSize;
        pagination.value.rowsNumber = count;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = desc;

        setInterval(() => {
          loading.value = false;
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    };

    function onRequest(props) {
      loading.value = true;
      let upperFilter = props.filter.toUpperCase();
      paginationGet(
        props.pagination.page,
        props.pagination.rowsPerPage,
        upperFilter,
        props.pagination.sortBy,
        props.pagination.descending,
      );
    }


    return {
      movimientos,
      filter,
      loading,
      objeto,
      onRequest,
      pagination,
      
    };
  },
};
</script>
