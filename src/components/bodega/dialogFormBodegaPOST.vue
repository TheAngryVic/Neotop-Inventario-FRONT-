<template>
  <div class="row justify-center">
    <q-card class="q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Agregar bodega</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="agregarBodega" class="q-gutter-md">
          <q-input filled label="Nombre de bodega" v-model="bodega.nombre" />
          <q-input filled label="Localización" v-model="bodega.local" />
          <div>
            <q-btn
              label="Agregar"
              class="full-width"
              type="submit"
              color="secondary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import useBodega from "../../hooks/useBodega";
import { ref, inject } from "vue";

export default {
  setup() {
    const bodegas = inject("bodegasArray");

    const bodega = ref({
      nombre: "",
      local: "",
    });

    const { axiosPost } = useBodega(bodega);

    const agregarBodega = () => {
      let res = axiosPost().then((r) => {
        bodegas.value.push(r);
      });

      const testing = (res) => {};

      testing(res);
      bodega.value = {
        nombre: "",
        local: "",
      };
    };

    // const consola = ()=>{
    //     console.log("object");
    // }

    return {
      bodega,
      agregarBodega
    };
  },
};
</script>

<style lang="scss" scoped></style>
