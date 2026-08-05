// GENERAR CODIGO AUTOMATICO

function generarCodigo(categoria, numero){

    let letra = "";

    switch(categoria){

        case "alcancias":
            letra = "A";
        break;

        case "relieves":
            letra = "R";
        break;

        case "papercraft":
            letra = "P";
        break;

    }

    return letra + numero.toString().padStart(3,"0");

}





// CARGAR CARRITO GUARDADO

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];





// MENSAJE AUTOMATICO SIN ALERT

function mostrarMensaje(texto){

    let mensaje = document.getElementById("mensaje");


    if(!mensaje){

        mensaje = document.createElement("div");

        mensaje.id = "mensaje";

        document.body.appendChild(mensaje);


        mensaje.style.position = "fixed";
        mensaje.style.top = "20px";
        mensaje.style.right = "20px";
        mensaje.style.background = "#28a745";
        mensaje.style.color = "white";
        mensaje.style.padding = "15px 20px";
        mensaje.style.borderRadius = "10px";
        mensaje.style.fontWeight = "bold";
        mensaje.style.boxShadow = "0 5px 15px rgba(0,0,0,.3)";
        mensaje.style.zIndex = "9999";
        mensaje.style.opacity = "0";
        mensaje.style.transition = "0.3s";

    }


    mensaje.innerHTML = "✅ " + texto;


    mensaje.style.opacity = "1";



    setTimeout(function(){

        mensaje.style.opacity = "0";

    },2000);


}







// AGREGAR PRODUCTO SIMPLE

function agregarCarrito(
codigo,
nombre,
precio,
imagen
){


    let productoExistente = carrito.find(

        producto => producto.codigo === codigo

    );



    if(productoExistente){


        productoExistente.cantidad += 1;


    }

    else{


        carrito.push({

            codigo:codigo,

            nombre:nombre,

            precio:precio,

            imagen:imagen,

            cantidad:1

        });


    }



    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );



    mostrarMensaje(nombre+" agregado al carrito");


}









// AGREGAR PRODUCTO CON CANTIDAD

function agregarProductoConCantidad(

codigo,

nombre,

precio,

imagen,

idCantidad

){


    let cantidad = Number(

        document.getElementById(idCantidad).value

    );



    let productoExistente = carrito.find(

        producto => producto.codigo === codigo

    );





    if(productoExistente){


        productoExistente.cantidad += cantidad;


    }

    else{


        carrito.push({

            codigo:codigo,

            nombre:nombre,

            precio:precio,

            imagen:imagen,

            cantidad:cantidad

        });


    }




    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );




    mostrarMensaje(nombre+" agregado al carrito");


}









// MOSTRAR CARRITO

function mostrarCarrito(){


let lista=document.getElementById("lista-carrito");


let totalTexto=document.getElementById("total");



if(!lista){

return;

}




lista.innerHTML="";


let total=0;



carrito.forEach((producto,index)=>{


let subtotal = producto.precio * producto.cantidad;


total += subtotal;




lista.innerHTML += `


<div class="producto carrito-item">


<img src="${producto.imagen}" width="150">


<h3>

Código:

${producto.codigo}

<br>

${producto.nombre}

</h3>



<p>

Precio:

S/ ${producto.precio}

</p>




<div class="cantidad">


<button class="boton"

onclick="cambiarCantidad(${index},-1)">

-

</button>




<span>

${producto.cantidad}

</span>




<button class="boton"

onclick="cambiarCantidad(${index},1)">

+

</button>


</div>




<p>

Subtotal:

S/ ${subtotal}

</p>




<button class="boton"

onclick="eliminarProducto(${index})">

❌ Eliminar

</button>



</div>


`;



});





if(totalTexto){

totalTexto.innerHTML =

"Total: S/ "+total.toFixed(2);

}


}









// CAMBIAR CANTIDAD

function cambiarCantidad(index,cambio){


carrito[index].cantidad += cambio;



if(carrito[index].cantidad < 1){

carrito[index].cantidad = 1;

}




localStorage.setItem(

"carrito",

JSON.stringify(carrito)

);




mostrarCarrito();


}









// ELIMINAR PRODUCTO

function eliminarProducto(index){


carrito.splice(index,1);



localStorage.setItem(

"carrito",

JSON.stringify(carrito)

);



mostrarCarrito();


}









// VACIAR CARRITO

function vaciarCarrito(){


carrito=[];


localStorage.removeItem("carrito");



mostrarCarrito();


}









// ENVIAR WHATSAPP

function enviarWhatsApp(){



if(carrito.length === 0){


mostrarMensaje("El carrito está vacío");


return;


}





let mensaje =

"Hola quiero realizar este pedido:%0A%0A";




let total=0;




carrito.forEach(producto=>{


let subtotal = producto.precio * producto.cantidad;



mensaje +=

"- Código: "

+ producto.codigo

+

" - "

+

producto.nombre

+

" x"

+

producto.cantidad

+

" S/"

+

subtotal

+

"%0A";



total += subtotal;



});




mensaje +=

"%0ATotal: S/"

+

total;



window.open(

"https://wa.me/51912345678?text="+mensaje,

"_blank"

);



}









// MOSTRAR AL CARGAR

mostrarCarrito();
