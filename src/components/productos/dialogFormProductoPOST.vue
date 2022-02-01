<template>
  <div class="row justify-center">
    <q-card class="q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-primary">Agregar Producto</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="agregarModelo" class="q-gutter-md">
          <!-- <q-input filled v-model="producto.categoria"   label="Categoria" /> -->

          <q-select
            filled
            v-model="producto.modelo"
            :options="modelos"
            label="Modelo"
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

          <q-input v-model="producto.nSerie" filled label="N° de Serie" />
          <q-select
            filled
            v-model="producto.bodega"
            :options="bodegas"
            label="Bodega"
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
import useProductos from "../../hooks/useProductos";
import { ref, inject, computed } from "vue";

export default {
  setup() {
    const productos = inject("productosArray");
    const modeloArray = inject("modeloArray");
    const bodegaArray = inject("bodegaArray");
    const modelos = ref([]);
    const bodegas = ref([]);

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

    const producto = ref({
      modelo: "",
      bodega: "",
      nSerie: "",
    });

    //Composables
    const { axiosPost } = useProductos(producto);

    const agregarModelo = () => {
      let res = axiosPost().then((r) => {
        productos.value.push(r);
      });

      const testing = (res) => {};

      testing(res);
      producto.value = {
        modelo: "",
        bodega: "",
        nSerie: "",
      };
    };

    //Validacion no datos vacios
    const bloqued = computed(() => {
      return !producto.value.modelo || !producto.value.bodega || !producto.value.nSerie
        ? "disable"
        : false;
    });
    const colorButton = computed(() => {
      return bloqued.value === "disable" ? "negative" : "secondary";
    });

    return {
      agregarModelo,
      bloqued,
      bodegas,
      colorButton,
      modelos,
      producto,
    };
  },
};
</script>

<style lang="scss" scoped></style>
