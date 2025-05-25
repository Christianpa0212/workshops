document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btnAdd");
  const btnStudent = document.getElementById("btnStudent");
  const btnTallerist = document.getElementById("btnTallerist");
  const btnProfessor = document.getElementById("btnProfessor");

  const formAddUser = document.getElementById("formAddUser");
  const modalAddUser = new bootstrap.Modal(document.getElementById("modalAddUser"));

  const thead = document.getElementById("theadUsuarios");
  const tbody = document.getElementById("tbodyUsuarios");

  const btnConfirmDelete = document.getElementById("btnConfirmDelete");
  let deleteTarget = { tipo: null, id: null };

  let currentType = "student";

  const filtros = {
    student: {
      url: "/admin/usuarios/alumnos/api",
      headers: ["NUA", "Name", "Email", "Level", "Professor", "Actions"],
      renderRow: alumno => `
        <td>${alumno.nua}</td>
        <td>${alumno.nombre_completo}</td>
        <td>${alumno.email}</td>
        <td>${alumno.nivel_ingles}</td>
        <td>${alumno.profesor}</td>
        <td class="text-center">
          <button class="btn btn-outline-secondary btn-sm me-1" data-id="${alumno.idalumno}" data-type="student" data-action="view">
            <i class="bi bi-eye-fill"></i>
          </button>
          <button class="btn btn-outline-primary btn-sm me-1" data-id="${alumno.idalumno}" data-type="student" data-action="edit">
            <i class="bi bi-pen-fill"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" data-id="${alumno.idalumno}" data-type="student" data-action="delete">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `
    },
    tallerist: {
      url: "/admin/usuarios/talleristas/api",
      headers: ["Name", "Email", "Actions"],
      renderRow: user => `
        <td>${user.nombre_completo}</td>
        <td>${user.email}</td>
        <td class="text-center">
          <button class="btn btn-outline-secondary btn-sm me-1" data-id="${user.idtallerista}" data-type="tallerist" data-action="view">
            <i class="bi bi-eye-fill"></i>
          </button>
          <button class="btn btn-outline-primary btn-sm me-1" data-id="${user.idtallerista}" data-type="tallerist" data-action="edit">
            <i class="bi bi-pen-fill"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" data-id="${user.idtallerista}" data-type="tallerist" data-action="delete">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `
    },
    professor: {
      url: "/admin/usuarios/profesores/api",
      headers: ["Name", "Email", "Actions"],
      renderRow: user => `
        <td>${user.nombre_completo}</td>
        <td>${user.email}</td>
        <td class="text-center">
          <button class="btn btn-outline-secondary btn-sm me-1" data-id="${user.idprofesor}" data-type="professor" data-action="view">
            <i class="bi bi-eye-fill"></i>
          </button>
          <button class="btn btn-outline-primary btn-sm me-1" data-id="${user.idprofesor}" data-type="professor" data-action="edit">
            <i class="bi bi-pen-fill"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" data-id="${user.idprofesor}" data-type="professor" data-action="delete">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      `
    }
  };

  // ============================
  // Función: Cambiar tipo de usuario activo
  // Actualiza botón activo, nombre del botón 'Add', y carga los datos
  // ============================
  function setActive(type) {
    currentType = type;

    btnStudent.classList.replace("btn-dark", "btn-primary");
    btnTallerist.classList.replace("btn-dark", "btn-primary");
    btnProfessor.classList.replace("btn-dark", "btn-primary");

    if (type === "student") btnStudent.classList.replace("btn-primary", "btn-dark");
    if (type === "tallerist") btnTallerist.classList.replace("btn-primary", "btn-dark");
    if (type === "professor") btnProfessor.classList.replace("btn-primary", "btn-dark");

    btnAdd.style.display = type === "student" ? "none" : "inline-block";
    btnAdd.textContent = type === "tallerist" ? "Add Tallerist" : "Add Professor";

    cargarDatos();
  }

  // ============================
  // Función: Cargar datos desde API y renderizar tabla
  // ============================
  async function cargarDatos() {
    const config = filtros[currentType];
    try {
      const res = await fetch(config.url);
      const data = await res.json();
      renderTabla(config.headers, data, config.renderRow);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  }

  // ============================
  // Función: Renderizar tabla HTML dinámicamente
  // ============================
  function renderTabla(headers, data, renderRowFn) {
    thead.innerHTML = headers.map(h => `<th class="text-capitalize">${h}</th>`).join("");
    tbody.innerHTML = data.map(d => `<tr>${renderRowFn(d)}</tr>`).join("");
  }

  // ============================
  // Asignar eventos a botones de filtro
  // ============================
  btnStudent.addEventListener("click", () => setActive("student"));
  btnTallerist.addEventListener("click", () => setActive("tallerist"));
  btnProfessor.addEventListener("click", () => setActive("professor"));

// ============================
// BOTÓN "Agregar Usuario"
// Abre el modal correspondiente para registro
// ============================
btnAdd.addEventListener("click", () => {
  const modal = new bootstrap.Modal(document.getElementById("modalAddUser"));
  const form = document.getElementById("formAddUser");

  form.reset(); 

  document.getElementById("add_tipoUsuario").value = currentType;

  modal.show();
});

  setActive("student");

  // ============================
  // Delegación de eventos para botones (ver, editar, eliminar)
  // ============================
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;
    const tipo = btn.dataset.type;
    const action = btn.dataset.action;

    const pluralTipo = {
      student: "alumnos",
      tallerist: "talleristas",
      professor: "profesores"
    }[tipo];

    if (action === "delete") {
      deleteTarget = { tipo, id };
      new bootstrap.Modal(document.getElementById("modalConfirmDelete")).show();
      return;
    }

    const modal = new bootstrap.Modal(document.getElementById("modalUser"));
    const form = document.getElementById("formUser");

    form.reset();
    form.querySelector("#tipoUsuario").value = tipo;
    form.querySelector("#idUsuario").value = id;

    document.getElementById("grupoNUA").classList.add("d-none");
    document.getElementById("grupoNivel").classList.add("d-none");
    document.getElementById("grupoProfesor").classList.add("d-none");

    try {
      const res = await fetch(`/admin/usuarios/${pluralTipo}/api/${id}`);
      const data = await res.json();

      const modoLectura = action === "view";

      form.nombre.value = data.nombre || "";
      form.paterno.value = data.paterno || "";
      form.materno.value = data.materno || "";
      form.email.value = data.email || "";

      if (tipo === "student") {
        document.getElementById("grupoNUA").classList.remove("d-none");
        document.getElementById("grupoNivel").classList.remove("d-none");
        document.getElementById("grupoProfesor").classList.remove("d-none");

        form.nua.value = data.nua || "";

        const nivelSelect = document.getElementById("nivel_ingles");
        nivelSelect.value = data.nivel_ingles || "";
        nivelSelect.disabled = modoLectura;

        const profesorSelect = document.getElementById("idprofesor");
        profesorSelect.innerHTML = '<option value="">Selecciona profesor</option>';

        try {
          const resProf = await fetch("/admin/usuarios/profesores/api");
          const profesores = await resProf.json();

          profesores.forEach(p => {
            const option = document.createElement("option");
            option.value = p.idprofesor;
            option.textContent = p.nombre_completo || `${p.nombre} ${p.paterno} ${p.materno}`;
            profesorSelect.appendChild(option);
          });

          profesorSelect.value = data.idprofesor || "";
          profesorSelect.disabled = modoLectura;
        } catch (error) {
          console.error("Error al cargar profesores:", error);
        }
      }

      [...form.elements].forEach(el => {
        el.readOnly = modoLectura;
        if (el.tagName === "SELECT") el.disabled = modoLectura;
      });

      document.getElementById("modalUserLabel").textContent =
        modoLectura ? "View User" : "Edit User";
      document.getElementById("btnGuardarCambios").style.display =
        modoLectura ? "none" : "inline-block";

      modal.show();
    } catch (err) {
      console.error("Error al obtener datos del usuario:", err);
    }
  });

   // ============================
  // SUBMIT: Modal Editar
  // 
  // ============================
  document.getElementById("formUser").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const tipo = form.tipoUsuario.value;
    const id = form.idUsuario.value;

    const pluralTipo = {
      student: "alumnos",
      tallerist: "talleristas",
      professor: "profesores"
    }[tipo];

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/admin/usuarios/${pluralTipo}/api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Error en la actualización del usuario.");
      }

      bootstrap.Modal.getInstance(document.getElementById("modalUser")).hide();
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Hubo un problema al guardar los cambios.");
    }
  });

  // ============================
  // Confirmación de eliminación de usuario (Modal)
  // Realiza petición DELETE y actualiza tabla
  // ============================
  btnConfirmDelete.addEventListener("click", async () => {
    const { tipo, id } = deleteTarget;

    const pluralTipo = {
      student: "alumnos",
      tallerist: "talleristas",
      professor: "profesores"
    }[tipo];

    try {
      const res = await fetch(`/admin/usuarios/${pluralTipo}/api/${id}`, {
        method: "DELETE"
      });

      bootstrap.Modal.getInstance(document.getElementById("modalConfirmDelete")).hide();
      if (res.ok) {
        cargarDatos();
      } else {
        alert("Error al eliminar usuario.");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error de red o del servidor.");
    }
  });


// ============================
// SUBMIT: Formulario "Agregar Usuario"
// Solo aplica para talleristas y profesores (no alumnos)
// ============================
document.getElementById("formAddUser").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const tipo = form.tipoUsuario.value;

  const pluralTipo = {
    tallerist: "talleristas",
    professor: "profesores"
  }[tipo];

  console.log("📤 Enviando usuario:");
  console.log("tipoUsuario:", tipo);
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  console.log("Payload completo:", payload);

  if (!pluralTipo) {
    alert("Solo se puede registrar talleristas o profesores.");
    return;
  }

  try {
    const res = await fetch(`/admin/usuarios/${pluralTipo}/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("No se pudo registrar");

    bootstrap.Modal.getInstance(document.getElementById("modalAddUser")).hide();
    cargarDatos();
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    alert("No se pudo registrar el usuario.");
  }
});

});

// ============================
// FUNCIÓN ACTUALIZAR SECCIÓN ACTIVA
// Se actualiza el tipo de usuario visualizado y el botón de "Agregar"
// ============================
function setActive(type) {
  currentType = type;

  btnStudent.classList.replace("btn-dark", "btn-primary");
  btnTallerist.classList.replace("btn-dark", "btn-primary");
  btnProfessor.classList.replace("btn-dark", "btn-primary");

  if (type === "student") {
    btnStudent.classList.replace("btn-primary", "btn-dark");
    btnAdd.style.display = "none"; 
  } else {
    if (type === "tallerist") btnTallerist.classList.replace("btn-primary", "btn-dark");
    if (type === "professor") btnProfessor.classList.replace("btn-primary", "btn-dark");

    btnAdd.style.display = "inline-block";
    btnAdd.textContent =
      type === "tallerist" ? "Agregar Tallerista" :
      type === "professor" ? "Agregar Profesor" :
      "Agregar Usuario";
  }
  cargarDatos();
}

