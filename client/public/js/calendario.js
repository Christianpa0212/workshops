document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  // ======= Configuración del calendario =======
  const calendar = new FullCalendar.Calendar(calendarEl, {
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

    // ======= Evento al hacer clic en un taller =======
    eventClick: function (info) {
      const taller = info.event.extendedProps;

      document.getElementById('modalTallerLabel').textContent = info.event.title;
      document.getElementById('modalDescripcion').textContent = taller.descripcion || 'Sin descripción';
      document.getElementById('modalFechaHora').textContent = info.event.start.toLocaleString();
      document.getElementById('modalTallerista').textContent = taller.tallerista || 'No disponible';
      document.getElementById('modalPeriodo').textContent = taller.periodo || 'No disponible';

      const modal = new bootstrap.Modal(document.getElementById('modalTaller'));
      modal.show();
    },

    // ======= Personalización de eventos en vista lista =======
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

  // ======= Renderizado del calendario =======
  calendar.render();
});
