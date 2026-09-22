// Datos de la tienda - DSY1104

var productosData = [
    { id: 1, codigo: "CAF-001", nombre: "Espresso Doble", descripcion: "Cafe intenso 100% arabica.", precio: 2200, stock: 15, stockCritico: 5, categoria: "Cafes Espreso", imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80" },
    { id: 2, codigo: "CAF-002", nombre: "Cappuccino", descripcion: "Espresso con leche vaporizada.", precio: 2800, stock: 20, stockCritico: 5, categoria: "Cafes con Leche", imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80" },
    { id: 3, codigo: "CAF-003", nombre: "Latte Caramel", descripcion: "Latte con caramelo.", precio: 3100, stock: 4, stockCritico: 5, categoria: "Cafes Especiales", imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80" },
    { id: 4, codigo: "CAF-004", nombre: "Cafe Americano", descripcion: "Espresso con agua caliente.", precio: 2000, stock: 25, stockCritico: 5, categoria: "Cafes Tradicionales", imagen: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80" },
    { id: 5, codigo: "PAS-001", nombre: "Pastel Zanahoria", descripcion: "Pastel artesanal con nueces.", precio: 3200, stock: 8, stockCritico: 3, categoria: "Pasteleria", imagen: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80" },
    { id: 6, codigo: "PAS-002", nombre: "Croissant", descripcion: "Hojaldre con mantequilla.", precio: 1800, stock: 3, stockCritico: 5, categoria: "Pasteleria", imagen: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80" }
];

var regionesYComunas = [
    { region: "Region Metropolitana", comunas: ["Santiago", "Providencia", "Maipu", "Nunoa"] },
    { region: "Region de Valparaiso", comunas: ["Valparaiso", "Vina del Mar", "Quilpue"] },
    { region: "Region del Biobio", comunas: ["Concepcion", "Talcahuano", "Chillan"] }
];

var usuariosData = [
    { run: "19011022K", nombre: "Admin", apellidos: "Sistema", correo: "admin@duoc.cl", rol: "Administrador", region: "Region Metropolitana", comuna: "Santiago", direccion: "Av. Principal 100", fechaNac: "" },
    { run: "182345674", nombre: "Camila", apellidos: "Alumna", correo: "calumna@duoc.cl", rol: "Cliente", region: "Region Metropolitana", comuna: "Providencia", direccion: "Calle Sur 22", fechaNac: "2000-05-10" },
    { run: "178901235", nombre: "Rodrigo", apellidos: "Vendedor", correo: "vendedor@duoc.cl", rol: "Vendedor", region: "Region de Valparaiso", comuna: "Vina del Mar", direccion: "Pasaje Norte 5", fechaNac: "" },
    { run: "156789012", nombre: "Profesor", apellidos: "Evaluador", correo: "profesor@profesor.duoc.cl", rol: "Cliente", region: "Region del Biobio", comuna: "Concepcion", direccion: "Camino Duoc 300", fechaNac: "1985-01-20" }
];

var ordenesData = [
    { id: 101, cliente: "Camila Alumna", fecha: "2026-09-01", total: 5000, estado: "Pagada", detalle: "Espresso Doble x1, Croissant x1" },
    { id: 102, cliente: "Juan Perez", fecha: "2026-09-05", total: 3100, estado: "Pendiente", detalle: "Latte Caramel x1" }
];

function cargarDatosGuardados() {
    var prod = localStorage.getItem("cafeteria_productos");
    if (prod) {
        productosData = JSON.parse(prod);
    }
    var users = localStorage.getItem("cafeteria_usuarios");
    if (users) {
        usuariosData = JSON.parse(users);
    }
    var ordenes = localStorage.getItem("cafeteria_ordenes");
    if (ordenes) {
        ordenesData = JSON.parse(ordenes);
    }
}

function guardarProductos() {
    localStorage.setItem("cafeteria_productos", JSON.stringify(productosData));
}

function guardarUsuarios() {
    localStorage.setItem("cafeteria_usuarios", JSON.stringify(usuariosData));
}

function guardarOrdenes() {
    localStorage.setItem("cafeteria_ordenes", JSON.stringify(ordenesData));
}

function obtenerSiguienteIdProducto() {
    var max = 0;
    for (var i = 0; i < productosData.length; i++) {
        if (productosData[i].id > max) {
            max = productosData[i].id;
        }
    }
    return max + 1;
}

function buscarProductoPorId(id) {
    for (var i = 0; i < productosData.length; i++) {
        if (productosData[i].id === id) {
            return productosData[i];
        }
    }
    return null;
}

function cargarRegiones() {
    var selectRegion = document.getElementById("select-region");
    if (!selectRegion) {
        return;
    }
    selectRegion.innerHTML = '<option value="">-- Seleccione Region --</option>';
    for (var i = 0; i < regionesYComunas.length; i++) {
        var opcion = document.createElement("option");
        opcion.value = regionesYComunas[i].region;
        opcion.textContent = regionesYComunas[i].region;
        selectRegion.appendChild(opcion);
    }
}

function cargarComunas() {
    var selectRegion = document.getElementById("select-region");
    var selectComuna = document.getElementById("select-comuna");
    if (!selectRegion || !selectComuna) {
        return;
    }
    var regionSeleccionada = selectRegion.value;
    selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
    if (regionSeleccionada === "") {
        selectComuna.disabled = true;
        return;
    }
    for (var i = 0; i < regionesYComunas.length; i++) {
        if (regionesYComunas[i].region === regionSeleccionada) {
            var lista = regionesYComunas[i].comunas;
            for (var j = 0; j < lista.length; j++) {
                var op = document.createElement("option");
                op.value = lista[j];
                op.textContent = lista[j];
                selectComuna.appendChild(op);
            }
            selectComuna.disabled = false;
            break;
        }
    }
}

function aplicarImagenesCatalogoActualizadas() {
    var urlsPorCodigo = {
        "CAF-001": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80",
        "CAF-002": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80",
        "CAF-003": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
        "CAF-004": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        "PAS-001": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80",
        "PAS-002": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80"
    };
    for (var i = 0; i < productosData.length; i++) {
        var codigo = productosData[i].codigo;
        if (urlsPorCodigo[codigo]) {
            productosData[i].imagen = urlsPorCodigo[codigo];
        }
    }
}

cargarDatosGuardados();
aplicarImagenesCatalogoActualizadas();
