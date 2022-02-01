<template>
  <q-table
    v-model:pagination="pagination"
    @request="onRequest"
    class="q-mt-xl"
    :loading="loading"
    :title="tittle"
    :rows="categorias"
    :columns="cols"
    :filter="filter"
    row-key="name"
    color="primary"
    card-class="bg-red-1 text-grey-9"
    virtual-scroll
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
          @click="editCategoria(props)"
          icon="las la-edit"
        ></q-btn>
        <q-btn
          dense
          round
          flat
          color="red-14"
          @click="deleteCategoria(props)"
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
  <!-- FORM -->
  <q-dialog v-model="isEditVisible">
    <dialogForm :objeto="objeto" @changeToggle="changeToggle" />
  </q-dialog>
  <q-dialog v-model="isVisibleAgregar">
    <dialogFormCategoriaPOST :objeto="objeto" @changeToggle="changeToggle" />
  </q-dialog>
  <q-dialog v-model="isVisibleMasivo">
    <masivo  @changeToggle="changeToggle" />
  </q-dialog>
</template>

<script>
import { ref, inject,provide } from "vue"; //Vue cosas
import dialogForm from "./dialogFormCategoriaPUT.vue";// componente
import dialogFormCategoriaPOST from "./dialogFormCategoriaPOST"; // componente
import masivo from "../dialogMasivo.vue"; // componente
import { useQuasar } from "quasar";//Quasar alerts y demás
import useCategoria from "../../hooks/useCategorias";//Composable
import { api } from "src/boot/axios";//Axios de quasar

export default {
  components: { dialogForm, dialogFormCategoriaPOST,masivo },
  props: {
    tittle: String,
    cols: Array,
    // rows: Array,
  },
  setup(props) {   

    //Se injecta las categorias desde el componente padre
    const categorias = inject("arrayRef");
    //Se injecta el toogle de la visibilidad de agregar
    const isVisibleAgregar = inject("isVisibleAgregar");
    //Se injecta el toogle de la visibilidad de agregar
    const isVisibleMasivo = inject("isVisibleMasivo");
    // la q es para usar el $q.dialog de Quasar
    const q = useQuasar();
    //Se injecta el toogle de la visibilidad de editar
    const isEditVisible = ref(false);
    //Objeto que vamos a mandar a las tablas de editar y para borrar
    const objeto = ref({});

    //pagination
    const filter = ref(""); //filtro de buscador
    const loading = ref(false); //Para efecto de cargando...

    const pagination = ref({
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 6,
    });

    // Función de paginación 
    
    const paginationGet =async (page = 0, size = 5, filter, sortBy, desc) => {
      
      // Dependiendo de los parametros pasados por la tabla tenemos opciones distintas 
      // para el axios
      const options = {
        headers: {
          "x-token": localStorage.token,
        },
        params: {
          pageSize: size,
          currentPage: page,
        },
      };
      const filtrado = {
        headers: {
          "x-token": localStorage.token,
        },
        params: {
          pageSize: size,
          currentPage: page,
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
        response = await api.get("/categorias", filtrado);
      } else {
        if (sortBy) {
          response = await api.get("/categorias", ordenado);
        } else {
          response = await api.get("/categorias", options);
        }
      }
      //Recupero los datos que quiero del meta del backend
      const { currentPage, pageSize, count } = response.data.meta;
      //Recupero los datos de las row del backend
      const rows = response.data.rows;
      //Los datos reactivos de categorias es reemplazada con los datos
      categorias.value.splice(0, count, ...rows);

      //Se corrige la paginacion reactiva con los datos del meta del backend
      pagination.value.page = currentPage;
      pagination.value.rowsPerPage = pageSize;
      pagination.value.rowsNumber = count;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = desc;

      //Como no estoy usando la promesa de Axios tengo que fingir el then con un intervalo y detener la animación de loading
      //se puede mejorar 100%
      setInterval(() => {
        loading.value = false;
      }, 1000);
    };

    //la funcion onRequest se ejecuta cuando se interactua con la tabla y recibe los props de la misma
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

    //Saco función de Delete del hook (Composable en vue3) useCategoria
    const { axiosDelete } = useCategoria(objeto);

    //Carga masiva
    //URL para carga masiva
    const url = 'categorias/masivo'
    provide("url", url);
    //campos para carga masiva
    const fields= {
      nombre: { required: true, label: "Nombre" },
      }
    provide("fields", fields);

    return {
      axiosDelete,
      categorias,
      filter,
      isEditVisible,
      isVisibleAgregar,
      isVisibleMasivo,
      loading,
      objeto,
      onRequest,
      pagination,
      changeToggle: (status) => {
        isEditVisible.value = status;
      },
      editCategoria: (prop) => {
        isEditVisible.value = !isEditVisible.value;
        objeto.value = prop.row;
      },
      deleteCategoria: (prop) => {
        objeto.value = prop.row;
        console.log(objeto.value);
        q.dialog({
          title: `Advertencia`,
          message: `Está seguro de querer eliminar ${objeto.value.nombre}`,
          cancel: true,
        }).onOk(() => {
          axiosDelete(objeto.value.id);
          categorias.value = categorias.value.filter(
            (c) => c.id !== objeto.value.id
          );
        });
      },
    };
  },
};
</script>

<style></style>
