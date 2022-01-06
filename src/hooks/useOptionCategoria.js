

const useOptionCategoria = async () =>{

    try {      
        const options = {        
          headers: {
            "x-token": localStorage.token,
          }, params: {
          pageSize: 5,
        },
        
        };

        const res = await api.get("/categorias/combo",  options)
        .then((r) => {
          const  combo  = r.data;

          return combo

        })
        .catch(e=>console.log(e.response));
      } catch (error) {
        console.log("Error en get", error);
      }
}



export default useOptionCategoria;