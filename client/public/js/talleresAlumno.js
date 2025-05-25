document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("tbodyInscripciones");
  const calendarContainer = document.getElementById("calendarContainer");
  const tableSection = document.getElementById("tableSection");
  const btnCalendar = document.getElementById("btnCalendar");
  const btnInscription = document.getElementById("btnInscription");
  const modalCancelar = new bootstrap.Modal(document.getElementById("modalConfirmDelete"));
  const modalTaller = new bootstrap.Modal(document.getElementById("modalTaller"));
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");
  const btnGuardar = document.getElementById("btnGuardarTaller");

  let calendar = null;
  let cancelTargetId = null;

  // ===============================
  // Toggle entre tabla y calendario
  // ===============================
  btnInscription.addEventListener("click", () => {
    btnInscription.classList.replace("btn-primary", "btn-dark");
    btnCalendar.classList.replace("btn-dark", "btn-primary");
    tableSection.style.display = "block";
    calendarContainer.style.display = "none";
  });

  btnCalendar.addEventListener("click", () => {
    btnCalendar.classList.replace("btn-primary", "btn-dark");
    btnInscription.classList.replace("btn-dark", "btn-primary");
    tableSection.style.display = "none";
    calendarContainer.style.display = "block";

    if (!calendar) {
      console.log("Instanciando calendario...");
      calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
        initialView: 'dayGridMonth',
        locale: 'en',
        height: 700,
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
        eventClick: async function (info) {
          const taller = info.event.extendedProps;
          const idtaller = info.event.id;

          document.getElementById("nombre").value = info.event.title || 'Sin nombre';
          document.getElementById("descripcion").value = taller.descripcion || 'Sin descripción';
          document.getElementById("fecha").value = info.event.start?.toISOString().slice(0, 10) || '';
          document.getElementById("hora").value = taller.hora || '';
          document.getElementById("tallerista").value = taller.tallerista || 'No asignado';
          document.getElementById("idtaller").value = idtaller;

          const res = await fetch(`/alumno/talleres/api/estado-inscripcion/${idtaller}`);
          const data = await res.json();

          if (data.estado === 'cancelado') {
            btnGuardar.style.display = 'none';
          } else {
            btnGuardar.style.display = 'inline-block';

            if (data.inscrito) {
              btnGuardar.textContent = "Cancelar inscripción";
              btnGuardar.className = "btn btn-danger";
              btnGuardar.onclick = () => {
                cancelTargetId = data.idinscripcion;
                modalTaller.hide();
                modalCancelar.show();
              };
            } else {
              btnGuardar.textContent = "Inscribirse";
              btnGuardar.className = "btn btn-dark";
              btnGuardar.onclick = async () => {
                const idtaller = document.getElementById("idtaller").value;

                if (!idtaller || isNaN(idtaller)) {
                  alert("Error: ID del taller inválido.");
                  return;
                }

                const insRes = await fetch(`/alumno/talleres/api/inscribirse/${idtaller}`, {
                  method: "POST",
                  credentials: 'include'
                });

                if (!insRes.ok) {
                  const error = await insRes.text();
                  alert("Error al inscribirse: " + error);
                  return;
                }

                const result = await insRes.json();
                alert("Inscripción exitosa");
                calendar.refetchEvents();
                cargarInscripciones();
                modalTaller.hide();
              };
            }
          }

          modalTaller.show();
        }
      });

      setTimeout(() => {
        calendar.render();
        calendar.updateSize();
      }, 100);
    } else {
      calendarContainer.style.display = "block";
      calendar.updateSize();
    }
  });

  // ===============================
  // Cargar inscripciones a tabla
  // ===============================
  async function cargarInscripciones() {
    try {
      const res = await fetch("/alumno/talleres/api/inscripciones", { credentials: 'include' });
      const inscripciones = await res.json();

      tbody.innerHTML = inscripciones.map(i => `
        <tr>
          <td>${i.nombre}</td>
          <td><span class="badge ${i.estatus === 'inscrito' ? 'bg-success' : 'bg-secondary'}">${i.estatus}</span></td>
          <td>${i.fecha} ${i.hora}</td>
          <td><span class="badge ${i.estado_taller === 'active' ? 'bg-info' : 'bg-warning'}">${i.estado_taller}</span></td>
          <td class="text-center">
            <button class="btn btn-outline-secondary btn-sm me-1" data-action="view" data-id="${i.idinscripcion}"><i class="bi bi-eye-fill"></i></button>
            ${i.estatus === 'inscrito' ? `<button class="btn btn-outline-danger btn-sm" data-action="cancel" data-id="${i.idinscripcion}"><i class="bi bi-x-circle"></i></button>` : ''}
          </td>
        </tr>
      `).join("");
    } catch (err) {
      console.error("Error loading inscriptions:", err);
    }
  }

  // ===============================
  // Ver detalles o cancelar desde la tabla
  // ===============================
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "view") {
      const res = await fetch("/alumno/talleres/api/inscripciones", { credentials: 'include' });
      const data = await res.json();
      const inscripcion = data.find(i => i.idinscripcion == id);

      document.getElementById("detalleNombre").textContent = inscripcion.nombre;
      document.getElementById("detalleDescripcion").textContent = inscripcion.descripcion;
      document.getElementById("detalleFechaHora").textContent = `${inscripcion.fecha} ${inscripcion.hora}`;
      document.getElementById("detalleTallerista").textContent = inscripcion.tallerista;
      document.getElementById("detalleEstatus").textContent = inscripcion.estatus;

      modalTaller.show();
    }

    if (action === "cancel") {
      cancelTargetId = id;
      modalCancelar.show();
    }
  });

  // ===============================
  // Confirmación de cancelación
  // ===============================
  btnConfirmDelete.addEventListener("click", async () => {
    const res = await fetch(`/alumno/talleres/api/cancelar/${cancelTargetId}`, {
      method: "POST",
      credentials: 'include'
    });

    if (res.ok) {
      cargarInscripciones();
      calendar?.refetchEvents();
      modalCancelar.hide();
    }
  });

  // ===============================
  // Carga inicial
  // ===============================
  cargarInscripciones();
});
