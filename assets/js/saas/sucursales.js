/**
 * ANTHONY CHEF - SUCURSALES JS
 * Gestión CRUD de sucursales
 */

const Sucursales = {
    // Datos estáticos de sucursales
    sucursales: [
        {
            id: 1,
            nombre: 'Sucursal Centro',
            direccion: 'Av. Principal 123',
            telefono: '(555) 123-4567',
            email: 'centro@anthonychef.com',
            empleados: 12,
            estado: 'activo',
            admin: 'admin_centro'
        },
        {
            id: 2,
            nombre: 'Sucursal Norte',
            direccion: 'Calle Norte 456',
            telefono: '(555) 234-5678',
            email: 'norte@anthonychef.com',
            empleados: 10,
            estado: 'activo',
            admin: 'admin_norte'
        },
        {
            id: 3,
            nombre: 'Sucursal Sur',
            direccion: 'Av. del Sur 789',
            telefono: '(555) 345-6789',
            email: 'sur@anthonychef.com',
            empleados: 15,
            estado: 'inactivo',
            admin: 'admin_sur'
        }
    ],

    init() {
        this.render();
        this.updateStats();
    },

    render() {
        const container = document.getElementById('sucursales-grid');
        container.innerHTML = this.sucursales.map(s => this.createCard(s)).join('');
    },

    createCard(sucursal) {
        return `
            <div class="branch-card" data-id="${sucursal.id}" data-estado="${sucursal.estado}">
                <div class="branch-card-header">
                    <div class="branch-icon-wrapper">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="branch-header-content">
                        <div class="branch-name">${sucursal.nombre}</div>
                        <span class="branch-status ${sucursal.estado}">
                            ${sucursal.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>

                <div class="branch-card-body">
                    <div class="branch-info-grid">
                        <div class="branch-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="branch-info-content">
                                <div class="branch-info-label">Dirección</div>
                                <div class="branch-info-value">${sucursal.direccion}</div>
                            </div>
                        </div>
                        
                        <div class="branch-info-item">
                            <i class="fas fa-phone"></i>
                            <div class="branch-info-content">
                                <div class="branch-info-label">Teléfono</div>
                                <div class="branch-info-value">${sucursal.telefono}</div>
                            </div>
                        </div>
                        
                        <div class="branch-info-item">
                            <i class="fas fa-envelope"></i>
                            <div class="branch-info-content">
                                <div class="branch-info-label">Email</div>
                                <div class="branch-info-value">${sucursal.email}</div>
                            </div>
                        </div>
                        
                        <div class="branch-info-item">
                            <i class="fas fa-users"></i>
                            <div class="branch-info-content">
                                <div class="branch-info-label">Empleados</div>
                                <div class="branch-info-value">${sucursal.empleados} colaboradores</div>
                            </div>
                        </div>
                        
                        <div class="branch-info-item">
                            <i class="fas fa-user-shield"></i>
                            <div class="branch-info-content">
                                <div class="branch-info-label">Administrador</div>
                                <div class="branch-info-value">${sucursal.admin}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="branch-card-footer">
                    <div class="branch-actions">
                        <button class="btn-branch btn-branch-edit" onclick="Sucursales.edit(${sucursal.id})">
                            <i class="fas fa-edit"></i>
                            <span>Editar</span>
                        </button>
                        <button class="btn-branch btn-branch-delete" onclick="Sucursales.confirmDelete(${sucursal.id})">
                            <i class="fas fa-trash"></i>
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    updateStats() {
        const total = this.sucursales.length;
        const activas = this.sucursales.filter(s => s.estado === 'activo').length;
        const inactivas = this.sucursales.filter(s => s.estado === 'inactivo').length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-activas').textContent = activas;
        document.getElementById('stat-inactivas').textContent = inactivas;
    },

    filter() {
        const search = document.getElementById('search-input').value.toLowerCase();
        const status = document.getElementById('filter-status').value;

        const cards = document.querySelectorAll('.branch-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const estado = card.dataset.estado;

            const matchSearch = text.includes(search);
            const matchStatus = !status || estado === status;

            card.style.display = matchSearch && matchStatus ? '' : 'none';
        });
    },

    openModal() {
        document.getElementById('modal-title').textContent = 'Nueva Sucursal';
        document.getElementById('form-sucursal').reset();
        document.getElementById('sucursal-id').value = '';
        document.getElementById('modal-overlay').classList.add('active');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    },

    edit(id) {
        const sucursal = this.sucursales.find(s => s.id === id);
        if (!sucursal) return;

        document.getElementById('modal-title').textContent = 'Editar Sucursal';
        document.getElementById('sucursal-id').value = sucursal.id;
        document.getElementById('sucursal-nombre').value = sucursal.nombre;
        document.getElementById('sucursal-direccion').value = sucursal.direccion;
        document.getElementById('sucursal-telefono').value = sucursal.telefono;
        document.getElementById('sucursal-email').value = sucursal.email;
        document.getElementById('sucursal-empleados').value = sucursal.empleados;
        document.getElementById('sucursal-estado').value = sucursal.estado;
        document.getElementById('sucursal-usuario').value = sucursal.admin;
        document.getElementById('sucursal-contrasena').value = '';
        document.getElementById('sucursal-confirmar').value = '';

        document.getElementById('modal-overlay').classList.add('active');
    },

    save(event) {
        event.preventDefault();

        const id = document.getElementById('sucursal-id').value;
        const nombre = document.getElementById('sucursal-nombre').value;
        const direccion = document.getElementById('sucursal-direccion').value;
        const telefono = document.getElementById('sucursal-telefono').value;
        const email = document.getElementById('sucursal-email').value;
        const empleados = document.getElementById('sucursal-empleados').value;
        const estado = document.getElementById('sucursal-estado').value;
        const usuario = document.getElementById('sucursal-usuario').value;
        const contrasena = document.getElementById('sucursal-contrasena').value;
        const confirmar = document.getElementById('sucursal-confirmar').value;

        // Validar contraseñas
        if (contrasena && contrasena !== confirmar) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            });
            return;
        }

        // Simular guardado
        const datos = {
            id: id || Date.now(),
            nombre,
            direccion,
            telefono,
            email,
            empleados: parseInt(empleados) || 0,
            estado,
            admin: usuario
        };

        if (id) {
            // Editar
            const index = this.sucursales.findIndex(s => s.id == id);
            if (index !== -1) {
                this.sucursales[index] = { ...this.sucursales[index], ...datos };
            }
        } else {
            // Crear
            this.sucursales.push(datos);
        }

        this.closeModal();
        this.render();
        this.updateStats();

        Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: `Sucursal "${nombre}" guardada exitosamente`,
            showConfirmButton: false,
            timer: 2000
        });
    },

    confirmDelete(id) {
        const sucursal = this.sucursales.find(s => s.id === id);
        if (!sucursal) return;

        Swal.fire({
            title: '¿Eliminar Sucursal?',
            text: `¿Estás seguro de eliminar "${sucursal.nombre}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                this.sucursales = this.sucursales.filter(s => s.id !== id);
                this.render();
                this.updateStats();

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminada',
                    text: 'Sucursal eliminada correctamente',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => Sucursales.init());
