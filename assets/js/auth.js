/**
 * ANTHONY CHEF - AUTH SERVICE
 * Sistema de Autenticación Completo
 */

const AuthService = {
    // Credenciales predefinidas
    CREDENTIALS: {
        DUENO: {
            celular: '3001234567',
            contraseña: 'dueno123',
            nombre: 'Angelica Buitrago',
            rol: 'dueño'
        },
        ADMINISTRADOR: {
            celular: '3007654321',
            contraseña: 'admin123',
            nombre: 'Administrador',
            rol: 'administrador'
        }
    },

    // Claves para localStorage
    STORAGE_KEYS: {
        SESSION: 'anthony_chef_session',
        CURRENT_USER: 'anthony_chef_current_user'
    },

    /**
     * Valida las credenciales del usuario
     * @param {string} celular - Número de celular
     * @param {string} contraseña - Contraseña
     * @returns {object|null} - Usuario autenticado o null
     */
    login(celular, contraseña) {
        const credenciales = this.CREDENTIALS;

        // Verificar Dueño
        if (celular === credenciales.DUENO.celular && contraseña === credenciales.DUENO.contraseña) {
            return {
                celular: credenciales.DUENO.celular,
                nombre: credenciales.DUENO.nombre,
                rol: credenciales.DUENO.rol,
                fechaAcceso: new Date().toISOString()
            };
        }

        // Verificar Administrador
        if (celular === credenciales.ADMINISTRADOR.celular && contraseña === credenciales.ADMINISTRADOR.contraseña) {
            return {
                celular: credenciales.ADMINISTRADOR.celular,
                nombre: credenciales.ADMINISTRADOR.nombre,
                rol: credenciales.ADMINISTRADOR.rol,
                fechaAcceso: new Date().toISOString()
            };
        }

        return null;
    },

    /**
     * Guarda la sesión en localStorage
     * @param {object} usuario - Datos del usuario
     */
    guardarSesion(usuario) {
        localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify({
            activa: true,
            fechaInicio: new Date().toISOString()
        }));
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(usuario));
    },

    /**
     * Verifica si existe una sesión activa
     * @returns {boolean}
     */
    isAuthenticated() {
        const session = localStorage.getItem(this.STORAGE_KEYS.SESSION);
        return session !== null;
    },

    /**
     * Obtiene el usuario actual
     * @returns {object|null}
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Verifica la sesión y redirige si no está autenticado
     * @returns {boolean}
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }
        return true;
    },

    /**
     * Cierra la sesión y redirige al login
     */
    logout() {
        localStorage.removeItem(this.STORAGE_KEYS.SESSION);
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
        window.location.href = '../index.html';
    },

    /**
     * Verifica si el usuario es dueño
     * @returns {boolean}
     */
    isDueno() {
        const usuario = this.getCurrentUser();
        return usuario && usuario.rol === 'dueño';
    },

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean}
     */
    isAdmin() {
        const usuario = this.getCurrentUser();
        return usuario && usuario.rol === 'administrador';
    },

    /**
     * Valida que el celular tenga al menos 10 dígitos
     * @param {string} celular
     * @returns {boolean}
     */
    validarCelular(celular) {
        const soloNumeros = celular.replace(/\D/g, '');
        return soloNumeros.length >= 10;
    },

    /**
     * Valida que un campo no esté vacío
     * @param {string} valor
     * @returns {boolean}
     */
    validarCampoRequerido(valor) {
        return valor && valor.trim() !== '';
    }
};

// Función global para logout desde el sidebar
function logout() {
    AuthService.logout();
}

/**
 * Verifica la sesión al cargar cualquier página del panel
 */
function verificarSesion() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

/**
 * Actualiza la información del usuario en el dropdown
 */
function actualizarInfoUsuario() {
    const usuario = AuthService.getCurrentUser();
    if (!usuario) return;

    // Actualizar avatar con iniciales (primera letra del primer nombre y apellido)
    const avatarElements = document.querySelectorAll('.user-dropdown-avatar');
    avatarElements.forEach(avatar => {
        const partes = usuario.nombre.split(' ');
        const iniciales = (partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '');
        avatar.textContent = iniciales.toUpperCase();
    });

    // Actualizar nombre y rol
    const nombreElements = document.querySelectorAll('.user-dropdown-name');
    nombreElements.forEach(nombre => {
        nombre.textContent = usuario.nombre;
    });

    const rolElements = document.querySelectorAll('.user-dropdown-role');
    rolElements.forEach(rol => {
        rol.textContent = usuario.rol === 'dueño' ? 'Administrador General' : 'Administrador';
    });
}

/**
 * Aplica restricciones según el rol del usuario
 */
function aplicarRestriccionesPorRol() {
    const usuario = AuthService.getCurrentUser();
    if (!usuario) return;

    // Si es administrador, ocultar elementos restringidos
    if (usuario.rol === 'administrador') {
        // Ocultar botones de eliminar en sucursales
        const botonesEliminar = document.querySelectorAll('.btn-branch-delete');
        botonesEliminar.forEach(boton => {
            boton.closest('.branch-actions') && (boton.style.display = 'none');
        });

        // Ocultar botón de Nueva Sucursal si existe
        const btnNuevaSucursal = document.querySelector('.btn[onclick*="Sucursales.openModal"]');
        if (btnNuevaSucursal) {
            btnNuevaSucursal.style.display = 'none';
        }
    }
}
