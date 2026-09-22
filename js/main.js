// Funciones de paginas - DSY1104

function obtenerUsuarioSesion() {
    var txt = sessionStorage.getItem("usuarioActivo");
    if (txt) {
        return JSON.parse(txt);
    }
    return null;
}

function verificarPermisosRol() {
    var pagina = window.location.pathname.split("/").pop();

    if (pagina.indexOf("admin-") !== 0) {
        return;
    }

    var user = obtenerUsuarioSesion();
    if (!user || user.rol === "Cliente") {
        alert("Debe iniciar sesion como Administrador o Vendedor.");
        window.location.href = "login.html";
        return;
    }

    var navRight = document.querySelector(".navbar .nav-right");
    if (navRight) {
        navRight.innerHTML = "<span>" + user.nombre + " (" + user.rol + ")</span> <button type='button' class='btn-nav-login' onclick='cerrarSesion()'>Cerrar sesion</button>";
    }

    if (user.rol === "Vendedor") {
        var bloqueadas = [
            "admin-home.html",
            "admin-nuevo-producto.html",
            "admin-editar-producto.html",
            "admin-usuarios.html",
            "admin-nuevo-usuario.html",
            "admin-editar-usuario.html",
            "admin-mostrar-usuario.html"
        ];
        for (var b = 0; b < bloqueadas.length; b++) {
            if (pagina === bloqueadas[b]) {
                alert("El vendedor no tiene acceso a esta seccion.");
                window.location.href = "admin-productos.html";
                return;
            }
        }

        var links = document.querySelectorAll(".admin-sidebar a");
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute("href");
            if (href !== "admin-productos.html" && href !== "admin-mostrar-producto.html") {
                links[i].parentElement.style.display = "none";
            }
        }

        var btnNuevo = document.querySelector("a[href='admin-nuevo-producto.html']");
        if (btnNuevo) {
            btnNuevo.style.display = "none";
        }
        var btnNuevoAdmin = document.getElementById("btn-nuevo-producto-admin");
        if (btnNuevoAdmin) {
            btnNuevoAdmin.style.display = "none";
        }

        var seccionOrdenes = document.getElementById("seccion-ordenes-admin");
        if (seccionOrdenes) {
            seccionOrdenes.style.display = "block";
        }
    }
}

function crearHtmlTarjetaProducto(prod, mostrarBotones) {
    var html = "<div class='tarjeta'>";
    html += "<a href='detalle-producto.html?id=" + prod.id + "'><img src='" + prod.imagen + "' class='tarjeta-img' alt='" + prod.nombre + "'></a>";
    html += "<div class='tarjeta-body'>";
    html += "<h3>" + prod.nombre + "</h3>";
    html += "<p class='tarjeta-precio'>$" + prod.precio.toLocaleString("es-CL") + "</p>";
    if (mostrarBotones) {
        html += "<div class='fila-botones'>";
        html += "<a href='detalle-producto.html?id=" + prod.id + "' class='btn btn-secundario'>Ver detalle</a>";
        html += "<button type='button' class='btn' onclick='agregarAlCarrito(" + prod.id + ",1)'>Anadir</button>";
        html += "</div>";
    }
    html += "</div></div>";
    return html;
}

function renderizarProductosHome() {
    var cont = document.getElementById("grid-home-productos");
    if (!cont) {
        return;
    }
    var html = "";
    for (var i = 0; i < productosData.length; i++) {
        html += crearHtmlTarjetaProducto(productosData[i], true);
    }
    cont.innerHTML = html;
}

function renderizarProductosCatalogo() {
    var cont = document.getElementById("grid-productos");
    if (!cont) {
        return;
    }
    var html = "";
    for (var i = 0; i < productosData.length; i++) {
        html += crearHtmlTarjetaProducto(productosData[i], true);
    }
    cont.innerHTML = html;
}

function cargarDetalleProducto() {
    var cont = document.getElementById("vista-detalle-producto");
    if (!cont) {
        return;
    }
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get("id"), 10);
    var prod = buscarProductoPorId(id);
    if (!prod) {
        cont.innerHTML = "<p>Producto no encontrado.</p>";
        return;
    }

    var html = "<img src='" + prod.imagen + "' class='detalle-img' alt='" + prod.nombre + "'>";
    html += "<div class='detalle-info'>";
    html += "<h2>" + prod.nombre + "</h2>";
    html += "<p>" + prod.descripcion + "</p>";
    html += "<p><strong>Codigo:</strong> " + prod.codigo + "</p>";
    html += "<p class='tarjeta-precio'>$" + prod.precio.toLocaleString("es-CL") + "</p>";
    html += "<p>Stock: " + prod.stock + "</p>";
    html += "<label for='cant-prod'>Cantidad:</label> ";
    html += "<input type='number' id='cant-prod' value='1' min='1' max='" + prod.stock + "'> ";
    html += "<button type='button' class='btn' onclick='agregarConCantidad(" + prod.id + ")'>Anadir al carrito</button>";
    html += "</div>";
    cont.innerHTML = html;
}

function agregarConCantidad(idProducto) {
    var cant = parseInt(document.getElementById("cant-prod").value, 10);
    if (isNaN(cant) || cant < 1) {
        cant = 1;
    }
    agregarAlCarrito(idProducto, cant);
}

function renderizarAdminProductos() {
    var body = document.getElementById("admin-tabla-productos");
    if (!body) {
        return;
    }
    var user = obtenerUsuarioSesion();
    var esVendedor = user && user.rol === "Vendedor";
    var html = "";

    for (var i = 0; i < productosData.length; i++) {
        var p = productosData[i];
        var critico = p.stock <= p.stockCritico;
        html += "<tr" + (critico ? " style='background:#fef3c7;'" : "") + ">";
        html += "<td>" + p.id + "</td><td>" + p.codigo + "</td><td>" + p.nombre + "</td>";
        html += "<td>$" + p.precio.toLocaleString("es-CL") + "</td><td>" + p.stock + "</td><td>" + p.categoria + "</td><td>";
        html += "<a href='admin-mostrar-producto.html?id=" + p.id + "' class='btn btn-secundario'>Ver</a> ";
        if (!esVendedor) {
            html += "<a href='admin-editar-producto.html?id=" + p.id + "' class='btn'>Editar</a>";
        }
        html += "</td></tr>";
    }
    body.innerHTML = html;
}

function renderizarAdminUsuarios() {
    var body = document.getElementById("admin-tabla-usuarios");
    if (!body) {
        return;
    }
    var html = "";
    for (var i = 0; i < usuariosData.length; i++) {
        var u = usuariosData[i];
        html += "<tr>";
        html += "<td>" + u.run + "</td>";
        html += "<td>" + u.nombre + " " + u.apellidos + "</td>";
        html += "<td>" + u.correo + "</td>";
        html += "<td>" + u.rol + "</td>";
        html += "<td>";
        html += "<a href='admin-mostrar-usuario.html?run=" + u.run + "' class='btn btn-secundario'>Ver</a> ";
        html += "<a href='admin-editar-usuario.html?run=" + u.run + "' class='btn'>Editar</a>";
        html += "</td></tr>";
    }
    body.innerHTML = html;
}

function renderizarAdminOrdenes() {
    var body = document.getElementById("admin-tabla-ordenes");
    if (!body) {
        return;
    }
    var html = "";
    for (var i = 0; i < ordenesData.length; i++) {
        var o = ordenesData[i];
        html += "<tr>";
        html += "<td>" + o.id + "</td>";
        html += "<td>" + o.cliente + "</td>";
        html += "<td>" + o.fecha + "</td>";
        html += "<td>$" + o.total.toLocaleString("es-CL") + "</td>";
        html += "<td>" + o.estado + "</td>";
        html += "<td><button type='button' class='btn btn-secundario' onclick='verDetalleOrdenInline(" + o.id + ")'>Ver detalle</button></td>";
        html += "</tr>";
    }
    body.innerHTML = html;
}

function cargarAdminMostrarProducto() {
    var cont = document.getElementById("admin-ficha-producto");
    if (!cont) {
        return;
    }
    var id = parseInt(new URLSearchParams(window.location.search).get("id"), 10);
    var p = buscarProductoPorId(id);
    if (!p) {
        cont.innerHTML = "<p>Producto no encontrado.</p>";
        return;
    }
    cont.innerHTML = "<h2>" + p.nombre + "</h2><p>Codigo: " + p.codigo + "</p><p>Precio: $" + p.precio.toLocaleString("es-CL") + "</p><p>Stock: " + p.stock + "</p><p>" + p.descripcion + "</p>";
}

function cargarAdminEditarProducto() {
    if (!document.getElementById("form-editar-producto")) {
        return;
    }
    var id = parseInt(new URLSearchParams(window.location.search).get("id"), 10);
    var p = buscarProductoPorId(id);
    if (!p) {
        return;
    }
    document.getElementById("prod-codigo").value = p.codigo;
    document.getElementById("prod-nombre").value = p.nombre;
    document.getElementById("prod-descripcion").value = p.descripcion;
    document.getElementById("prod-precio").value = p.precio;
    document.getElementById("prod-stock").value = p.stock;
    document.getElementById("prod-stock-critico").value = p.stockCritico;
    document.getElementById("prod-categoria").value = p.categoria;
    if (document.getElementById("prod-imagen")) {
        document.getElementById("prod-imagen").value = p.imagen;
    }
}

function cargarAdminMostrarUsuario() {
    var cont = document.getElementById("admin-ficha-usuario");
    if (!cont) {
        return;
    }
    var run = new URLSearchParams(window.location.search).get("run");
    var u = null;
    for (var i = 0; i < usuariosData.length; i++) {
        if (usuariosData[i].run === run) {
            u = usuariosData[i];
            break;
        }
    }
    if (!u) {
        cont.innerHTML = "<p>Usuario no encontrado.</p>";
        return;
    }
    cont.innerHTML = "<h2>" + u.nombre + " " + u.apellidos + "</h2><p>RUN: " + u.run + "</p><p>Correo: " + u.correo + "</p><p>Rol: " + u.rol + "</p><p>Direccion: " + u.direccion + "</p>";
}

function cargarAdminEditarUsuario() {
    if (!document.getElementById("form-editar-usuario")) {
        return;
    }
    var run = new URLSearchParams(window.location.search).get("run");
    var u = null;
    for (var i = 0; i < usuariosData.length; i++) {
        if (usuariosData[i].run === run) {
            u = usuariosData[i];
            break;
        }
    }
    if (!u) {
        return;
    }
    document.getElementById("user-run").value = u.run;
    document.getElementById("user-nombre").value = u.nombre;
    document.getElementById("user-apellidos").value = u.apellidos;
    document.getElementById("user-correo").value = u.correo;
    document.getElementById("user-rol").value = u.rol;
    document.getElementById("user-direccion").value = u.direccion;
    document.getElementById("user-fecha").value = u.fechaNac || "";
    cargarRegiones();
    document.getElementById("select-region").value = u.region;
    cargarComunas();
    document.getElementById("select-comuna").value = u.comuna;
}

function verDetalleOrdenInline(idOrden) {
    var cont = document.getElementById("detalle-orden-inline");
    if (!cont) {
        return;
    }
    var orden = null;
    for (var i = 0; i < ordenesData.length; i++) {
        if (ordenesData[i].id === idOrden) {
            orden = ordenesData[i];
            break;
        }
    }
    if (!orden) {
        cont.innerHTML = "<p>Orden no encontrada.</p>";
        cont.style.display = "block";
        return;
    }
    cont.style.display = "block";
    cont.innerHTML = "<h3>Detalle orden #" + orden.id + "</h3><p>Cliente: " + orden.cliente + "</p><p>Fecha: " + orden.fecha + "</p><p>Estado: " + orden.estado + "</p><p>Total: $" + orden.total.toLocaleString("es-CL") + "</p><p>Detalle: " + orden.detalle + "</p>";
}

function mostrarOrdenesParaAdminCompleto() {
    var user = obtenerUsuarioSesion();
    var seccion = document.getElementById("seccion-ordenes-admin");
    if (seccion && user && user.rol === "Administrador") {
        seccion.style.display = "block";
    }
}

var imagenesCarruselInicio = [
    "img/daan-evers-tKN1WXrzQ3s-unsplash.jpg",
    "img/macarena-navarro-ro-7djAkodU-unsplash.jpg",
    "img/louis-hansel-CqVS_klTib4-unsplash.jpg",
    "img/pexels-ephraim-koay-295713650-13253596.jpg"
];

function iniciarCarruselInicio() {
    var img = document.getElementById("carrusel-imagen");
    if (!img) {
        return;
    }
    var indice = 0;

    img.addEventListener("transitionend", function() {
        if (!img.classList.contains("carrusel-desvaneciendo")) {
            return;
        }
        indice = (indice + 1) % imagenesCarruselInicio.length;
        img.src = imagenesCarruselInicio[indice];
        img.classList.remove("carrusel-desvaneciendo");
    });

    setInterval(function() {
        img.classList.add("carrusel-desvaneciendo");
    }, 3000);
}

function iniciarMenuMovil() {
    var btn = document.getElementById("btn-menu-movil");
    var header = document.querySelector("header.navbar");
    if (btn && header) {
        btn.addEventListener("click", function() {
            header.classList.toggle("menu-abierto");
        });
    }
}

function actualizarStatsAdmin() {
    var statProd = document.getElementById("stat-productos");
    var statCrit = document.getElementById("stat-criticos");
    var statUsers = document.getElementById("stat-usuarios");
    if (!statProd) {
        return;
    }
    var criticos = 0;
    for (var i = 0; i < productosData.length; i++) {
        if (productosData[i].stock <= productosData[i].stockCritico) {
            criticos++;
        }
    }
    statProd.textContent = productosData.length;
    statCrit.textContent = criticos;
    statUsers.textContent = usuariosData.length;
}

document.addEventListener("DOMContentLoaded", function() {
    verificarPermisosRol();
    actualizarContador();
    renderizarProductosHome();
    renderizarProductosCatalogo();
    cargarDetalleProducto();
    renderizarTablaCarrito();
    renderizarAdminProductos();
    renderizarAdminUsuarios();
    renderizarAdminOrdenes();
    cargarAdminMostrarProducto();
    cargarAdminEditarProducto();
    cargarAdminMostrarUsuario();
    cargarAdminEditarUsuario();
    mostrarOrdenesParaAdminCompleto();
    actualizarStatsAdmin();

    if (window.location.hash === "#seccion-carrito") {
        var carritoSeccion = document.getElementById("seccion-carrito");
        if (carritoSeccion) {
            carritoSeccion.scrollIntoView();
        }
    }
    if (window.location.hash === "#seccion-ordenes-admin") {
        var ordenSeccion = document.getElementById("seccion-ordenes-admin");
        if (ordenSeccion) {
            ordenSeccion.style.display = "block";
            ordenSeccion.scrollIntoView();
        }
    }
    cargarRegiones();

    var selectRegion = document.getElementById("select-region");
    if (selectRegion) {
        selectRegion.addEventListener("change", cargarComunas);
    }

    var formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", validarLoginForm);
    }
    var formContacto = document.getElementById("form-contacto");
    if (formContacto) {
        formContacto.addEventListener("submit", validarContactoForm);
    }
    var formRegistro = document.getElementById("form-registro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", validarRegistroForm);
    }
    var formProducto = document.getElementById("form-producto");
    if (formProducto) {
        formProducto.addEventListener("submit", validarProductoForm);
    }
    var formEditarProducto = document.getElementById("form-editar-producto");
    if (formEditarProducto) {
        formEditarProducto.addEventListener("submit", validarProductoForm);
    }
    var formUsuarioAdmin = document.getElementById("form-usuario-admin");
    if (formUsuarioAdmin) {
        formUsuarioAdmin.addEventListener("submit", validarUsuarioAdminForm);
    }
    var formEditarUsuario = document.getElementById("form-editar-usuario");
    if (formEditarUsuario) {
        formEditarUsuario.addEventListener("submit", validarUsuarioAdminForm);
    }

    enlazarValidacionTiempoReal();
    iniciarMenuMovil();
    iniciarCarruselInicio();
});
