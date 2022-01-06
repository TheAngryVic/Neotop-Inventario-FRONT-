<template>
  <div class="row justify-center">
    <q-card class="q-pa-md">
      <q-form @submit.prevent="axiosPut" class="q-gutter-md">
        <q-input filled label="uid" v-model="pObjeto.uid" disable valu />
        <q-input
          filled
          v-model="pObjeto.nombre"
          label="Nombre de categoria"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Debe ingresar un nombre para categoria',
            (val) =>
              (val.length >= 3 && val.length < 20) ||
              'Debe ingresar un nombre entre 3 a 20 caracteres',
          ]"
        />
        <div>
          <q-btn
            label="Editar"
            class="full-width"
            type="submit"
            :color="colorButton"
            :disable="bloqued"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import useCategoria from "../../hooks/useCategorias";
export default {
  props: {
    objeto: {
      type: Object,
      required: true,
    },
  },
  setup(props) {

    const { axiosPut } = useCategoria(props.objeto);

    //Validacion no datos vacios
    
    const bloqued = computed(() => {
      return !props.objeto.nombre ? "disable" : false;
    });
    const colorButton = computed(() => {
      return bloqued.value === "disable" ? "negative" : "warning";
    });

    return {
      axiosPut,
      pObjeto: props.objeto,
      bloqued,
      colorButton
    };
  },
};
</script>
