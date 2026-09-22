var CLAVE_CARRITO ="cafeteria_carrito";

function obtenerCarrito() {
    var data = localStorage.getItem(CLAVE_CARRITO);
    if (data){
        return JSON.parse(data);

    }
    return[];

}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContador();
    
}

function agregarAlCarrito(idProducto, cantidad) {
    if (!cantidad) {
        cantidad = 1;
    }

    var producto = buscarProductoPorId(idProducto);
    if (!producto) {
        alert("Producto no encontrado.");
        return;

    }

    var carrito = obtenerCarrito();
    var cantidadEnCarrito = 0;
    for (var i = 0; i < carrito.length;i++){
        if (carrito[i].id === idProducto) {
            cantidadEnCarrito = carrito[i].cantidad;
            break;

        }
    }

    if (cantidadEnCarrito + cantidad > producto.stock){
        alert("No hay stock suficiente. Disponible." + producto.stock);
        return;
    
    }

    var existe = false;
    for (var j = 0; j < carrito.length; j++) {
        if(carrito[j].id === idProducto) {
            carrito[j].cantidad = carrito[j].cantidad + cantidad;
            existe = true;
            break;
        }
    }

    if (!existe) {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad

        });

    }

    guardarCarrito(carrito);
    alert("Producto agregado al carrito.");

}

function eliminarDelCarrito(idProducto) {
    var carrito = obtenerCarrito();
    var nuevo = [];
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id != idProducto) {
            nuevo.push(carrito[i]);

        }
    }
    guardarCarrito(nuevo);
    renderizarTablaCarrito();
}

function cambiarCantidad(idProducto, delta){
    var carrito = obtenerCarrito();
    var producto = buscarProductoPorId(idProducto);

    for ( var i = 0; i <carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            var nueva = carrito[i].cantidad + delta;
            if (nueva <= 0) {
                eliminarDelCarrito(idProducto);
                return;
            }
            if (producto && nueva > producto.stock) {
                alert("Stock maximo: " + producto.stock);
                return;
            }
            carrito[i].cantidad = nueva;
            break;
        }
    }
    guardarCarrito(carrito);
    renderizarTablaCarrito();
}

function vaciarCarrito() {
    if (confirm("Desea vaciar el carrito?")) {
        guardarCarrito([]);
        renderizarTablaCarrito();
    }
}

function actualizarContador() {
    var contador = document.getElementById("cart-count");
    if (!contador) {
        return;
    }
    var carrito = obtenerCarrito();
    var total = 0;
    for (var i = 0; i < carrito.length; i++) {
        total = total + carrito[i].cantidad;
    }
    contador.textContent = total;
}

function actualizarTotal() {
    var totalElem = document.getElementById("cart-total");
    if (!totalElem) {
        return 0;
    }
    var carrito = obtenerCarrito();
    var suma = 0;
    for (var i = 0; i < carrito.length; i++) {
        suma = suma + (carrito[i].precio * carrito[i].cantidad);
    }
    totalElem.textContent = "$" + suma.toLocaleString("es-CL");
    return suma;
}

function renderizarTablaCarrito() {
    var body = document.getElementById("tabla-carrito-body");
    var vacio = document.getElementById("carrito-vacio-msg");
    var contenido = document.getElementById("carrito-contenido");
    if (!body) {
        return;
    }

    var carrito = obtenerCarrito();
    if (carrito.length === 0) {
        if (contenido) {
            contenido.style.display = "none";
        }
        if (vacio) {
            vacio.style.display = "block";
            vacio.classList.remove("oculto");
        }
        actualizarTotal();
        actualizarContador();
        return;
    }

    if (contenido) {
        contenido.style.display = "block";
    }
    if (vacio) {
        vacio.style.display = "none";
        vacio.classList.add("oculto");
    }
}
var html = "";
    for (var i = 0; i < carrito.length; i++) {
        var item = carrito[i];
        var sub = item.precio * item.cantidad;
        html += "<tr>";
        html += "<td><img src='" + item.imagen + "' width='45' height='45' alt=''> " + item.nombre + "</td>";
        html += "<td>$" + item.precio.toLocaleString("es-CL") + "</td>";
        html += "<td><button type='button' class='btn btn-secundario' onclick='cambiarCantidad(" + item.id + ",-1)'>-</button> " + item.cantidad + " <button type='button' class='btn btn-secundario' onclick='cambiarCantidad(" + item.id + ",1)'>+</button></td>";
        html += "<td>$" + sub.toLocaleString("es-CL") + "</td>";
        html += "<td><button type='button' class='btn btn-peligro' onclick='eliminarDelCarrito(" + item.id + ")'>Quitar</button></td>";
        html += "</tr>";
    }
    body.innerHTML = html;
    actualizarTotal();
    actualizarContador();
}

function finalizarCompra() {
    var carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("El carrito esta vacio.");
        return;
    }
    var total = actualizarTotal();
    var detalle = "";
    for (var i = 0; i < carrito.length; i++) {
        detalle = detalle + carrito[i].nombre + " x" + carrito[i].cantidad + "; ";
    }
    var nuevoId = ordenesData.length > 0 ? ordenesData[ordenesData.length - 1].id + 1 : 101;
    ordenesData.push({
        id: nuevoId,
        cliente: "Cliente Web",
        fecha: "2026-09-12",
        total: total,
        estado: "Pendiente",
        detalle: detalle
    });
    guardarOrdenes();
    guardarCarrito([]);
    alert("Compra registrada. Gracias.");
    renderizarTablaCarrito();
}

document.addEventListener("DOMContentLoaded", function() {
    renderizarTablaCarrito();
    actualizarContador();
    actualizarTotal();
});


