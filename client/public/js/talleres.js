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

btnAdmin.addEventListener("click", () => {
  btnAdmin.classList.remove("btn-primary");
  btnAdmin.classList.add("btn-dark");

  btnCalendar.classList.remove("btn-dark");
  btnCalendar.classList.add("btn-primary");
});

btnCalendar.addEventListener("click", () => {
  btnCalendar.classList.remove("btn-primary");
  btnCalendar.classList.add("btn-dark");

  btnAdmin.classList.remove("btn-dark");
  btnAdmin.classList.add("btn-primary");
});
  // ============================
  // Utilidades
  // ============================
  function toggleModoLectura(modoLectura = false) {
    const elementos = form.querySelectorAll("input, select, textarea");
    elementos.forEach(el => el.disabled = modoLectura);
    btnGuardar.style.display = modoLectura ? "none" : "inline-block";
  }

  function convertirFechaParaInput(fechaDDMMYY) {
    const [dia, mes, anio] = fechaDDMMYY.split('/');
    return `20${anio}-${mes}-${dia}`;
  }

  // ============================
  // Cargar talleres (tabla)
  // ============================
  async function cargarTalleres() {
    try {
      const res = await fetch("/admin/talleres/api");
      const talleres = await res.json();

      tbody.innerHTML = talleres.map(t => `
        <tr>
          <td>${t.nombre}</td>
          <td>${t.descripcion || '-'}</td>
          <td>${t.fecha}</td>
          <td>${t.hora}</td>
          <td>${t.tallerista}</td>
          <td>${t.periodo}</td>
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
      console.error("Error al cargar talleres:", err);
    }
  }

  // ============================
  // Llenar select de talleristas
  // ============================
  async function cargarTalleristas() {
    const select = document.getElementById("idtallerista");
    select.innerHTML = '<option value="">Select</option>';
    const res = await fetch("/admin/talleres/talleristas/api");
    const data = await res.json();
    data.forEach(t => {
      const option = document.createElement("option");
      option.value = t.idtallerista;
      option.textContent = t.nombre_completo;
      select.appendChild(option);
    });
  }

  // ============================
  // Agregar nuevo taller
  // ============================
  btnAdd.addEventListener("click", () => {
    editandoId = null;
    form.reset();

    form.idtaller.value = "";

    const idPeriodoEl = document.getElementById("idperiodo");
    form.idperiodo.value = idPeriodoEl.value;
    document.getElementById("periodoNombre").value = idPeriodoEl.dataset.nombre;

    form.cupo_maximo.value = 8;
    form.cupo_maximo.setAttribute("readonly", true);

    document.getElementById("modalTallerLabel").textContent = "Add New Workshop";
    btnGuardar.textContent = "Save Workshop";

    toggleModoLectura(false);
    cargarTalleristas();
    modal.show();
  });

  // ============================
  // Delegación: ver / editar / cancelar
  // ============================
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "view" || action === "edit") {
      const res = await fetch(`/admin/talleres/api/${id}`);
      const data = await res.json();

      form.nombre.value = data.nombre;
      form.descripcion.value = data.descripcion;
      form.fecha.value = convertirFechaParaInput(data.fecha);
      form.hora.value = data.hora;
      form.cupo_maximo.value = data.cupo_maximo;
      form.idtaller.value = data.idtaller;
      form.idperiodo.value = data.idperiodo;
      document.getElementById("periodoNombre").value = data.periodo;

      await cargarTalleristas();
      form.idtallerista.value = data.idtallerista;

      if (action === "view") {
        document.getElementById("modalTallerLabel").textContent = "Workshop Details";
        toggleModoLectura(true);
        modal.show();
      }

      if (action === "edit") {
        editandoId = id;
        document.getElementById("modalTallerLabel").textContent = "Workshop Edit";
        toggleModoLectura(false);
        btnGuardar.textContent = "Save Changes";
        form.cupo_maximo.setAttribute("readonly", true);
        modal.show();
      }
    }

    if (action === "cancel") {
      deleteId = id;
      new bootstrap.Modal(document.getElementById("modalConfirmDelete")).show();
    }
  });

  // ============================
  // Confirmar cancelación
  // ============================
  btnConfirmDelete.addEventListener("click", async () => {
    const res = await fetch(`/admin/talleres/estado/${deleteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "canceled" })
    });

    if (res.ok) {
      cargarTalleres();
      bootstrap.Modal.getInstance(document.getElementById("modalConfirmDelete")).hide();
    }
  });

  // ============================
  // Guardar taller (POST o PUT)
  // ============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!btnGuardar.offsetParent) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    const url = editandoId ? `/admin/talleres/api/${form.idtaller.value}` : "/admin/talleres/api";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      modal.hide();
      cargarTalleres();
    }
  });


  document.getElementById("btnAdmin").addEventListener("click", () => {
  document.getElementById("tablaTalleres").parentElement.style.display = "block";
  calendarContainer.style.display = "none";
});

document.getElementById("btnCalendar").addEventListener("click", () => {
  document.getElementById("tablaTalleres").parentElement.style.display = "none";
  calendarContainer.style.display = "block";

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
      eventClick: function (info) {
        const taller = info.event.extendedProps;

        document.getElementById('modalDetalleTallerLabel').textContent = info.event.title;
        document.getElementById('modalDescripcion').textContent = taller.descripcion || 'Sin descripción';
        document.getElementById('modalFechaHora').textContent = info.event.start.toLocaleString();
        document.getElementById('modalTallerista').textContent = taller.tallerista || 'No disponible';
        document.getElementById('modalPeriodo').textContent = taller.periodo || 'No disponible';

        new bootstrap.Modal(document.getElementById("modalDetalleTaller")).show();
      },
      eventDidMount: function (info) {
  if (info.view.type.startsWith('list')) {
    const tallerista = info.event.extendedProps.tallerista || 'No disponible';
    
    const link = info.el.querySelector('.fc-list-event-title a');
    if (link) {
      link.innerHTML += ` <span style="font-weight: normal; font-size: 0.9em;">– Tallerist: ${tallerista}</span>`;
    }
  }
}
    });
    calendar.render();
  }
});
  cargarTalleres();
});
