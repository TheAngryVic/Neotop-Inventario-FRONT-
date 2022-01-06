<template>
  <q-page class="q-p2">
    <div class="row justify-center">
      <h3>Bodegas</h3>
    </div>
    <div class="row xs-12 md-9 justify-center">
        <tabla :cols="cols" tittle="Listado de bodegas" />

    </div>
      <div class="row justify-center q-mt-md">
        <q-btn color="secondary" icon="las la-check" label="Agregar" @click.prevent="toggle" />
      </div>
  </q-page>
</template>

<script>
import { ref, provide, watchEffect } from "vue";
import { api } from "src/boot/axios";
import tabla from "../components/bodega/tablaBodegas.vue";
import useOptionCategoria from "../hooks/useOptionCategoria";

const cols = [
  {
    name: "uid",
    label: "uid",
    field: "uid",
    align: "left",
  },
  {
    name: "nombre",
    label: "Nombre bodega",
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
  {
    name: "local",
    label: "Lugar",
    field: "local",
    align: "left",
  },
  { name: "actions", label: "Actions", field: "", align: "right" },
];

export default {
  components: {
    tabla,
  },
  data() {


    
    const isVisibleAgregar = ref(false)
    provide("isVisibleAgregar", isVisibleAgregar)

   const bodegasArray = ref([]);


    const axiosGet = async (currentPage=0) => {
      try {      
        const options = {        
          headers: {
            "x-token": localStorage.token,
          }, params: {
          pageSize: 5,
        },
        
        };

        const res = await api.get("/bodegas",  options)
        .then((r) => {
          const { meta, rows } = r.data;
          bodegasArray.value = rows;
        })
        .catch(e=>console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
    };
    axiosGet();

  

    provide("bodegasArray", bodegasArray);


  const toggle = ()=>{
    isVisibleAgregar.value = !isVisibleAgregar.value
  }
    return {  
      cols,
      bodegasArray,
      isVisibleAgregar,
      toggle
    };
  },
};
</script>
