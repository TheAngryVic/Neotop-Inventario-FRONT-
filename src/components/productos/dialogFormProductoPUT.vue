<template>
  <div class="row justify-center">
    <q-card class="q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Modificar Producto</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="axiosPut" class="q-gutter-md">
          <q-input v-model="pObjeto.nSerie" filled label="N° de Serie" />
          <!-- <q-input filled v-model="producto.categoria"   label="Categoria" /> -->

          <q-select
            filled
            v-model="pObjeto.Modelo.id"
            :options="modelos"
            label="Modelo"
            style="width: 250px"
            hint="Seleccione un modelo"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            filled
            v-model="pObjeto.Bodega.id"
            :options="bodegas"
            label="Bodega"
            style="width: 250px"
            hint="Seleccione una bodega"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          
          <div>
            <q-btn
              :disable="bloqued"
              label="Actualizar"
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
import useProductos from "../../hooks/useProductos";
import { ref, inject, computed } from "vue";

export default {
  props:{
    objeto:{
      type: Object,
      required:true
    }
  },
  setup(props) {


    const modeloArray = inject("modeloArray");
    const bodegaArray = inject("bodegaArray");
    const modelos = ref([]);
    const bodegas = ref([]);

    //Procesar Select
    const procesarModelos = () => {
      modeloArray.forEach((e) => {
        let modelo = {
          label: e.nombre,
          value: e.id,
        };
        modelos.value.push(modelo);
      });
    };
    procesarModelos();
    const procesarBodegas = () => {
      bodegaArray.forEach((e) => {
        let bodega = {
          label: e.nombre,
          value: e.id,
        };
        bodegas.value.push(bodega);
      });
    };
    procesarBodegas();


    //Composables
    const { axiosPut } = useProductos(props.objeto);

    console.log("prosp",  props.objeto.Modelo);

    //Validacion no datos vacios
    const bloqued = computed(() => {
      return !props.objeto.Modelo.id || !props.objeto.Bodega.id || !props.objeto.nSerie
        ? "disable"
        : false;
    });
    const colorButton = computed(() => {
      return bloqued.value === "disable" ? "negative" : "warning";
    });

    return {
      axiosPut,      
      bloqued,
      bodegas,
      colorButton,
      modelos,      
      pObjeto: props.objeto
    };
  },
};
</script>

<style lang="scss" scoped></style>
