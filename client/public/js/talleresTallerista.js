// ===============================
// Inicialización del DOM y variables principales
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const btnAdd = document.getElementById("btnAdd");
  const tbody = document.getElementById("tbodyTalleres");
  const form = document.getElementById("formTaller");
  const modal = new bootstrap.Modal(document.getElementById("modalTaller"));
  const btnGuardar = document.getElementById("btnGuardarTaller");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  const calendarContainer = document.getElementById("calendarContainer");
  let calendar = null;

  let editandoId = null;
  let deleteId = null;

  const btnAdmin = document.getElementById("btnAdmin");
  const btnCalendar = document.getElementById("btnCalendar");

  // ===============================
  // Manejo del filtro entre vista tabla y vista calendario
  // ===============================
  btnAdmin.addEventListener("click", () => {
    btnAdmin.classList.replace("btn-primary", "btn-dark");
    btnCalendar.classList.replace("btn-dark", "btn-primary");
    document.getElementById("tablaTalleres").parentElement.style.display = "block";
    calendarContainer.style.display = "none";
  });

  btnCalendar.addEventListener("click", () => {
    btnCalendar.classList.replace("btn-primary", "btn-dark");
    btnAdmin.classList.replace("btn-dark", "btn-primary");
    document.getElementById("tablaTalleres").parentElement.style.display = "none";
    calendarContainer.style.display = "block";

    // Inicialización del calendario si no se ha renderizado
    if (!calendar) {
      calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
        initialView: 'dayGridMonth',
        locale: 'en',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: '/api/horarios',
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        // Mostrar detalle del taller en modal al hacer clic en evento
        eventClick: function (info) {
          const taller = info.event.extendedProps;

          document.getElementById('modalDetalleTallerLabel').textContent = info.event.title;
          document.getElementById('modalDescripcion').textContent = taller.descripcion || 'No description';
          document.getElementById('modalFechaHora').textContent = info.event.start.toLocaleString();
          document.getElementById('modalTallerista').textContent = taller.tallerista || 'Unavailable';
          document.getElementById('modalPeriodo').textContent = taller.periodo || 'Unavailable';

          new bootstrap.Modal(document.getElementById("modalDetalleTaller")).show();
        }
      });
      calendar.render();
    }
  });

  // ===============================
  // Función auxiliar para convertir fecha DD/MM/YY a formato YYYY-MM-DD (para input type="date")
  // ===============================
  function convertirFechaParaInput(fechaDDMMYY) {
    const [dia, mes, anio] = fechaDDMMYY.split('/');
    return `20${anio}-${mes}-${dia}`;
  }

  // ===============================
  // Cargar lista de talleres del tallerista
  // ===============================
  async function cargarTalleres() {
    try {
      const res = await fetch("/tallerista/talleres/api/mis-talleres", { credentials: 'include' });
      const talleres = await res.json();

      tbody.innerHTML = talleres.map(t => `
        <tr>
          <td>${t.nombre}</td>
          <td>${t.descripcion || '-'}</td>
          <td>${t.fecha}</td>
          <td>${t.hora}</td>
          <td><span class="badge ${t.estado === 'active' ? 'bg-success' : 'bg-secondary'}">${t.estado}</span></td>
          <td class="text-center">
            <button class="btn btn-outline-secondary btn-sm me-1" data-id="${t.idtaller}" data-action="view"><i class="bi bi-eye-fill"></i></button>
            ${t.estado === 'active' ? `
              <button class="btn btn-outline-primary btn-sm me-1" data-id="${t.idtaller}" data-action="edit"><i class="bi bi-pen-fill"></i></button>
              <button class="btn btn-outline-danger btn-sm" data-id="${t.idtaller}" data-action="cancel"><i class="bi bi-x-circle"></i></button>
            ` : ''}
          </td>
        </tr>
      `).join("");
    } catch (err) {
      console.error("Error loading workshops:", err);
    }
  }

  // ===============================
  // Mostrar formulario de creación de taller
  // ===============================
  btnAdd.addEventListener("click", () => {
    editandoId = null;
    form.reset();
    form.idtaller.value = "";
    form.cupo_maximo.value = 8;
    form.idperiodo.value = document.getElementById("idperiodo").value;

    document.getElementById("modalTallerLabel").textContent = "Add New Workshop";
    btnGuardar.textContent = "Save Workshop";
    form.cupo_maximo.removeAttribute("readonly");
    form.querySelectorAll("input, select, textarea").forEach(el => el.disabled = false);
    btnGuardar.style.display = "inline-block";

    modal.show();
  });

  // ===============================
  // Manejo de botones dentro de la tabla: ver, editar, cancelar
  // ===============================
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "view") {
      const [res1, res2] = await Promise.all([
        fetch(`/tallerista/talleres/api/mis-talleres/${id}`),
        fetch(`/tallerista/talleres/api/inscritos/${id}`)
      ]);

      const taller = await res1.json();
      const alumnos = await res2.json();

      document.getElementById("detalleNombre").textContent = taller.nombre;
      document.getElementById("detalleDescripcion").textContent = taller.descripcion || '-';
      document.getElementById("detalleFechaHora").textContent = `${taller.fecha} ${taller.hora}`;

      const tbodyAlumnos = document.getElementById("tbodyAlumnosInscritos");
      tbodyAlumnos.innerHTML = alumnos.map(a => `
        <tr>
          <td>${a.alumno}</td>
          <td>${a.nivel_ingles}</td>
        </tr>
      `).join("");

      new bootstrap.Modal(document.getElementById("modalDetalleTallerExtendido")).show();
    }

    if (action === "edit") {
      const res = await fetch(`/tallerista/talleres/api/mis-talleres/${id}`);
      const data = await res.json();

      editandoId = id;
      form.nombre.value = data.nombre;
      form.descripcion.value = data.descripcion;
      form.fecha.value = convertirFechaParaInput(data.fecha);
      form.hora.value = data.hora;
      form.cupo_maximo.value = data.cupo_maximo;
      form.idtaller.value = data.idtaller;
      form.idperiodo.value = data.idperiodo;

      document.getElementById("modalTallerLabel").textContent = "Edit Workshop";
      btnGuardar.textContent = "Save Changes";
      btnGuardar.style.display = "inline-block";
      modal.show();
    }

    if (action === "cancel") {
      deleteId = id;
      new bootstrap.Modal(document.getElementById("modalConfirmDelete")).show();
    }
  });

  // ===============================
  // Confirmación para cancelar taller
  // ===============================
  btnConfirmDelete.addEventListener("click", async () => {
    const res = await fetch(`/tallerista/talleres/api/cancelar/${deleteId}`, {
      method: "POST"
    });

    if (res.ok) {
      cargarTalleres();
      bootstrap.Modal.getInstance(document.getElementById("modalConfirmDelete")).hide();
    }
  });

  // ===============================
  // Envío del formulario para crear o actualizar taller
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!btnGuardar.offsetParent) return;

    const payload = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      fecha: form.fecha.value,
      hora: form.hora.value,
      cupo_maximo: form.cupo_maximo.value,
      idperiodo: form.idperiodo.value
    };

    if (editandoId) payload.idtaller = form.idtaller.value;

    const url = editandoId ? `/tallerista/talleres/api/${form.idtaller.value}` : "/tallerista/talleres/api/crear";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (res.ok) {
      modal.hide();
      cargarTalleres();
    }
  });

  // ===============================
  // Carga inicial de talleres al abrir la página
  // ===============================
  cargarTalleres();
});
