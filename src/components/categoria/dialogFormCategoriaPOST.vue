<template>
  <div class="row justify-center">
    <q-card class="q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Agregar categoria</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="agregarCategoria" class="q-gutter-md">
          <q-input
            filled
            label="Nombre de categoria"
            v-model="categoria.nombre"
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
import useCategoria from "../../hooks/useCategorias";
import { ref, inject, computed } from "vue";

export default {
  setup() {
    const categorias = inject("arrayRef");

    const categoria = ref({
      nombre: "",
    });

    const { axiosPost } = useCategoria(categoria);
    const agregarCategoria = () => {
      let res = axiosPost().then((r) => {
        categorias.value.push(r);
      });

      const testing = (res) => {};

      testing(res);
      categoria.value.nombre = "";
    };

    //Validacion no datos vacios
    const bloqued = computed(() => {
      return !categoria.value.nombre ? "disable" : false;
    });
    const colorButton = computed(() => {
      return bloqued.value === 'disable' ? "negative" : "secondary";
    });

    return {
      colorButton,
      bloqued,
      categoria,
      agregarCategoria,
    };
  },
};
</script>

<style lang="scss" scoped></style>
