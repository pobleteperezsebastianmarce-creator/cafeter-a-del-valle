const productos = [
    {
        
        id: 1,
        nombre: "cafe Colombiano Supremo",
        categoria: "grano",
        origen: "Colombiano",
        precio: 8990,
        descripcion: "Notas Dulces a caramelado y frutos rojos con acidez baalanceada",
        imagen:"img/pexels-gareth-rees-2793957-4353927.jpg"
    
    },
    {

        id: 2,
        nombre: "cafe Etiopia Yirhacheffe",
        categoria: "especialidad",
        origen: "Etiopia",
        precio: 10990,
        descripcion: "Aromas florales con toques citricos a bergamota y cuerpo ligero",
        imagen: "img/pexels-gareth-rees-2793957-4353927.jpg"
    },
    {
        id: 3,
        nombre: "cafe  Brasil Santos Molido",
        categoria: "molido ",
        origen: "Etiopia",
        precio: 7490,
        descripcion: "Perfil achocolatado, baja acidez y crema consistente",
        imagen:"img/pexels-gareth-rees-2793957-4353927.jpg"

    },
    {
        id: 4,
        nombre: "Capsulas Expresso Intenso",
        categoria: "capsula",
        origen: "Blend",
        precio: 6990,
        descripcion: "Caja de 10 Capsulas compatibles, tueste oscuro e intenso",
        imagen:"img/pexels-gareth-rees-2793957-4353927.jpg"

    },
    {
        id: 5,
        nombre: "Cafe Costa Rica Tarrazú",
        categoria: "grano",
        origen: "Costa Rica",
        precio: 9500,
        descripcion: "Tueste medio con notas a manzana verde y miel.",
        imagen:"img/pexels-gareth-rees-2793957-4353927.jpg"

    },
    {
        id: 6,
        nombre: "Cafe descafeinado suave ",
        categoria: "molido",
        origen: "Colombia",
        precio: 7990,
        descripcion: "Proceso al agua natural, todo el sabor sin cafeina .",
        imagen:"img/pexels-gareth-rees-2793957-4353927.jpg"

    }
];

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('grid-productos');
    const inputBuscar = document.getElementById('buscar-producto');
    const selectCategoria = document.getElementById('filtro-categoria');
    const selectOrden = document.getElementById('ordenar-precio');


    function renderizarCatalogo(lista) {
        if (!contenedor) return;
        contenedor.innerHTML='';


        if (lista.length=== 0) {
        contenedor.innerHTML= '<p class="sin-resultados">No se encontraron productos con ese criterio.</p>';
            return;
        }

        lista.forEach(prod => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-cafe';
            tarjeta.innerHTML = `
                <span class="badge-origen">${prod.origen}</span>
                <img src="${prod.imagen}" alt="${prod.nombre}" class="tarjeta-img">
                <div class="tarjeta-body">
                    <h3>${prod.nombre}</h3>
                    <p class="tarjeta-descripcion">${prod.descripcion}</p>
                    <p class="precio">$${prod.precio.toLocaleString('es-CL')}</p>
                    <a href="detalle-producto.html?id=${prod.id}" class="btn">Ver detalle</a>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    function aplicarFiltros(){
        const texto = inputBuscar ? inputBuscar.ariaValueMax.toLowerCase().trim() : '';
        const categoria = selectCategoria ? selectCategoria.value : 'todas';
        const orden = selectOrden ? selectOrden.value : 'defecto';


        let resultado = productos.filter(p =>{
            const coincideTexto = p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto);
            const coincideCat =(categoria ==='todas') || (p.categoria === categoria);
            return coincideTexto && coincideCat;

        });

        if (orden === 'menor-mayor'){
            resultado.sort((a,b) => a.precio - b.precio);
        } else if (orden === 'mayor-menor') {
            resultado.sort((a, b) => b.precio - a.precio);
        }
        renderizarCatalogo(resultado);



    }

    if (inputBuscar) inputBuscar.addEventListener('input', aplicarFiltros);
    if(selectCategoria) selectCategoria.addEventListener('change', aplicarFiltros);
    if(selectCategoria) selectOrden.addEventListener('change', aplicarFiltros);



    renderizarCatalogo(productos);
});
 


    