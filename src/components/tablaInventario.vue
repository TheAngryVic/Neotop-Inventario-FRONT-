<template>
  <q-table 
  class="q-mt-xl"
    title="Productos"
    :columns="cols"
    :rows="productos">
    <template v-slot:no-data="{  message, filter }">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="las la-meh" />
        <span> Lamentablemente... {{ message }} </span>
        <q-icon size="2em" :name="filter ? 'filter_b_and_w' : 'las la-exclamation-triangle'" />
      </div>
    </template>
  </q-table>
</template>

<script>

import { api } from "boot/axios";


const cols = [
    // {
    //     name: '',
    //     label:'',
    //     align:'left',
    //     field: '',
    //     sorteable: true
    // }
    {
        name: 'uid',
        label:'uid',
        align:'left',
        field: 'uid',
        sorteable: true
    },
    {
        name: 'modelo',
        label:'Modelo',
        align:'left',
        field: row => row.modelo.nombre,
        sorteable: true
    },
    {
        name: 'bodega',
        label:'Bodega',
        align:'center',
        field: row => row.bodega.nombre,
        sorteable: true
    },
    {
        name: 'cantidad',
        label:'Cantidad',
        align:'left',
        field: 'total',
        sorteable: true
    }

]

export default {
  async setup(){

    const res = await api.get("/productos/");    
    const {total, productos} = res.data;

    console.log(productos)

    return{
      cols,
      total,
      productos
    }
  },
};
</script>

<style></style>
