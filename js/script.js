// Array que contiene los datos de todos los libros de la biblioteca.
const librosIniciales = [
    {
        id: 1,
        titulo: "La bella y la bestia",
        autor: "Liz Braswell",
        genero: "Fantasía",
        portada: "img/portadas/la-bella-y-la-bestia.webp",
        valoracion: 4.5,
        leido: false,
        favorito: false
    },
    {
        id: 2,
        titulo: "Apocalypse",
        autor: "Tim Bowler",
        genero: "Terror",
        portada: "img/portadas/apocalypse.webp",
        valoracion: 4.5,
        leido: false,
        favorito: false
    }
];

// Seleccionamos los elementos del HTML que JavaScript necesita actualizar.
const totalLibros = document.querySelector("#total-libros");
const totalLeidos = document.querySelector("#total-leidos");
const totalFavoritos = document.querySelector("#total-favoritos");
const totalPendientes = document.querySelector("#total-pendientes");
const catalogoLibros = document.querySelector(".catalogo-libros");
const librosGuardados = localStorage.getItem("biblioteca-libros");

// Utiliza los libros guardados o, si aún no existen, los iniciales.
const libros = librosGuardados
    ? JSON.parse(librosGuardados)
    : librosIniciales;

// Guarda el filtro de estado que está seleccionado actualmente.
// "todos" significa que se muestran todos los libros.
let filtroEstadoActivo = "todos";

// Guarda el género seleccionado actualmente.
// "todos" significa que no se aplica ningún filtro por género.
let filtroGeneroActivo = "todos";

// Guarda el array completo de libros en el almacenamiento del navegador.
function guardarLibros() {
    localStorage.setItem("biblioteca-libros", JSON.stringify(libros));
}

// Actualiza los contadores del encabezado según los estados de los libros.
function actualizarEstadisticas() {

    // El total corresponde al número de libros del array.
    totalLibros.textContent = libros.length;

    // Cuenta únicamente los libros marcados como leídos.
    const cantidadLeidos = libros.filter(libro => libro.leido).length;

    // Cuenta únicamente los libros marcados como favoritos.
    const cantidadFavoritos = libros.filter(libro => libro.favorito).length;

    // Los libros pendientes son aquellos que todavía no se han leído.
    const cantidadPendientes = libros.filter(libro => !libro.leido).length;

    // Mostramos los resultados en sus respectivos elementos del HTML.
    totalLeidos.textContent = cantidadLeidos;
    totalFavoritos.textContent = cantidadFavoritos;
    totalPendientes.textContent = cantidadPendientes;
}


// Genera las tarjetas de los libros a partir de los datos del array.
function mostrarLibros() {

    // Selecciona los libros que coinciden con los filtros activos.
    const librosFiltrados = libros.filter(libro => {

        // Comprueba si el libro coincide con el estado seleccionado.
        let coincideEstado = true;

        // Si el filtro es "leido", comprueba que el libro esté leído.
        if (filtroEstadoActivo === "leido") {
            coincideEstado = libro.leido;
        }

        // Si el filtro es "favorito", comprueba que sea favorito.
        else if (filtroEstadoActivo === "favorito") {
            coincideEstado = libro.favorito;
        }

        // Si el filtro es "pendiente", comprueba que no esté leído.
        else if (filtroEstadoActivo === "pendiente") {
            coincideEstado = !libro.leido;
        }

        // Comprueba si el libro coincide con el género seleccionado.
        const coincideGenero =
            filtroGeneroActivo === "todos" ||
            libro.genero === filtroGeneroActivo;

        // El libro debe cumplir tanto el filtro de estado como el de género.
        return coincideEstado && coincideGenero;
    });

    // Muestra un mensaje si ningún libro coincide con el filtro.
    if (librosFiltrados.length === 0) {
        catalogoLibros.innerHTML =
            '<p class="mensaje-vacio">No hay libros que mostrar con este filtro.</p>';
        return;
    }

    // Genera las tarjetas de los libros filtrados y las muestra en el catálogo.
    catalogoLibros.innerHTML = librosFiltrados.map(libro => `
        <article class="libro">

            <div class="portada-libro">
                <img
                    src="${libro.portada}"
                    alt="Portada de ${libro.titulo}"
                >

                <button
                    class="estado-libro ${libro.leido ? "activo" : ""}"
                    type="button"
                    data-id="${libro.id}"
                    data-accion="leido"
                    aria-pressed="${libro.leido}"
                >✓ Leído</button>

                <button
                    class="favorito-libro ${libro.favorito ? "activo" : ""}"
                    type="button"
                    data-id="${libro.id}"
                    data-accion="favorito"
                    aria-label="${libro.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}"
                    aria-pressed="${libro.favorito}"
                >${libro.favorito ? "♥" : "♡"}</button>
            </div>

            <h3>${libro.titulo}</h3>
            <p>${libro.autor}</p>
            <p>${libro.genero}</p>
            <p>★★★★★ ${libro.valoracion.toLocaleString("es-ES")}</p>

        </article>
    `).join("");
}

// Mostramos las tarjetas y actualizamos las estadísticas al abrir la página.
mostrarLibros();
actualizarEstadisticas();

// Gestiona los clics en los botones de lectura y favoritos del catálogo.
catalogoLibros.addEventListener("click", (evento) => {
    // Identifica si el clic procede de un botón que realiza alguna acción.
    const boton = evento.target.closest("button[data-accion]");
    // Si el clic no procede de uno de esos botones, no hacemos nada.
    if (!boton) return;

    // Obtenemos el identificador del libro y el tipo de acción solicitada.
    const idLibro = Number(boton.dataset.id);
    const accion = boton.dataset.accion;
    
    // Buscamos en el array el libro al que pertenece el botón pulsado.
    const libro = libros.find(libro => libro.id === idLibro);

    // Si no encontramos el libro, detenemos la operación
    if (!libro) return;

    //Invierte el estados de lectura/favorito del libro
    if (accion === "leido") {
        libro.leido = !libro.leido;
    }

    if (accion === "favorito") {
        libro.favorito = !libro.favorito;
    }

    // Guarda los cambios de lectura y favoritos en el navegador.
    guardarLibros();

    // Volvemos a generar las tarjetas para reflejar los cambios visuales.
    mostrarLibros();

    // Recalculamos los contadores con los nuevos estados.
    actualizarEstadisticas();
});

// Actualiza el aspecto y la accesibilidad de los botones de filtro.
function actualizarBotonesFiltroEstado() {

    // Recorre los botones de estado del encabezado.
    document.querySelectorAll("[data-filtro-estado]").forEach(boton => {

        // Comprueba si este botón corresponde al filtro seleccionado.
        const estaActivo = boton.dataset.filtroEstado === filtroEstadoActivo;

        // Aplica o elimina la clase visual del filtro activo.
        boton.classList.toggle("activo", estaActivo);

        // Indica si el botón está seleccionado.
        boton.setAttribute("aria-pressed", estaActivo);
    });
}

// Gestiona los clics en los filtros de estado del encabezado.
document.querySelector(".estadisticas").addEventListener("click", (evento) => {

    // Identifica el botón de filtro que se ha pulsado.
    const boton = evento.target.closest("button[data-filtro-estado]");

    // Ignora los clics que no procedan de un filtro.
    if (!boton) return;

    // Obtiene el tipo de filtro seleccionado.
    const filtroSeleccionado = boton.dataset.filtroEstado;

    // Si ya estaba activo, vuelve a mostrar todos los libros.
    // Si era otro filtro, lo convierte en el filtro activo.
    filtroEstadoActivo = filtroEstadoActivo === filtroSeleccionado
        ? "todos"
        : filtroSeleccionado;

    // Actualiza el aspecto visual de los botones.
    actualizarBotonesFiltroEstado();

    // Actualiza el catálogo según el filtro elegido.
    mostrarLibros();
});

// Inicializa el aspecto de los filtros al abrir la página.
actualizarBotonesFiltroEstado();

// Actualiza el aspecto de los botones de género.
function actualizarBotonesFiltroGenero() {

    // Recorre todos los botones que permiten filtrar por género.
    document.querySelectorAll("[data-filtro-genero]").forEach(boton => {

        // Comprueba si el género del botón coincide con el filtro activo.
        const estaActivo =
            boton.dataset.filtroGenero === filtroGeneroActivo;

        // Añade o quita la clase visual del botón seleccionado.
        boton.classList.toggle("activo", estaActivo);

        // Actualiza el estado accesible del botón.
        boton.setAttribute("aria-pressed", estaActivo);
    });
}


// Gestiona los clics en los filtros de género.
document.querySelector("#filtros").addEventListener("click", (evento) => {

    // Identifica si se ha pulsado un botón de género.
    const boton = evento.target.closest("button[data-filtro-genero]");

    // Si el clic no procede de un botón de género, no hacemos nada.
    if (!boton) return;

    // Obtiene el género correspondiente al botón pulsado.
    const generoSeleccionado = boton.dataset.filtroGenero;

    // Si seleccionamos "Todos", quitamos el filtro de género.
    if (generoSeleccionado === "todos") {
        filtroGeneroActivo = "todos";
    }

    // Si volvemos a pulsar el género activo, lo desactivamos.
    else if (filtroGeneroActivo === generoSeleccionado) {
        filtroGeneroActivo = "todos";
    }

    // Si elegimos otro género, lo convertimos en el filtro activo.
    else {
        filtroGeneroActivo = generoSeleccionado;
    }

    // Actualiza el aspecto de los botones de género.
    actualizarBotonesFiltroGenero();

    // Muestra los libros que cumplen los filtros seleccionados.
    mostrarLibros();
});

// Inicializa el aspecto de los botones de género al abrir la página.
actualizarBotonesFiltroGenero();