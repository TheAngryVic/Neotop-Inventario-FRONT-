<template>
  <div class="row justify-center">
    <q-card class="q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Agregar modelo</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="agregarModelo" class="q-gutter-md">
          <q-input v-model="modelo.nombre" filled label="Nombre de modelo" />
          <!-- <q-input filled v-model="modelo.categoria"   label="Categoria" /> -->

          <q-select
            filled
            v-model="modelo.categoria"
            :options="categorias"
            label="Categoria"
            style="width: 250px"
            hint="Seleccione una categoria"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            filled
            type="number"
            min="0"
            max="50"
            v-model.number="modelo.stock_minimo"
            label="Stock minimo"
          />
          <div>
            <q-btn
              :disable="bloqued"
              label="Agregar"
              class="full-width"
              type="submit"
              :color="colorButton"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
  
</template>

<script>
import useModelos from "../../hooks/useModelos";
import { ref, inject, computed } from "vue";

export default {
  setup() {
    const modelos = inject("modelosArray");
    const comboArray = inject("comboArray");   
    const categorias = ref([])

    const procesar = () => {

        comboArray.forEach(e => {

            let categoria = {
                label: e.nombre,
                value: e.id
            }
            categorias.value.push(categoria)            
        });
     
    };

    procesar();

    const modelo = ref({
      nombre: "",
      categoria: "",
      stock_minimo: 0,
    });
 

    //Composables
    const { axiosPost } = useModelos(modelo);

    const agregarModelo = () => {


      let res = axiosPost().then((r) => {
        modelos.value.push(r);
      });

      const testing = (res) => {};

      testing(res);
      modelo.value = {
        nombre: "",
        categoria: "",
        stock_minimo: 0,
      };
    };

    //Validacion no datos vacios
    const bloqued = computed(() => {
      return !modelo.value.nombre || !modelo.value.categoria
        ? "disable"
        : false;
    });
    const colorButton = computed(() => {
      return bloqued.value === "disable" ? "negative" : "secondary";
    });

    return {
      agregarModelo,
      bloqued,
      categorias,
      colorButton,
      comboArray,
      modelo,
    };
  },
};
</script>

<style lang="scss" scoped></style>
