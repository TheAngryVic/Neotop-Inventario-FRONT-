<template>
  <div class="row justify-center">
    <q-card class="q-pa-md">
      <q-form @submit.prevent="axiosPut" class="q-gutter-md">
        <q-input v-model="pObjeto.nombre" filled label="Nombre de modelo" />
        <!-- <q-input filled v-model="modelo.categoria"   label="Categoria" /> -->
        <q-select
          filled
          v-model="pObjeto.categoria._id"
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
          v-model.number="pObjeto.stock_minimo"
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
    </q-card>
  </div>
</template>

<script>
import { ref, computed, inject, toRef } from "vue";
import useModelos from "../../hooks/useModelos";
export default {
  props: {
    objeto: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { axiosPut } = useModelos(props.objeto);

    const comboArray = inject("comboArray");
    const categorias = ref([]);


    const procesar = () => {
      comboArray.forEach((e) => {
        let categoria = {
          label: e.nombre,
          value: e.uid,
        };
        categorias.value.push(categoria);
      });
    };

    procesar();

    //Validacion no datos vacios

    const bloqued = computed(() => {
      return !props.objeto.nombre  ? "disable" : false;
    });
    const colorButton = computed(() => {
      return bloqued.value === "disable" ? "negative" : "warning";
    });

    return {
      axiosPut,
      bloqued,
      categorias,
      colorButton,
      pObjeto: props.objeto
    };
  },
};
</script>
