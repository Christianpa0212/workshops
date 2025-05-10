document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.getElementById("btnAdd");
    const tbody = document.getElementById("tbodyPeriodos");
    const form = document.getElementById("formPeriodo");
    const modal = new bootstrap.Modal(document.getElementById("modalPeriodo"));
    const modalLabel = document.getElementById("modalPeriodoLabel");
    const btnGuardar = document.getElementById("btnGuardarPeriodo");
  
    let editandoId = null;
  
    // ============================
    // Cargar periodo activo
    // ============================
    async function cargarPeriodoActivo() {
      try {
        const res = await fetch("/admin/periodos/activo/api");
        const periodo = await res.json();
  
        const contenedor = document.querySelector(".bg-secondary .fs-5");
        if (periodo) {
          contenedor.innerHTML = `
            ${periodo.nombre}<br>
            <small>${periodo.fecha_inicio} - ${periodo.fecha_fin}</small>
          `;
        } else {
          contenedor.innerHTML = `<span class="text-light">No active period</span>`;
        }
      } catch (error) {
        console.error("Error al cargar periodo activo:", error);
      }
    }
  
    // ============================
    // Cargar tabla de periodos
    // ============================
    async function cargarPeriodos() {
      try {
        const res = await fetch("/admin/periodos/api");
        const data = await res.json();
  
        tbody.innerHTML = data.map(p => `
          <tr>
            <td>${p.nombre}</td>
            <td>${p.fecha_inicio}</td>
            <td>${p.fecha_fin}</td>
            <td><span class="badge ${p.estado === 'active' ? 'bg-success' : 'bg-secondary'}">${p.estado}</span></td>
            <td class="text-center">
              <button class="btn btn-outline-primary btn-sm" data-id="${p.idperiodo}" data-action="edit">
                <i class="bi bi-pen-fill"></i>
              </button>
            </td>
          </tr>
        `).join("");
      } catch (error) {
        console.error("Error al cargar periodos:", error);
      }
    }
  
    // ============================
    // Botón "Agregar nuevo periodo"
    // ============================
    btnAdd.addEventListener("click", () => {
      editandoId = null;
      form.reset();
      modalLabel.textContent = "Add new & change Period";
      btnGuardar.textContent = "Add";
      modal.show();
    });
  
    // ============================
    // Botón editar (delegación)
    // ============================
    document.addEventListener("click", async e => {
      const btn = e.target.closest("button[data-action='edit']");
      if (!btn) return;
  
      const id = btn.dataset.id;
      editandoId = id;
  
      try {
        const res = await fetch(`/admin/periodos/api/${id}`);
        const data = await res.json();
  
        form.nombre.value = data.nombre;
        form.fecha_inicio.value = data.fecha_inicio;
        form.fecha_fin.value = data.fecha_fin;
        form.idperiodo.value = data.idperiodo;
  
        modalLabel.textContent = "Edit Period";
        btnGuardar.textContent = "Save Changes";
        modal.show();
      } catch (error) {
        console.error("Error al obtener periodo:", error);
      }
    });
  
    // ============================
    // Envío de formulario
    // ============================
    form.addEventListener("submit", async e => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
  
      try {
        const url = editandoId
          ? `/admin/periodos/api/${editandoId}`
          : `/admin/periodos/api`;
  
        const method = editandoId ? "PUT" : "POST";
  
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
  
        if (!res.ok) throw new Error("Error al guardar periodo");
  
        modal.hide();
        await cargarPeriodoActivo();
        await cargarPeriodos();
      } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar el periodo.");
      }
    });
  
    // ============================
    // Inicialización
    // ============================
    cargarPeriodoActivo();
    cargarPeriodos();
  });
  