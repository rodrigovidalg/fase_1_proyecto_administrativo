import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Bootstrap Modal
const Modal = window.bootstrap.Modal;

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyActULR2Fqu4F3A_A1TUOXQbfrORZecqiI",
    authDomain: "ofertassuper-a9841.firebaseapp.com",
    projectId: "ofertassuper-a9841",
    storageBucket: "ofertassuper-a9841.appspot.com",
    messagingSenderId: "29615340161",
    appId: "1:29615340161:web:bbca60564936cdc9e1ab80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const form = document.getElementById("form-supermercado");
const tbodySupermercados = document.getElementById("tbody-supermercados");
const formInvitacion = document.getElementById("form-invitacion");
const selectSupermercado = document.getElementById("select-supermercado");

const filtroSupermercado = document.getElementById("filtro-supermercado");
const tbodyInvitaciones = document.getElementById("tbody-invitaciones");

// Modal desactivar supermercado
const modalConfirmarEl = document.getElementById("modalConfirmar");
const modalNombreSpan = document.getElementById("modal-nombre");
const modalDireccionSpan = document.getElementById("modal-direccion");
const modalTelefonoSpan = document.getElementById("modal-telefono");
const checkboxConsciente = document.getElementById("checkbox-consciente");
const inputConfirmacion = document.getElementById("input-confirmacion");
const btnConfirmar = document.getElementById("btn-confirmar");
const formConfirmacion = document.getElementById("form-confirmacion");

let modalSupermercadoId = null;
let modalSupermercadoNombre = null;
let modalInstance = null;

function resetModal() {
    checkboxConsciente.checked = false;
    inputConfirmacion.value = "";
    btnConfirmar.disabled = true;
}

function validarModal() {
    const textoValido = inputConfirmacion.value.trim().toLowerCase() === modalSupermercadoNombre.toLowerCase();
    const checkboxValido = checkboxConsciente.checked;
    btnConfirmar.disabled = !(textoValido && checkboxValido);
}

checkboxConsciente.addEventListener("change", validarModal);
inputConfirmacion.addEventListener("input", validarModal);

formConfirmacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await updateDoc(doc(db, "supermercados", modalSupermercadoId), {
            activo: false
        });
        modalInstance.hide();
        mostrarSupermercados();
        cargarInvitaciones();
        alert(`Supermercado "${modalSupermercadoNombre}" desactivado correctamente.`);
    } catch (error) {
        alert("Error al desactivar supermercado: " + error.message);
    }
});

// Modal eliminar invitacion
const modalEliminarInvitacionEl = document.getElementById("modalEliminarInvitacion");
const modalEliminarInvitacion = new Modal(modalEliminarInvitacionEl);
const invitarSupermercadoNombreSpan = document.getElementById("invitar-supermercado-nombre");
const checkboxEliminarInvitacion = document.getElementById("checkbox-eliminar-invitacion");
const inputEliminarInvitacionConfirmacion = document.getElementById("input-eliminar-invitacion-confirmacion");
const btnEliminarInvitacionConfirmar = document.getElementById("btn-eliminar-invitacion-confirmar");
const formEliminarInvitacion = document.getElementById("form-eliminar-invitacion");

let invitacionAEliminarId = null;
let invitacionAEliminarSupermercadoNombre = null;

// Validar modal eliminar invitacion
function validarModalEliminarInvitacion() {
    const textoValido = inputEliminarInvitacionConfirmacion.value.trim().toUpperCase() === "ELIMINAR";
    const checkboxValido = checkboxEliminarInvitacion.checked;
    btnEliminarInvitacionConfirmar.disabled = !(textoValido && checkboxValido);
}

checkboxEliminarInvitacion.addEventListener("change", validarModalEliminarInvitacion);
inputEliminarInvitacionConfirmacion.addEventListener("input", validarModalEliminarInvitacion);

formEliminarInvitacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await deleteDoc(doc(db, "invitaciones", invitacionAEliminarId));
        modalEliminarInvitacion.hide();
        cargarInvitaciones();
        alert("Invitación eliminada correctamente.");
    } catch (error) {
        alert("Error al eliminar invitación: " + error.message);
    }
});

// Función para validar si existe supermercado con mismo nombre y dirección
async function existeSupermercado(nombre, direccion) {
    const q = query(
        collection(db, "supermercados"),
        where("nombre", "==", nombre),
        where("direccion", "==", direccion)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Verificar si se puede eliminar supermercado (sin invitaciones)
async function puedeEliminarSupermercado(supermercadoId) {
    const invitacionesQuery = query(collection(db, "invitaciones"), where("supermercadoId", "==", supermercadoId));
    const invitacionesSnapshot = await getDocs(invitacionesQuery);
    if (!invitacionesSnapshot.empty) {
        return {
            puede: false,
            motivo: "Tiene invitaciones asociadas."
        };
    }
    // Agrega validación para usuarios si aplica
    return {
        puede: true
    };
}

// Mostrar supermercados
async function mostrarSupermercados() {
    tbodySupermercados.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "supermercados"));
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const activo = data.activo !== undefined ? data.activo : true;

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${data.nombre}</td>
      <td>${data.direccion || ""}</td>
      <td>${data.telefono || ""}</td>
      <td><span class="badge ${activo ? 'bg-success' : 'bg-secondary'}">${activo ? 'Activo' : 'Inactivo'}</span></td>
      <td>
        <button class="btn btn-sm btn-${activo ? 'warning' : 'success'} btn-toggle-estado">${activo ? 'Desactivar' : 'Activar'}</button>
        <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
      </td>
    `;

        tr.querySelector(".btn-toggle-estado").addEventListener("click", () => {
            if (activo) {
                modalSupermercadoId = docSnap.id;
                modalSupermercadoNombre = data.nombre;
                modalNombreSpan.textContent = data.nombre;
                modalDireccionSpan.textContent = data.direccion || "(No especificada)";
                modalTelefonoSpan.textContent = data.telefono || "(No especificado)";
                resetModal();
                modalInstance = new Modal(modalConfirmarEl);
                modalInstance.show();
            } else {
                updateDoc(doc(db, "supermercados", docSnap.id), {
                        activo: true
                    })
                    .then(() => {
                        mostrarSupermercados();
                        cargarInvitaciones();
                    })
                    .catch(error => alert("Error al activar supermercado: " + error.message));
            }
        });

        tr.querySelector(".btn-eliminar").addEventListener("click", async () => {
            const supermercadoId = docSnap.id;
            const nombre = data.nombre;

            const resultado = await puedeEliminarSupermercado(supermercadoId);
            if (!resultado.puede) {
                alert(`No se puede eliminar el supermercado porque: ${resultado.motivo}`);
                return;
            }

            if (confirm(`¿Eliminar supermercado "${nombre}"? Esta acción no se puede deshacer.`)) {
                try {
                    await deleteDoc(doc(db, "supermercados", supermercadoId));
                    mostrarSupermercados();
                    cargarInvitaciones();
                    alert("Supermercado eliminado correctamente.");
                } catch (error) {
                    alert("Error al eliminar supermercado: " + error.message);
                }
            }
        });

        tbodySupermercados.appendChild(tr);
    });
}

// Agregar supermercado con validación duplicados nombre+dirección
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre) {
        alert("El nombre es obligatorio");
        return;
    }

    if (await existeSupermercado(nombre, direccion)) {
        alert("Ya existe un supermercado con ese nombre y dirección.");
        return;
    }

    try {
        await addDoc(collection(db, "supermercados"), {
            nombre,
            direccion,
            telefono,
            activo: true
        });
        form.reset();
        mostrarSupermercados();
        cargarSupermercadosSelect();
    } catch (error) {
        alert("Error al agregar supermercado: " + error.message);
    }
});

// Cargar supermercados en select para invitaciones y filtro
async function cargarSupermercadosSelect() {
    selectSupermercado.innerHTML = '<option value="" disabled selected>Selecciona un supermercado</option>';
    filtroSupermercado.innerHTML = '<option value="">Todos los supermercados</option>';
    const querySnapshot = await getDocs(collection(db, "supermercados"));
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.activo !== false) {
            const option1 = document.createElement("option");
            option1.value = docSnap.id;
            option1.textContent = `${data.nombre} - ${data.direccion || "Sin dirección"}`;
            selectSupermercado.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = docSnap.id;
            option2.textContent = `${data.nombre} - ${data.direccion || "Sin dirección"}`;
            filtroSupermercado.appendChild(option2);
        }
    });
}

// Generar token simple
function generarToken() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

// Crear invitación
formInvitacion.addEventListener("submit", async (e) => {
    e.preventDefault();
    const supermercadoId = selectSupermercado.value;
    if (!supermercadoId) {
        alert("Selecciona un supermercado");
        return;
    }

    const token = generarToken();

    try {
        await addDoc(collection(db, "invitaciones"), {
            token,
            supermercadoId,
            rol: "editor",
            usado: false,
            fechaCreacion: serverTimestamp(),
        });
        alert(`Invitación creada. Token: ${token}`);
        formInvitacion.reset();
        cargarInvitaciones();
    } catch (error) {
        alert("Error al crear invitación: " + error.message);
    }
});

// Cargar invitaciones con filtro
async function cargarInvitaciones() {
    tbodyInvitaciones.innerHTML = "";
    const filtroId = filtroSupermercado.value;
    let q;
    if (filtroId) {
        q = query(collection(db, "invitaciones"), where("supermercadoId", "==", filtroId));
    } else {
        q = collection(db, "invitaciones");
    }

    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        // Obtener datos supermercado
        let nombreSupermercado = data.supermercadoId;
        let direccionSupermercado = "";
        let estadoSupermercado = "Desconocido";
        try {
            const supermercadoRef = doc(db, "supermercados", data.supermercadoId);
            const supermercadoSnap = await getDoc(supermercadoRef);
            if (supermercadoSnap.exists()) {
                nombreSupermercado = supermercadoSnap.data().nombre;
                direccionSupermercado = supermercadoSnap.data().direccion || "";
                estadoSupermercado = supermercadoSnap.data().activo === false ? "Inactivo" : "Activo";
            } else {
                nombreSupermercado = "Supermercado eliminado";
                direccionSupermercado = "-";
                estadoSupermercado = "Eliminado";
            }
        } catch (error) {
            console.error("Error al obtener supermercado:", error);
            nombreSupermercado = "Error al cargar supermercado";
            direccionSupermercado = "-";
            estadoSupermercado = "Error";
        }

        const estado = data.usado ? "Usado" : "Activo";

        let fechaUso = "-";
        if (data.usado && data.fechaUso) {
            fechaUso = data.fechaUso.toDate().toLocaleString();
        }

        const usuario = data.usuarioEmail || "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${nombreSupermercado} <br><small class="text-muted">(${estadoSupermercado})</small></td>
      <td>${direccionSupermercado}</td>
      <td><span class="badge ${data.usado ? 'bg-secondary' : 'bg-success'}">${estado}</span></td>
      <td>${fechaUso}</td>
      <td>${usuario}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-eliminar-invitacion">Eliminar</button>
      </td>
    `;

        tr.querySelector(".btn-eliminar-invitacion").addEventListener("click", () => {
            invitacionAEliminarId = docSnap.id;
            invitacionAEliminarSupermercadoNombre = nombreSupermercado;
            invitarSupermercadoNombreSpan.textContent = invitacionAEliminarSupermercadoNombre;
            checkboxEliminarInvitacion.checked = false;
            inputEliminarInvitacionConfirmacion.value = "";
            btnEliminarInvitacionConfirmar.disabled = true;
            modalEliminarInvitacion.show();
        });

        tbodyInvitaciones.appendChild(tr);
    }
}

// Inicialización
mostrarSupermercados();
cargarSupermercadosSelect();
cargarInvitaciones();

// Filtrar invitaciones al cambiar filtro
filtroSupermercado.addEventListener("change", cargarInvitaciones);
