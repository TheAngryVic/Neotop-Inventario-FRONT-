import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import router from "../router/index";
import { inject } from 'vue'

const useCategoria = (objeto) => {
  const $q = useQuasar();

  const options = {
    headers: {
      "x-token": localStorage.token,
    },
  };

  const axiosPut = async () => {
    try {
      const res = await api
        .put(`categorias/${objeto.id}`, objeto, options)
        .then((r) => {
          console.log(r.data.msg);
          if (r.status === 200) {
            $q.dialog({
              title: "Exito al actualizar",
              message: r.data.msg,
              cancel: true,
            });
          }
        })
        .catch((e) => {
          console.log(e.response);
          if (e.response.status === 401) {
            $q.dialog({
              title: "Alerta de permisos",
              message: e.response.data.msg,
            });
          }
          if (e.response.status === 400) {
            $q.dialog({
              title: "Alerta de repetidos",
              message: e.response.data.msg,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const axiosDelete = async (id = "") => {
    try {
      const res = await api
        .delete(`categorias/${id}`, options)
        .then((r) => {
          console.log(r);
          if (r.status === 200) {
            $q.dialog({
              title: "Exito",
              message: r.data.msg,
            });
          }
        })
        .catch((e) => {
          console.log(e.response);
          if (e.response.status === 401) {
            $q.dialog({
              title: "Alerta de permisos",
              message: e.response.data.msg,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  
  const axiosPost = async () => {
    let data;
    try {      

      const res = await api
        .post("categorias", objeto.value, options)
        .then((r) => {
          console.log(r);
          if (r.status === 201) {
            $q.dialog({
              title: "Exito al agregar",
              message: `${r.data.nombre} se ha agregado con exito`,
            });           

            data = r.data
          }
        })
        .catch((e) => {
          console.log(e.response);
          if (e.response.status === 401) {
            $q.dialog({
              title: "Alerta de permisos",
              message: e.response.data.msg,
            });
          }
          if (e.response.status === 400) {
            $q.dialog({
              title: "Alerta",
              message: e.response.data.msg,
            });
          }
        });

        return data
    } catch (error) {
      console.log(error);
    }
  };


  return {
    axiosPut,
    axiosDelete,
    axiosPost,
  };
};

export default useCategoria;
