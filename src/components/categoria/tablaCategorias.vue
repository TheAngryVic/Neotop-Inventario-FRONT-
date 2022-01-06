<template>
  <q-table
    class="q-mt-xl"
    :title="tittle"
    :rows="categorias"
    :columns="cols"
    row-key="name"
    color="primary"
    card-class="bg-red-1 text-blue-grey-14"
    v-model:selected="selected"
    virtual-scroll
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          dense
          round
          flat
          color="grey"
          @click="editCategoria(props)"
          icon="las la-edit"
        ></q-btn>
        <q-btn
          dense
          round
          flat
          color="grey"
          @click="deleteCategoria(props)"
          icon="las la-trash"
        ></q-btn>
      </q-td>
    </template>
    <template v-slot:no-data="{ message, filter }">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="las la-meh" />
        <span> Lamentablemente... {{ message }} </span>
        <q-icon
          size="2em"
          :name="filter ? 'filter_b_and_w' : 'las la-exclamation-triangle'"
        />
      </div>
    </template>
  </q-table>
  <!-- FORM -->
  <q-dialog v-model="isEditVisible">
    <dialogForm :objeto="objeto" @changeToggle="changeToggle" />
  </q-dialog>
  <q-dialog v-model="isVisibleAgregar">
    <dialogFormCategoriaPOST :objeto="objeto" @changeToggle="changeToggle" />
  </q-dialog>
</template>

<script>
import { ref, inject } from "vue";
import dialogForm from "./dialogFormCategoriaPUT.vue";
import dialogFormCategoriaPOST from "./dialogFormCategoriaPOST";
import { useQuasar } from "quasar";
import useCategoria from "../../hooks/useCategorias";

export default {
  components: { dialogForm, dialogFormCategoriaPOST },
  props: {
    tittle: String,
    cols: Array,
    // rows: Array,
  },
  async setup(props) {

    const categorias = inject("arrayRef")
    const isVisibleAgregar = inject("isVisibleAgregar")

    const q = useQuasar();
    const isEditVisible = ref(false);
    const objeto = ref({});
    const { axiosDelete } = useCategoria(objeto);
    return {
      categorias,      
      isEditVisible,
      isVisibleAgregar,
      objeto,
      selected: ref([]),
      axiosDelete,
      changeToggle: (status) => {
        isEditVisible.value = status;
      },
      editCategoria: (prop) => {
        isEditVisible.value = !isEditVisible.value;
        objeto.value = prop.row;
      },
      deleteCategoria: (prop) => {
        objeto.value = prop.row;
        console.log(objeto.value);
        q.dialog({
          title: `Advertencia`,
          message: `Está seguro de querer eliminar ${objeto.value.nombre}`,
          cancel: true,
        }).onOk(() => {
          axiosDelete(objeto.value.uid);
          categorias.value = categorias.value.filter(c => c.uid !== objeto.value.uid)        
        });
      },
    };
  },
};
</script>

<style></style>
