/**
 * ANTHONY CHEF - USER DROPDOWN MENU
 * Componente independiente de menú de usuario
 * Propietaria: Angelica Alejandra Buitrago Rojas
 */

const UserDropdown = {
    isOpen: false,

    OWNER: {
        nombre: 'Angelica Buitrago',
        nombreCompleto: 'Angelica Alejandra Buitrago Rojas',
        rol: 'Propietaria / CEO',
        celular: '3001234567',
        email: 'angelica.buitrago@anthonychef.com',
        initials: 'AB',
        sucursales: 'Todas (3 sucursales)'
    },

    /* ─────────────────────────────────────────
       INIT
    ───────────────────────────────────────── */
    init() {
        this.setupClickOutside();
        this.updateUserInfo();
        this._injectModals();
    },

    updateUserInfo() {
        const usuario = AuthService.getCurrentUser();
        if (!usuario) return;

        const isDueno = usuario.rol === 'dueño';

        // Prefer saved profile data
        const saved = this._getSavedProfile();
        const nombre = saved?.nombre || (isDueno ? this.OWNER.nombre : usuario.nombre);
        const rol    = isDueno ? this.OWNER.rol : 'Administrador Sucursal';
        const partes = nombre.split(' ');
        const iniciales = isDueno
            ? 'AB'
            : ((partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')).toUpperCase();

        document.querySelectorAll('.udrop-avatar').forEach(el => el.textContent = iniciales);
        document.querySelectorAll('.udrop-name').forEach(el => el.textContent = nombre);
        document.querySelectorAll('.udrop-role').forEach(el => el.textContent = rol);
        document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = nombre);
        document.querySelectorAll('.sidebar-user-role').forEach(el => el.textContent = rol);
        document.querySelectorAll('.sidebar-avatar').forEach(el => el.textContent = iniciales);
    },

    /* ─────────────────────────────────────────
       DROPDOWN TOGGLE
    ───────────────────────────────────────── */
    toggle() {
        const menu  = document.getElementById('udrop-menu');
        const arrow = document.getElementById('udrop-arrow');
        if (!menu) return;

        this.isOpen = !this.isOpen;
        menu.classList.toggle('active', this.isOpen);
        if (arrow) arrow.style.transform = this.isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    },

    close() {
        const menu  = document.getElementById('udrop-menu');
        const arrow = document.getElementById('udrop-arrow');
        if (!menu) return;

        this.isOpen = false;
        menu.classList.remove('active');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    },

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#udrop-container')) this.close();
        });
    },

    /* ─────────────────────────────────────────
       BRANCH DROPDOWN
    ───────────────────────────────────────── */
    branchOpen: false,

    toggleBranch(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('branch-dropdown-menu');
        if (!menu) return;
        this.branchOpen = !this.branchOpen;
        menu.classList.toggle('open', this.branchOpen);
        const arrow = document.querySelector('.branch-arrow');
        if (arrow) arrow.style.transform = this.branchOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    },

    closeBranch() {
        const menu = document.getElementById('branch-dropdown-menu');
        if (!menu) return;
        this.branchOpen = false;
        menu.classList.remove('open');
        const arrow = document.querySelector('.branch-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    },

    selectBranch(value, label) {
        // Update display
        const lbl = document.getElementById('branch-selected-label');
        if (lbl) lbl.textContent = label;

        // Update active states in list
        document.querySelectorAll('.branch-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === value);
        });

        // Close
        this.closeBranch();

        // Sync hidden value and trigger dashboard filter
        if (typeof Dashboard !== 'undefined') {
            Dashboard._selectedBranch = value;
            Dashboard.filterBranch(value);
        }
    },

    /* ─────────────────────────────────────────
       PROFILE MODAL
    ───────────────────────────────────────── */
    showProfile() {
        this.close();
        const usuario  = AuthService.getCurrentUser();
        const isDueno  = usuario && usuario.rol === 'dueño';
        const saved    = this._getSavedProfile();

        const nombre  = saved?.nombre  || (isDueno ? this.OWNER.nombreCompleto : usuario.nombre);
        const email   = saved?.email   || (isDueno ? this.OWNER.email          : '-');
        const celular = saved?.celular || (isDueno ? this.OWNER.celular         : (usuario.celular || ''));
        const rol     = isDueno ? this.OWNER.rol : 'Administrador Sucursal';
        const initials = nombre.split(' ').slice(0,2).map(p => p.charAt(0)).join('').toUpperCase();

        const modal = document.getElementById('profile-modal');
        if (!modal) return;

        // Populate fields
        modal.querySelector('#pm-initials').textContent  = initials;
        modal.querySelector('#pm-role-badge').textContent = rol;
        modal.querySelector('#pm-nombre').value   = nombre;
        modal.querySelector('#pm-email').value    = email;
        modal.querySelector('#pm-celular').value  = celular;
        modal.querySelector('#pm-password').value = '';
        modal.querySelector('#pm-feedback').textContent = '';

        this._openModal('profile-modal');
    },

    saveProfile() {
        const nombre   = document.getElementById('pm-nombre')?.value.trim();
        const email    = document.getElementById('pm-email')?.value.trim();
        const celular  = document.getElementById('pm-celular')?.value.trim();
        const password = document.getElementById('pm-password')?.value;
        const feedback = document.getElementById('pm-feedback');

        // Validate
        if (!nombre) { this._pmFeedback('El nombre es obligatorio.', 'error'); return; }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this._pmFeedback('Ingresa un email válido.', 'error'); return;
        }
        if (password && password.length < 6) {
            this._pmFeedback('La contraseña debe tener mínimo 6 caracteres.', 'error'); return;
        }

        // Save
        const data = { nombre, email, celular };
        if (password) data.password = password;
        localStorage.setItem('anthony_chef_profile', JSON.stringify(data));

        // Update initials in the modal live
        const initials = nombre.split(' ').slice(0,2).map(p => p.charAt(0)).join('').toUpperCase();
        const init = document.getElementById('pm-initials');
        if (init) init.textContent = initials;

        this._pmFeedback('¡Perfil actualizado correctamente!', 'success');
        this.updateUserInfo();
    },

    _pmFeedback(msg, type) {
        const fb = document.getElementById('pm-feedback');
        if (!fb) return;
        fb.textContent = msg;
        fb.className = 'pm-feedback pm-feedback--' + type;
    },

    _getSavedProfile() {
        try {
            const raw = localStorage.getItem('anthony_chef_profile');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },

    /* ─────────────────────────────────────────
       SETTINGS MODAL
    ───────────────────────────────────────── */
    showSettings() {
        this.close();
        const modal = document.getElementById('settings-modal');
        if (!modal) return;
        // Reset to first tab
        this._settingsTab('general');
        this._openModal('settings-modal');
    },

    _settingsTab(tab) {
        document.querySelectorAll('.sm-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.sm-tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.dataset.panel === tab);
        });
    },

    saveSettings() {
        const fb = document.getElementById('sm-feedback');
        if (fb) {
            fb.textContent = '✓ Configuración guardada';
            fb.className   = 'pm-feedback pm-feedback--success';
            setTimeout(() => { fb.textContent = ''; }, 2500);
        }
    },

    /* ─────────────────────────────────────────
       LOGOUT
    ───────────────────────────────────────── */
    logout() {
        this.close();
        Swal.fire({
            title: '¿Cerrar Sesión?',
            text: '¿Estás seguro de que deseas salir del sistema?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Cerrar Sesión',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('anthony_chef_session');
                localStorage.removeItem('anthony_chef_current_user');
                window.location.href = '../index.html';
            }
        });
    },

    /* ─────────────────────────────────────────
       MODAL HELPERS
    ───────────────────────────────────────── */
    _openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    },

    /* ─────────────────────────────────────────
       INJECT MODALS INTO DOM
    ───────────────────────────────────────── */
    _injectModals() {
        if (document.getElementById('profile-modal')) return; // already injected

        const html = `
        <!-- ══════════ PROFILE MODAL ══════════ -->
        <div id="profile-modal" class="ac-modal-overlay" onclick="UserDropdown._overlayClick(event,'profile-modal')">
            <div class="ac-modal" role="dialog" aria-modal="true" aria-label="Mi Perfil">
                <!-- Header -->
                <div class="ac-modal-header">
                    <div class="ac-modal-header-bg"></div>
                    <div class="pm-avatar-wrap">
                        <div class="pm-avatar" id="pm-initials">AB</div>
                    </div>
                    <button class="ac-modal-close" onclick="UserDropdown.closeModal('profile-modal')" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Body -->
                <div class="ac-modal-body">
                    <div class="pm-role-row">
                        <span class="pm-role-badge" id="pm-role-badge">Propietaria / CEO</span>
                    </div>

                    <h2 class="ac-modal-title">Mi Perfil</h2>
                    <p class="ac-modal-sub">Actualiza tu información personal</p>

                    <form onsubmit="event.preventDefault(); UserDropdown.saveProfile();" class="pm-form">
                        <div class="pm-field">
                            <label for="pm-nombre"><i class="fas fa-user"></i> Nombre completo</label>
                            <input type="text" id="pm-nombre" placeholder="Tu nombre completo" autocomplete="name">
                        </div>
                        <div class="pm-field">
                            <label for="pm-email"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="pm-email" placeholder="correo@ejemplo.com" autocomplete="email">
                        </div>
                        <div class="pm-field">
                            <label for="pm-celular"><i class="fas fa-phone"></i> Celular</label>
                            <input type="tel" id="pm-celular" placeholder="3001234567" autocomplete="tel">
                        </div>
                        <div class="pm-field">
                            <label for="pm-password"><i class="fas fa-lock"></i> Nueva contraseña <span class="pm-optional">(opcional)</span></label>
                            <input type="password" id="pm-password" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
                        </div>
                        <div id="pm-feedback" class="pm-feedback"></div>
                        <button type="submit" class="pm-save-btn">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- ══════════ SETTINGS MODAL ══════════ -->
        <div id="settings-modal" class="ac-modal-overlay" onclick="UserDropdown._overlayClick(event,'settings-modal')">
            <div class="ac-modal ac-modal--wide" role="dialog" aria-modal="true" aria-label="Configuración">
                <!-- Header -->
                <div class="ac-modal-header ac-modal-header--settings">
                    <div class="ac-modal-header-bg"></div>
                    <div class="sm-header-icon"><i class="fas fa-cog"></i></div>
                    <button class="ac-modal-close" onclick="UserDropdown.closeModal('settings-modal')" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Body -->
                <div class="ac-modal-body">
                    <h2 class="ac-modal-title">Configuración</h2>
                    <p class="ac-modal-sub">Personaliza tu experiencia en el panel</p>

                    <!-- Tabs -->
                    <div class="sm-tabs">
                        <button class="sm-tab-btn active" data-tab="general" onclick="UserDropdown._settingsTab('general')">
                            <i class="fas fa-sliders-h"></i> General
                        </button>
                        <button class="sm-tab-btn" data-tab="seguridad" onclick="UserDropdown._settingsTab('seguridad')">
                            <i class="fas fa-shield-alt"></i> Seguridad
                        </button>
                        <button class="sm-tab-btn" data-tab="preferencias" onclick="UserDropdown._settingsTab('preferencias')">
                            <i class="fas fa-palette"></i> Preferencias
                        </button>
                    </div>

                    <!-- Panel: General -->
                    <div class="sm-tab-panel active" data-panel="general">
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-bell sm-icon sm-icon--yellow"></i>
                                <div>
                                    <div class="sm-setting-label">Notificaciones</div>
                                    <div class="sm-setting-desc">Alertas de stock, ventas y sistema</div>
                                </div>
                            </div>
                            <label class="sm-toggle">
                                <input type="checkbox" checked>
                                <span class="sm-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-envelope sm-icon sm-icon--blue"></i>
                                <div>
                                    <div class="sm-setting-label">Resumen por email</div>
                                    <div class="sm-setting-desc">Reporte diario de ventas</div>
                                </div>
                            </div>
                            <label class="sm-toggle">
                                <input type="checkbox">
                                <span class="sm-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-language sm-icon sm-icon--green"></i>
                                <div>
                                    <div class="sm-setting-label">Idioma del sistema</div>
                                    <div class="sm-setting-desc">Idioma de la interfaz</div>
                                </div>
                            </div>
                            <select class="sm-select">
                                <option value="es">🇨🇴 Español</option>
                                <option value="en">🇺🇸 English</option>
                            </select>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-clock sm-icon sm-icon--purple"></i>
                                <div>
                                    <div class="sm-setting-label">Zona horaria</div>
                                    <div class="sm-setting-desc">Hora del sistema</div>
                                </div>
                            </div>
                            <select class="sm-select">
                                <option>America/Bogota (GMT-5)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Panel: Seguridad -->
                    <div class="sm-tab-panel" data-panel="seguridad">
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-fingerprint sm-icon sm-icon--blue"></i>
                                <div>
                                    <div class="sm-setting-label">Sesión activa</div>
                                    <div class="sm-setting-desc">Cerrar todas las sesiones activas</div>
                                </div>
                            </div>
                            <button class="sm-action-btn sm-action-btn--danger" onclick="UserDropdown.logout()">
                                Cerrar sesiones
                            </button>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-lock sm-icon sm-icon--yellow"></i>
                                <div>
                                    <div class="sm-setting-label">Autenticación de 2 pasos</div>
                                    <div class="sm-setting-desc">Mayor seguridad en tu cuenta</div>
                                </div>
                            </div>
                            <label class="sm-toggle">
                                <input type="checkbox">
                                <span class="sm-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-history sm-icon sm-icon--green"></i>
                                <div>
                                    <div class="sm-setting-label">Historial de accesos</div>
                                    <div class="sm-setting-desc">Registro de inicio de sesión</div>
                                </div>
                            </div>
                            <button class="sm-action-btn" onclick="UserDropdown._showAccessHistory()">
                                Ver historial
                            </button>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-shield-alt sm-icon sm-icon--purple"></i>
                                <div>
                                    <div class="sm-setting-label">Bloqueo automático</div>
                                    <div class="sm-setting-desc">Inactividad mayor a 30 min</div>
                                </div>
                            </div>
                            <label class="sm-toggle">
                                <input type="checkbox" checked>
                                <span class="sm-toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Panel: Preferencias -->
                    <div class="sm-tab-panel" data-panel="preferencias">
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-moon sm-icon sm-icon--purple"></i>
                                <div>
                                    <div class="sm-setting-label">Tema visual</div>
                                    <div class="sm-setting-desc">Apariencia del panel</div>
                                </div>
                            </div>
                            <div class="sm-theme-btns">
                                <button class="sm-theme-btn sm-theme-btn--active" title="Claro">
                                    <i class="fas fa-sun"></i>
                                </button>
                                <button class="sm-theme-btn" title="Oscuro">
                                    <i class="fas fa-moon"></i>
                                </button>
                            </div>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-compress-arrows-alt sm-icon sm-icon--blue"></i>
                                <div>
                                    <div class="sm-setting-label">Barra lateral compacta</div>
                                    <div class="sm-setting-desc">Mostrar solo íconos</div>
                                </div>
                            </div>
                            <label class="sm-toggle">
                                <input type="checkbox">
                                <span class="sm-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-text-height sm-icon sm-icon--green"></i>
                                <div>
                                    <div class="sm-setting-label">Tamaño de fuente</div>
                                    <div class="sm-setting-desc">Tamaño base del texto</div>
                                </div>
                            </div>
                            <select class="sm-select">
                                <option>Pequeño (14px)</option>
                                <option selected>Normal (16px)</option>
                                <option>Grande (18px)</option>
                            </select>
                        </div>
                        <div class="sm-setting-row">
                            <div class="sm-setting-info">
                                <i class="fas fa-th-large sm-icon sm-icon--yellow"></i>
                                <div>
                                    <div class="sm-setting-label">Tarjetas de métricas</div>
                                    <div class="sm-setting-desc">Animaciones de entrada</div>
                                </div>
                            </div>
                            <label class="sm-toggle">
                                <input type="checkbox" checked>
                                <span class="sm-toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div id="sm-feedback" class="pm-feedback" style="margin-top:8px;"></div>
                    <button class="pm-save-btn" onclick="UserDropdown.saveSettings()">
                        <i class="fas fa-save"></i> Guardar Configuración
                    </button>
                </div>
            </div>
        </div>`;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
    },

    _overlayClick(e, id) {
        if (e.target === e.currentTarget) this.closeModal(id);
    },

    _showAccessHistory() {
        const u = AuthService.getCurrentUser();
        const fecha = u?.fechaAcceso
            ? new Date(u.fechaAcceso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
            : 'No disponible';
        Swal.fire({
            title: 'Historial de Accesos',
            html: `<div style="text-align:left">
                <div style="padding:12px 16px;background:#F8FAFF;border-radius:10px;border:1px solid #E8EDF5;display:flex;justify-content:space-between;">
                    <span style="color:#5A6E8A;font-size:.875rem;">Último acceso</span>
                    <span style="font-weight:600;color:#1A1F36;">${fecha}</span>
                </div>
            </div>`,
            confirmButtonColor: '#0B132B',
            width: '400px'
        });
    }
};

document.addEventListener('DOMContentLoaded', () => UserDropdown.init());
