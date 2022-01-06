<template>
  <q-page>
    <div class="row" v-if="userDb">
      <h4>Bienvenido: {{userDb.nombre}}</h4>
    </div>
    <div class="row md-9 justify-center">
      <Suspense>
        <tablaInventario :cols="cols" :rows="arrayData" tittle="Productos" />
      </Suspense>
    </div>
    <!-- <tabla-inventario :col="col" :row="row"/>    -->
  </q-page>
</template>

<script>
import { useStore } from "vuex";
import tablaInventario from "../components/categoria/tablaCategorias.vue";
import { computed, ref } from "vue";
import { api } from "boot/axios";


const cols = [
  {
    name:'uid',
    label:'uid',
    field:'uid',
    align: 'left',
    sortable: true,
  },
  {
    name:'modelo',
    label:'Modelo',
    field:row => row.modelo.nombre,
    align: 'left',
    sortable: true,
  },
  {
    name:'bodega',
    label:'Bodega',
    field:row => row.bodega.nombre,
    align: 'left',
    sortable: true,
  },
]

export default {
  name: "PageIndex",
  components: {
    tablaInventario,
  },
  setup(props) {
    const store = useStore();
    let userDb = computed(() => store.state.usuarioDB)

    const arrayData = ref([])

    const axiosData = async()=>{
      try {
        const res = await api.get("/productos/")
        .then(response=>{
          arrayData.value = response.data.productos
        }).catch(e=>{
          console.log(e)
        })        

      } catch (error) {
        console.log(error)        
      }
    }

    axiosData()

    return {
      userDb,
      cols,
      arrayData
    }
  },
};
</script>
