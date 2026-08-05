function buscarProducto(){

    let texto = document
    .getElementById("buscarProducto")
    .value
    .toLowerCase();

    let productos =
    document.querySelectorAll(".producto");

    productos.forEach(producto=>{

        let nombre =
        producto.dataset.nombre;

        if(nombre.includes(texto)){

            producto.style.display="block";

        }else{

            producto.style.display="none";

        }

    });

}
