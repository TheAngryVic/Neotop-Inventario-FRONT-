<template>
  <div id="app">
    <q-card style="height: 600px; max-height: 80vh; max-width: 70vw">
      <q-card-section>
        <h5>Carga masiva</h5>
      </q-card-section>
      <q-card-section
        class="full-width column content-stretch"
      >
        <vue-csv-import v-model="csv" :fields="fields" :text="texto">
          <vue-csv-toggle-headers v-slot="{ hasHeaders, toggle }">
            <div class="row justify-center">
              <q-btn
                push
                color="white"
                :text-color="hasHeaders == true ? 'primary' : 'secondary'"
                label="Tiene cabecera?"
                :icon="hasHeaders == true ? 'las la-times' : 'las la-check '"
                @click.prevent="toggle"
                class="q-my-lg"
              />
            </div>
          </vue-csv-toggle-headers>
          <vue-csv-errors></vue-csv-errors>
          <vue-csv-input></vue-csv-input>
          <vue-csv-map></vue-csv-map>
          <div>
            <q-btn
              push
              color="white"
              text-color="accent"
              label="Procesar archivo"
              @click.prevent="procesar"
              class="q-my-lg"
              :disable="bloquear"
            />
          </div>
        </vue-csv-import>
      </q-card-section>
      <!-- <q-card-section>
        {{ csv }}
      </q-card-section> -->
    </q-card>
  </div>
</template>

<script>
import { ref, inject, computed } from "vue"; //Vue cosas
import { useQuasar } from "quasar"; //Quasar alerts y demás
import {
  VueCsvToggleHeaders,
  VueCsvMap,
  VueCsvInput,
  VueCsvErrors,
  VueCsvImport,
} from "vue-csv-import";
import { api } from "src/boot/axios";

export default {
  components: {
    VueCsvToggleHeaders,
    VueCsvMap,
    VueCsvInput,
    VueCsvErrors,
    VueCsvImport,
  },
  setup() {
    //Quasar plugins
    const q = useQuasar();
    //Opciones para Axios
    const options = {
      headers: {
        "x-token": localStorage.token,
      },
    };
    //Array de datos csv
    const csv = ref(null);

    //Texto del componente CSV-Parser
    const texto = {
      errors: {
        fileRequired: "Un archivo es requerido",
        invalidMimeType: "Tipo de archivo invalido",
      },
      toggleHeaders: "Cabecera?   ",
      submitBtn: "Procesar",
      fieldColumn: "Campo",
      csvColumn: "Columna",
    };
    //Procesar y tal
    const procesar = () => {
      //Buscar repetidos
      const busqueda = csv.value.reduce((acum, row) => {
        acum[row.nombre] = ++acum[row.nombre] || 0;
        return acum;
      }, {});

      //Buscar repetidos 2
      const repetidos = csv.value.filter((row) => {
        return busqueda[row.nombre];
      });
      //Hay repetidos?
      if (repetidos > 0) {
        q.dialog({
          title: `Advertencia`,
          message: `Tiene datos repetidos: ${repetidos[0].nombre}`,
        });
        return;
      }

      //Axios y respuestas
      api
        .post("categorias/masivo", csv, options)
        .then((res) => {
          if (res.status == 200) {
            q.dialog({
              title: `Exito`,
              message: `Los datos se han cargado con exito `,
            });
          }      
        })
        .catch((res) => {
          if (res.status == '400') {
            q.dialog({
              title: `Error`,
              message: `${res.data.msg}`,
            });
          }
        });

      //
      console.log(csv.value);
    };

    //Bloquear button si no hay csv
    const bloquear = computed(() => (csv.value != null ? "true" : ""));

    return {
      options,
      fields: {
        nombre: { required: true, label: "Nombre" },
      },
      texto,
      csv,
      procesar,
      bloquear,
    };
  },
};
</script>

<style lang="css" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
