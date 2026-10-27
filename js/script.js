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

    // Reemplaza el contenido del catálogo por las tarjetas generadas.
    catalogoLibros.innerHTML = libros.map(libro => `
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