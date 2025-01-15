document.addEventListener("DOMContentLoaded", () => {
    cargarDatosDesdeJSON();
    configurarEventos();
});

let dataGlobal = {};
let familiarCounter = 1;

function cargarDatosDesdeJSON() {
    fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            dataGlobal = data;
            cargarOpciones("lenguaMaternaAlumno", data.lenguas);
            cargarOpciones("idiomasAlumno", data.idiomas);
            cargarOpciones("profesionFamiliar-1", data.profesiones);
            cargarOpciones("lenguaMaternaFamiliar-1", data.lenguas);
            cargarOpciones("idiomasFamiliar-1", data.idiomas);
            cargarOpciones("nivelEstudios", data.niveles);
            cargarOpciones("idiomasEstudiados", data.idiomas);
            cargarOpciones("nivelEstudioSolicitado", data.niveles);
            cargarOpciones("alergias", data.alergias);
            cargarCiudadesNacimiento("ciudadNacimientoFamiliar-1", data.paises);
            cargarPaises(data.paises);
        })
        .catch(error => console.error("Error al cargar JSON:", error));
}

function cargarOpciones(id, opciones) {
    const select = document.getElementById(id);
    select.innerHTML = "<option value='' disabled selected>Seleccione una opción</option>";
    opciones.forEach(opcion => {
        const opt = document.createElement("option");
        opt.value = opcion;
        opt.textContent = opcion;
        select.appendChild(opt);
    });
}

function cargarCiudadesNacimiento(id, paises) {
    const select = document.getElementById(id);
    select.innerHTML = "<option value='' disabled selected>Seleccione una ciudad</option>";
    Object.keys(paises).forEach(pais => {
        Object.keys(paises[pais]).forEach(ciudad => {
            const opt = document.createElement("option");
            opt.value = ciudad;
            opt.textContent = ciudad;
            select.appendChild(opt);
        });
    });
}

function cargarPaises(paises) {
    const paisSelect = document.getElementById("pais");
    paisSelect.innerHTML = "<option value='' disabled selected>Seleccione un país</option>";
    Object.keys(paises).forEach(pais => {
        const opt = document.createElement("option");
        opt.value = pais;
        opt.textContent = pais;
        paisSelect.appendChild(opt);
    });

    paisSelect.addEventListener("change", () => {
        cargarCiudades(paises, paisSelect.value);
    });
}

function cargarCiudades(paises, paisSeleccionado) {
    const ciudadSelect = document.getElementById("ciudad");
    ciudadSelect.innerHTML = "<option value='' disabled selected>Seleccione una ciudad</option>";
    if (paises[paisSeleccionado]) {
        Object.keys(paises[paisSeleccionado]).forEach(ciudad => {
            const opt = document.createElement("option");
            opt.value = ciudad;
            opt.textContent = ciudad;
            ciudadSelect.appendChild(opt);
        });

        ciudadSelect.addEventListener("change", () => {
            cargarPoblaciones(paises[paisSeleccionado], ciudadSelect.value);
        });
    }
}

function cargarPoblaciones(ciudades, ciudadSeleccionada) {
    const poblacionSelect = document.getElementById("poblacion");
    poblacionSelect.innerHTML = "<option value='' disabled selected>Seleccione una población</option>";
    if (ciudades[ciudadSeleccionada]) {
        ciudades[ciudadSeleccionada].forEach(poblacion => {
            const opt = document.createElement("option");
            opt.value = poblacion;
            opt.textContent = poblacion;
            poblacionSelect.appendChild(opt);
        });
    }
}

function configurarEventos() {
    document.getElementById("registroAlumno").addEventListener("submit", validarFormulario);
    document.getElementById("addFamiliar").addEventListener("click", agregarFamiliar);
    document.getElementById("cerrarResumen").addEventListener("click", () => {
        document.getElementById("modalResumen").style.display = "none";
    });
}

function agregarFamiliar() {
    familiarCounter++;
    const familiarContainer = document.getElementById("familiarContainer");

    const familiarHTML = `
        <fieldset>
            <legend>Familiar ${familiarCounter}</legend>
            <label for="nombreFamiliar-${familiarCounter}">Nombre:</label>
            <input type="text" id="nombreFamiliar-${familiarCounter}" required>

            <label for="apellidosFamiliar-${familiarCounter}">Apellidos:</label>
            <input type="text" id="apellidosFamiliar-${familiarCounter}" required>

            <label for="nifFamiliar-${familiarCounter}">NIF:</label>
            <input type="text" id="nifFamiliar-${familiarCounter}" pattern="[0-9]{8}[A-Za-z]" required>

            <label for="profesionFamiliar-${familiarCounter}">Profesión:</label>
            <select id="profesionFamiliar-${familiarCounter}" required></select>

            <label for="ciudadNacimientoFamiliar-${familiarCounter}">Ciudad de Nacimiento:</label>
            <select id="ciudadNacimientoFamiliar-${familiarCounter}" required></select>

            <label for="lenguaMaternaFamiliar-${familiarCounter}">Lengua Materna:</label>
            <select id="lenguaMaternaFamiliar-${familiarCounter}" required></select>

            <label for="idiomasFamiliar-${familiarCounter}">Idiomas Conocidos:</label>
            <select id="idiomasFamiliar-${familiarCounter}" multiple required></select>
        </fieldset>
    `;

    const div = document.createElement("div");
    div.innerHTML = familiarHTML;
    familiarContainer.appendChild(div);

    // Cargar opciones dinámicas para el nuevo familiar
    cargarOpciones(`profesionFamiliar-${familiarCounter}`, dataGlobal.profesiones);
    cargarOpciones(`lenguaMaternaFamiliar-${familiarCounter}`, dataGlobal.lenguas);
    cargarOpciones(`idiomasFamiliar-${familiarCounter}`, dataGlobal.idiomas);
    cargarCiudadesNacimiento(`ciudadNacimientoFamiliar-${familiarCounter}`, dataGlobal.paises);
}

function validarFormulario(e) {
    e.preventDefault();

    const alumno = construirAlumno();
    mostrarResumen(alumno);
}

function AlumnoBuilder() {
    this.nombre = "";
    this.apellidos = "";
    this.nif = "";
    this.lenguaMaterna = "";
    this.idiomasConocidos = [];
    this.direccion = {};
    this.datosAcademicos = {};
    this.informacionMedica = {};
    this.familiares = [];
}

AlumnoBuilder.prototype.setNombre = function (nombre) {
    this.nombre = nombre;
    return this;
};

AlumnoBuilder.prototype.setApellidos = function (apellidos) {
    this.apellidos = apellidos;
    return this;
};

AlumnoBuilder.prototype.setNIF = function (nif) {
    this.nif = nif;
    return this;
};

AlumnoBuilder.prototype.setLenguaMaterna = function (lenguaMaterna) {
    this.lenguaMaterna = lenguaMaterna;
    return this;
};

AlumnoBuilder.prototype.setIdiomasConocidos = function (idiomasConocidos) {
    this.idiomasConocidos = idiomasConocidos;
    return this;
};

AlumnoBuilder.prototype.setDireccion = function (direccion) {
    this.direccion = direccion;
    return this;
};

AlumnoBuilder.prototype.setDatosAcademicos = function (datosAcademicos) {
    this.datosAcademicos = datosAcademicos;
    return this;
};

AlumnoBuilder.prototype.setInformacionMedica = function (informacionMedica) {
    this.informacionMedica = informacionMedica;
    return this;
};

AlumnoBuilder.prototype.setFamiliares = function (familiares) {
    this.familiares = familiares;
    return this;
};

AlumnoBuilder.prototype.build = function () {
    return new Alumno(this);
};

function Alumno(builder) {
    this.nombre = builder.nombre;
    this.apellidos = builder.apellidos;
    this.nif = builder.nif;
    this.lenguaMaterna = builder.lenguaMaterna;
    this.idiomasConocidos = builder.idiomasConocidos;
    this.direccion = builder.direccion;
    this.datosAcademicos = builder.datosAcademicos;
    this.informacionMedica = builder.informacionMedica;
    this.familiares = builder.familiares;
}

function construirAlumno() {
    const familiares = [];
    for (let i = 1; i <= familiarCounter; i++) {
        familiares.push({
            nombre: document.getElementById(`nombreFamiliar-${i}`).value,
            apellidos: document.getElementById(`apellidosFamiliar-${i}`).value,
            nif: document.getElementById(`nifFamiliar-${i}`).value,
            profesion: document.getElementById(`profesionFamiliar-${i}`).value,
            ciudadNacimiento: document.getElementById(`ciudadNacimientoFamiliar-${i}`).value,
            lenguaMaterna: document.getElementById(`lenguaMaternaFamiliar-${i}`).value,
            idiomas: Array.from(
                document.getElementById(`idiomasFamiliar-${i}`).selectedOptions
            ).map(option => option.value),
        });
    }

    const alumnoBuilder = new AlumnoBuilder();
    alumnoBuilder
        .setNombre(document.getElementById("nombreAlumno").value)
        .setApellidos(document.getElementById("apellidosAlumno").value)
        .setNIF(document.getElementById("nifAlumno").value)
        .setLenguaMaterna(document.getElementById("lenguaMaternaAlumno").value)
        .setIdiomasConocidos(
            Array.from(document.getElementById("idiomasAlumno").selectedOptions).map(option => option.value)
        )
        .setDireccion({
            pais: document.getElementById("pais").value,
            ciudad: document.getElementById("ciudad").value,
            poblacion: document.getElementById("poblacion").value,
            direccionCompleta: document.getElementById("direccionCompleta").value,
            codigoPostal: document.getElementById("codigoPostal").value,
        })
        .setDatosAcademicos({
            colegio: document.getElementById("colegioProcedencia").value,
            nivelEstudios: document.getElementById("nivelEstudios").value,
            idiomasEstudiados: Array.from(
                document.getElementById("idiomasEstudiados").selectedOptions
            ).map(option => option.value),
            nivelSolicitado: document.getElementById("nivelEstudioSolicitado").value,
        })
        .setInformacionMedica({
            alergias: Array.from(document.getElementById("alergias").selectedOptions).map(option => option.value),
            medicacion: document.getElementById("medicacionActual").value,
        })
        .setFamiliares(familiares);

    return alumnoBuilder.build();
}

function mostrarResumen(alumno) {
    const modal = document.getElementById("modalResumen");
    const resumen = document.getElementById("resumen");

    const familiaresResumen = alumno.familiares
        .map(
            (familiar, index) => `
            <p><strong>Familiar ${index + 1}:</strong></p>
            <p>- Nombre: ${familiar.nombre}</p>
            <p>- Apellidos: ${familiar.apellidos}</p>
            <p>- NIF: ${familiar.nif}</p>
            <p>- Profesión: ${familiar.profesion}</p>
            <p>- Ciudad de Nacimiento: ${familiar.ciudadNacimiento}</p>
            <p>- Lengua Materna: ${familiar.lenguaMaterna}</p>
            <p>- Idiomas: ${familiar.idiomas.join(", ")}</p>
        `
        )
        .join("");

    resumen.innerHTML = `
        <p><strong>Nombre:</strong> ${alumno.nombre}</p>
        <p><strong>Apellidos:</strong> ${alumno.apellidos}</p>
        <p><strong>NIF:</strong> ${alumno.nif}</p>
        <p><strong>Lengua Materna:</strong> ${alumno.lenguaMaterna}</p>
        <p><strong>Idiomas Conocidos:</strong> ${alumno.idiomasConocidos.join(", ")}</p>
        <p><strong>Dirección:</strong> ${alumno.direccion.pais}, ${alumno.direccion.ciudad}, ${alumno.direccion.poblacion}</p>
        <p><strong>Dirección Completa:</strong> ${alumno.direccion.direccionCompleta}</p>
        <p><strong>Código Postal:</strong> ${alumno.direccion.codigoPostal}</p>
        <p><strong>Colegio de Procedencia:</strong> ${alumno.datosAcademicos.colegio}</p>
        <p><strong>Nivel de Estudios:</strong> ${alumno.datosAcademicos.nivelEstudios}</p>
        <p><strong>Idiomas Estudiados:</strong> ${alumno.datosAcademicos.idiomasEstudiados.join(", ")}</p>
        <p><strong>Nivel Solicitado:</strong> ${alumno.datosAcademicos.nivelSolicitado}</p>
        ${familiaresResumen}
        <p><strong>Alergias:</strong> ${alumno.informacionMedica.alergias.join(", ") || "Ninguna"}</p>
        <p><strong>Medicación Actual:</strong> ${alumno.informacionMedica.medicacion || "Ninguna"}</p>
    `;

    modal.style.display = "flex";
}