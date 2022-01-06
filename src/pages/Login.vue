<template>
  <q-page>
    <div class="column flex">
      <h3 style="text-align: center" class="my-font">Autenticación</h3>
      <q-separator color="primary" size="1px" inset />
    </div>
    <div class="row justify-center">
      <div class="col-md-6 col-xs-12">
        <q-card square bordered class="q-pa-lg shadow-1 q-mt-xl">
          <q-card-section class="q-px-md">
            <q-form @submit="login" class="q-gutter-md" ref="form">
              <q-input
                square
                filled
                v-model="usuario.correo"
                type="email"
                label="Email"
              />
              <q-input
                square
                filled
                clearable
                v-model="usuario.password"
                type="password"
                label="Contraseña"
              />
              <q-btn
                type="submit"
                unelevated
                color="light-green-7"
                size="lg"
                class="full-width q-mt-lg"
                label="Login"
                
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <!-- <q-btn
              type="submit"
              unelevated
              color="light-green-7"
              size="lg"
              class="full-width"
              label="Login"
            /> -->
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';
import { api } from 'boot/axios'
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "Login",
  data(){
    return{
      usuario:{ correo:'test@test.com', password:'123456'}
    }
  },
  methods:{
    ...mapActions(['guardarUsuario']),
    login(){
      console.log(this.usuario)
      api.post('/auth/login', this.usuario)
      .then(res=>{
        console.log("Token   "+ res.data.token);
        const token = res.data.token;
        this.guardarUsuario(token);
      })
      .catch(e=>{
        if (e.response) {
          console.log(e.response)          
        }

      })
    }
  }
  // setup() {
  //   const $q = useQuasar();

  //   const usuario = ref({
  //     email: "",
  //     password: "",
  //   });

  //   return {
  //     usuario,

  //     login() {
  //       console.log(usuario);
  //     },
  //   };
  // },
});
</script>

<style scoped>
.my-font {
  font-family: "Sanlulus";
}
</style>
