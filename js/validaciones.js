// Validaciones de formularios - DSY1104

function mostrarError(idCampo, mensaje) {
    var span = document.getElementById("error-" + idCampo);
    if (span) {
        span.textContent = mensaje;
    }
}

function limpiarErrores() {
    var spans = document.querySelectorAll(".error-msg");
    for (var i = 0; i < spans.length; i++) {
        spans[i].textContent = "";
    }
}

function validarCorreo(correo, esObligatorio) {
    var limpio = correo.trim().toLowerCase();
    if (limpio === "") {
        if (esObligatorio) {
            return "El correo es obligatorio.";
        }
        return "";
    }
    if (limpio.length > 100) {
        return "El correo no puede superar 100 caracteres.";
    }
    var ok = limpio.endsWith("@duoc.cl") || limpio.endsWith("@profesor.duoc.cl") || limpio.endsWith("@gmail.com");
    if (!ok) {
        return "Use @duoc.cl, @profesor.duoc.cl o @gmail.com";
    }
    return "";
}

function validarRun(run) {
    var limpio = run.trim().toUpperCase();
    if (limpio === "") {
        return "El RUN es obligatorio.";
    }
    if (limpio.length < 7 || limpio.length > 9) {
        return "RUN entre 7 y 9 caracteres, sin puntos ni guion.";
    }
    var cuerpo = limpio.substring(0, limpio.length - 1);
    var dv = limpio.charAt(limpio.length - 1);
    for (var i = 0; i < cuerpo.length; i++) {
        if (cuerpo.charAt(i) < "0" || cuerpo.charAt(i) > "9") {
            return "El cuerpo del RUN solo tiene numeros.";
        }
    }
    var suma = 0;
    var mult = 2;
    for (var j = cuerpo.length - 1; j >= 0; j--) {
        suma = suma + (parseInt(cuerpo.charAt(j), 10) * mult);
        mult = mult + 1;
        if (mult > 7) {
            mult = 2;
        }
    }
    var resto = 11 - (suma % 11);
    var dvEsperado = "0";
    if (resto === 11) {
        dvEsperado = "0";
    } else if (resto === 10) {
        dvEsperado = "K";
    } else {
        dvEsperado = String(resto);
    }
    if (dv !== dvEsperado) {
        return "RUN invalido (digito verificador incorrecto).";
    }
    return "";
}

function validarPassword(pass, esObligatorio) {
    if (pass.trim() === "") {
        if (esObligatorio) {
            return "La contraseña es obligatoria.";
        }
        return "";
    }
    if (pass.length < 4 || pass.length > 10) {
        return "La contraseña debe tener entre 4 y 10 caracteres.";
    }
    return "";
}

function validarCampoProducto(campoId) {
    var codigo = document.getElementById("prod-codigo");
    var nombre = document.getElementById("prod-nombre");
    var desc = document.getElementById("prod-descripcion");
    var precio = document.getElementById("prod-precio");
    var stock = document.getElementById("prod-stock");
    var stockCritico = document.getElementById("prod-stock-critico");
    var categoria = document.getElementById("prod-categoria");
    var alerta = document.getElementById("alerta-stock-critico");

    if (campoId === "prod-codigo" && codigo) {
        if (codigo.value.trim() === "") {
            mostrarError("prod-codigo", "El codigo es obligatorio.");
        } else if (codigo.value.trim().length < 3) {
            mostrarError("prod-codigo", "Minimo 3 caracteres.");
        } else {
            mostrarError("prod-codigo", "");
        }
    }

    if (campoId === "prod-nombre" && nombre) {
        if (nombre.value.trim() === "") {
            mostrarError("prod-nombre", "El nombre es obligatorio.");
        } else if (nombre.value.trim().length > 100) {
            mostrarError("prod-nombre", "Maximo 100 caracteres.");
        } else {
            mostrarError("prod-nombre", "");
        }
    }

    if (campoId === "prod-descripcion" && desc) {
        if (desc.value.trim().length > 500) {
            mostrarError("prod-descripcion", "Maximo 500 caracteres.");
        } else {
            mostrarError("prod-descripcion", "");
        }
    }

    if (campoId === "prod-precio" && precio) {
        var precioNum = parseFloat(precio.value);
        if (isNaN(precioNum) || precioNum < 0) {
            mostrarError("prod-precio", "Precio valido mayor o igual a 0.");
        } else {
            mostrarError("prod-precio", "");
        }
    }

    if (campoId === "prod-stock" && stock) {
        var stockNum = Number(stock.value);
        if (stock.value.trim() === "" || isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
            mostrarError("prod-stock", "Stock entero mayor o igual a 0.");
        } else {
            mostrarError("prod-stock", "");
        }
    }

    if (campoId === "prod-stock-critico" && stockCritico) {
        if (stockCritico.value.trim() !== "") {
            var crit = Number(stockCritico.value);
            if (isNaN(crit) || crit < 0 || !Number.isInteger(crit)) {
                mostrarError("prod-stock-critico", "Stock critico entero mayor o igual a 0.");
            } else {
                mostrarError("prod-stock-critico", "");
            }
        } else {
            mostrarError("prod-stock-critico", "");
        }
    }

    if (campoId === "prod-categoria" && categoria) {
        if (categoria.value === "") {
            mostrarError("prod-categoria", "Seleccione categoria.");
        } else {
            mostrarError("prod-categoria", "");
        }
    }

    if ((campoId === "prod-stock" || campoId === "prod-stock-critico") && alerta && stock && stockCritico) {
        var s = Number(stock.value);
        var c = stockCritico.value.trim() === "" ? 0 : Number(stockCritico.value);
        if (!isNaN(s) && !isNaN(c) && s <= c) {
            alerta.style.display = "block";
            alerta.textContent = "Alerta: stock actual (" + s + ") es menor o igual al stock critico (" + c + ").";
        } else {
            alerta.style.display = "none";
        }
    }
}

function validarCampoUsuario(campoId, esAdmin, esNuevo) {
    var prefijo = "reg-";
    if (campoId.indexOf("user-") === 0) {
        prefijo = "user-";
    }

    if (campoId === "reg-run" || campoId === "user-run") {
        mostrarError(campoId, validarRun(document.getElementById(campoId).value));
    }
    if (campoId === "reg-correo" || campoId === "user-correo") {
        mostrarError(campoId, validarCorreo(document.getElementById(campoId).value, true));
    }
    if (campoId === "reg-password" || campoId === "user-password") {
        mostrarError(campoId, validarPassword(document.getElementById(campoId).value, esNuevo));
    }
    if (campoId === "reg-nombre" || campoId === "user-nombre") {
        var n = document.getElementById(campoId).value.trim();
        if (n === "") {
            mostrarError(campoId, "El nombre es obligatorio.");
        } else if (n.length > 50) {
            mostrarError(campoId, "Maximo 50 caracteres.");
        } else {
            mostrarError(campoId, "");
        }
    }
    if (campoId === "reg-apellidos" || campoId === "user-apellidos") {
        var a = document.getElementById(campoId).value.trim();
        if (a === "") {
            mostrarError(campoId, "Los apellidos son obligatorios.");
        } else if (a.length > 100) {
            mostrarError(campoId, "Maximo 100 caracteres.");
        } else {
            mostrarError(campoId, "");
        }
    }
    if (campoId === "reg-direccion" || campoId === "user-direccion") {
        var d = document.getElementById(campoId).value.trim();
        if (d === "") {
            mostrarError(campoId, "La direccion es obligatoria.");
        } else if (d.length > 300) {
            mostrarError(campoId, "Maximo 300 caracteres.");
        } else {
            mostrarError(campoId, "");
        }
    }
    if (campoId === "select-region") {
        if (document.getElementById("select-region").value === "") {
            mostrarError("select-region", "Seleccione region.");
        } else {
            mostrarError("select-region", "");
        }
    }
    if (campoId === "select-comuna") {
        if (document.getElementById("select-comuna").value === "") {
            mostrarError("select-comuna", "Seleccione comuna.");
        } else {
            mostrarError("select-comuna", "");
        }
    }
    if (esAdmin && campoId === "user-rol") {
        if (document.getElementById("user-rol").value === "") {
            mostrarError("user-rol", "Seleccione un rol.");
        } else {
            mostrarError("user-rol", "");
        }
    }
}

function validarCamposUsuario(esAdmin, esNuevo) {
    var valido = true;
    var run = document.getElementById("user-run") || document.getElementById("reg-run");
    var prefijo = run.id.indexOf("reg-") === 0 ? "reg-" : "user-";

    var campos = [prefijo + "run", prefijo + "nombre", prefijo + "apellidos", prefijo + "correo", prefijo + "password", prefijo + "direccion", "select-region", "select-comuna"];
    if (esAdmin) {
        campos.push("user-rol");
    }

    for (var i = 0; i < campos.length; i++) {
        validarCampoUsuario(campos[i], esAdmin, esNuevo);
        var errId = campos[i];
        var span = document.getElementById("error-" + errId);
        if (span && span.textContent !== "") {
            valido = false;
        }
    }
    return valido;
}

function validarLoginForm(event) {
    limpiarErrores();
    var valido = true;
    var correo = document.getElementById("login-correo");
    var pass = document.getElementById("login-password");

    var errCorreo = validarCorreo(correo.value, true);
    if (errCorreo !== "") {
        mostrarError("login-correo", errCorreo);
        valido = false;
    }
    var errPass = validarPassword(pass.value, true);
    if (errPass !== "") {
        mostrarError("login-password", errPass);
        valido = false;
    }

    if (!valido) {
        event.preventDefault();
        return false;
    }

    event.preventDefault();
    var c = correo.value.trim().toLowerCase();
    var p = pass.value;
    var usuario = null;

    if (c === "admin@duoc.cl" && p === "admin1") {
        usuario = { correo: c, nombre: "Administrador", rol: "Administrador" };
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        window.location.href = "admin-home.html";
        return false;
    }
    if (c === "vendedor@duoc.cl" && p === "vend1") {
        usuario = { correo: c, nombre: "Vendedor", rol: "Vendedor" };
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        window.location.href = "admin-productos.html";
        return false;
    }
    if (c === "cliente@gmail.com" && p === "cli1") {
        usuario = { correo: c, nombre: "Cliente", rol: "Cliente" };
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        window.location.href = "index.html";
        return false;
    }

    usuario = { correo: c, nombre: "Cliente Web", rol: "Cliente" };
    sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    window.location.href = "index.html";
    return false;
}

function rellenarDemo(tipo) {
    var correo = document.getElementById("login-correo");
    var pass = document.getElementById("login-password");
    if (tipo === "admin") {
        correo.value = "admin@duoc.cl";
        pass.value = "admin1";
    } else if (tipo === "vendedor") {
        correo.value = "vendedor@duoc.cl";
        pass.value = "vend1";
    } else {
        correo.value = "cliente@gmail.com";
        pass.value = "cli1";
    }
    limpiarErrores();
}

function validarContactoForm(event) {
    limpiarErrores();
    var valido = true;
    var nombre = document.getElementById("contacto-nombre");
    var correo = document.getElementById("contacto-correo");
    var msg = document.getElementById("contacto-mensaje");

    if (nombre.value.trim() === "") {
        mostrarError("contacto-nombre", "El nombre es obligatorio.");
        valido = false;
    } else if (nombre.value.trim().length > 100) {
        mostrarError("contacto-nombre", "Maximo 100 caracteres.");
        valido = false;
    }

    var errCorreo = validarCorreo(correo.value, false);
    if (errCorreo !== "") {
        mostrarError("contacto-correo", errCorreo);
        valido = false;
    }

    if (msg.value.trim() === "") {
        mostrarError("contacto-mensaje", "El comentario es obligatorio.");
        valido = false;
    } else if (msg.value.trim().length > 500) {
        mostrarError("contacto-mensaje", "Maximo 500 caracteres.");
        valido = false;
    }

    if (!valido) {
        event.preventDefault();
        return false;
    }

    event.preventDefault();
    alert("Mensaje enviado correctamente.");
    document.getElementById("form-contacto").reset();
    return false;
}

function validarRegistroForm(event) {
    limpiarErrores();
    if (!validarCamposUsuario(false, true)) {
        event.preventDefault();
        return false;
    }
    event.preventDefault();

    var nuevo = {
        run: document.getElementById("reg-run").value.trim().toUpperCase(),
        nombre: document.getElementById("reg-nombre").value.trim(),
        apellidos: document.getElementById("reg-apellidos").value.trim(),
        correo: document.getElementById("reg-correo").value.trim().toLowerCase(),
        rol: "Cliente",
        region: document.getElementById("select-region").value,
        comuna: document.getElementById("select-comuna").value,
        direccion: document.getElementById("reg-direccion").value.trim(),
        fechaNac: document.getElementById("reg-fecha").value
    };

    usuariosData.push(nuevo);
    guardarUsuarios();
    alert("Registro exitoso. Ahora puede iniciar sesion.");
    window.location.href = "login.html";
    return false;
}

function validarProductoForm(event) {
    limpiarErrores();
    var ids = ["prod-codigo", "prod-nombre", "prod-descripcion", "prod-precio", "prod-stock", "prod-stock-critico", "prod-categoria"];
    for (var k = 0; k < ids.length; k++) {
        validarCampoProducto(ids[k]);
    }

    var valido = true;
    for (var j = 0; j < ids.length; j++) {
        var span = document.getElementById("error-" + ids[j]);
        if (span && span.textContent !== "") {
            valido = false;
        }
    }

    if (!valido) {
        event.preventDefault();
        return false;
    }

    var codigo = document.getElementById("prod-codigo");
    var nombre = document.getElementById("prod-nombre");
    var desc = document.getElementById("prod-descripcion");
    var precio = document.getElementById("prod-precio");
    var stock = document.getElementById("prod-stock");
    var stockCritico = document.getElementById("prod-stock-critico");
    var categoria = document.getElementById("prod-categoria");
    var alerta = document.getElementById("alerta-stock-critico");

    var precioNum = parseFloat(precio.value);
    var stockNum = Number(stock.value);
    var criticoNum = stockCritico.value.trim() === "" ? 0 : Number(stockCritico.value);

    if (alerta && stockNum <= criticoNum) {
        alerta.style.display = "block";
        alerta.textContent = "Alerta: stock actual (" + stockNum + ") es menor o igual al stock critico (" + criticoNum + ").";
    }

    event.preventDefault();
    var imagen = document.getElementById("prod-imagen");
    var rutaImagen = "img/macarena-navarro-ro-7djAkodU-unsplash.jpg";
    if (imagen && imagen.value.trim() !== "") {
        rutaImagen = imagen.value.trim();
    }

    var params = new URLSearchParams(window.location.search);
    var idEdit = parseInt(params.get("id"), 10);

    if (event.target.id === "form-editar-producto" && !isNaN(idEdit)) {
        for (var i = 0; i < productosData.length; i++) {
            if (productosData[i].id === idEdit) {
                productosData[i].codigo = codigo.value.trim();
                productosData[i].nombre = nombre.value.trim();
                productosData[i].descripcion = desc.value.trim();
                productosData[i].precio = precioNum;
                productosData[i].stock = stockNum;
                productosData[i].stockCritico = criticoNum;
                productosData[i].categoria = categoria.value;
                productosData[i].imagen = rutaImagen;
                break;
            }
        }
    } else {
        productosData.push({
            id: obtenerSiguienteIdProducto(),
            codigo: codigo.value.trim(),
            nombre: nombre.value.trim(),
            descripcion: desc.value.trim(),
            precio: precioNum,
            stock: stockNum,
            stockCritico: criticoNum,
            categoria: categoria.value,
            imagen: rutaImagen
        });
    }

    guardarProductos();
    alert("Producto guardado.");
    window.location.href = "admin-productos.html";
    return false;
}

function validarUsuarioAdminForm(event) {
    limpiarErrores();
    var esNuevo = event.target.id === "form-usuario-admin";
    if (!validarCamposUsuario(true, esNuevo)) {
        event.preventDefault();
        return false;
    }

    event.preventDefault();
    var runVal = document.getElementById("user-run").value.trim().toUpperCase();
    var nuevo = {
        run: runVal,
        nombre: document.getElementById("user-nombre").value.trim(),
        apellidos: document.getElementById("user-apellidos").value.trim(),
        correo: document.getElementById("user-correo").value.trim().toLowerCase(),
        rol: document.getElementById("user-rol").value,
        region: document.getElementById("select-region").value,
        comuna: document.getElementById("select-comuna").value,
        direccion: document.getElementById("user-direccion").value.trim(),
        fechaNac: document.getElementById("user-fecha").value
    };

    var existe = false;
    for (var i = 0; i < usuariosData.length; i++) {
        if (usuariosData[i].run === runVal) {
            usuariosData[i] = nuevo;
            existe = true;
            break;
        }
    }
    if (!existe) {
        usuariosData.push(nuevo);
    }

    guardarUsuarios();
    alert("Usuario guardado.");
    window.location.href = "admin-usuarios.html";
    return false;
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
}

function validarCampoEnTiempoReal(campo) {
    var form = campo.form;
    if (!form) {
        return;
    }

    if (form.id === "form-login") {
        if (campo.id === "login-correo") {
            mostrarError("login-correo", validarCorreo(campo.value, true));
        }
        if (campo.id === "login-password") {
            mostrarError("login-password", validarPassword(campo.value, true));
        }
    }

    if (form.id === "form-contacto") {
        if (campo.id === "contacto-nombre") {
            if (campo.value.trim() === "") {
                mostrarError("contacto-nombre", "El nombre es obligatorio.");
            } else if (campo.value.trim().length > 100) {
                mostrarError("contacto-nombre", "Maximo 100 caracteres.");
            } else {
                mostrarError("contacto-nombre", "");
            }
        }
        if (campo.id === "contacto-correo") {
            mostrarError("contacto-correo", validarCorreo(campo.value, false));
        }
        if (campo.id === "contacto-mensaje") {
            if (campo.value.trim() === "") {
                mostrarError("contacto-mensaje", "El comentario es obligatorio.");
            } else if (campo.value.trim().length > 500) {
                mostrarError("contacto-mensaje", "Maximo 500 caracteres.");
            } else {
                mostrarError("contacto-mensaje", "");
            }
        }
    }

    if (form.id === "form-registro") {
        validarCampoUsuario(campo.id, false, true);
    }

    if (form.id === "form-usuario-admin") {
        validarCampoUsuario(campo.id, true, true);
    }

    if (form.id === "form-editar-usuario") {
        validarCampoUsuario(campo.id, true, false);
    }

    if (form.id === "form-producto" || form.id === "form-editar-producto") {
        validarCampoProducto(campo.id);
    }
}

function enlazarValidacionTiempoReal() {
    var campos = document.querySelectorAll("input, select, textarea");
    for (var i = 0; i < campos.length; i++) {
        campos[i].addEventListener("blur", function() {
            validarCampoEnTiempoReal(this);
        });
        campos[i].addEventListener("input", function() {
            validarCampoEnTiempoReal(this);
        });
    }
}
