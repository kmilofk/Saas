/**
 * ========================================
 * ANTHONY CHEF - UI ROLE UTILITIES
 * Utilidades para UI Condicional por Roles
 * ========================================
 */

// ========================================
// CONFIGURACIÓN
// ========================================

const STORAGE_KEYS = {
    CURRENT_USER: 'anthony_chef_current_user'
};

const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    USER: 'user'
};

const ROLE_HIERARCHY = {
    [ROLES.OWNER]: 3,
    [ROLES.ADMIN]: 2,
    [ROLES.USER]: 1
};

// ========================================
// UI ROLE MANAGER
// ========================================

const UIRoleManager = {
    /**
     * Obtiene el usuario actual
     */
    getCurrentUser() {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (user) {
            try {
                return JSON.parse(user);
            } catch (error) {
                console.error('Error al parsear usuario:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * Verifica si el usuario tiene el permiso requerido
     */
    hasPermission(requiredRole) {
        const user = this.getCurrentUser();
        if (!user || !user.role) {
            return false;
        }

        const userLevel = ROLE_HIERARCHY[user.role] || 0;
        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

        return userLevel >= requiredLevel;
    },

    /**
     * MUESTRA ELEMENTOS SEGÚN EL ROL DEL USUARIO
     * Busca elementos con atributo data-role y los muestra/oculta
     * 
     * @param {string} [selector='[data-role]'] - Selector de elementos
     */
    updateConditionalUI(selector = '[data-role]') {
        const user = this.getCurrentUser();
        if (!user) return;

        const elements = document.querySelectorAll(selector);
        
        elements.forEach(el => {
            const requiredRole = el.getAttribute('data-role');
            const requiredRoles = requiredRole.split(',').map(r => r.trim());
            
            // Verificar si el usuario tiene alguno de los roles requeridos
            const hasAccess = requiredRoles.some(role => this.hasPermission(role));
            
            if (hasAccess) {
                el.style.display = '';
                el.classList.remove('hidden-by-role');
            } else {
                el.style.display = 'none';
                el.classList.add('hidden-by-role');
            }
        });
    },

    /**
     * Muestra un elemento si el usuario tiene el rol requerido
     */
    showIfRole(element, requiredRole) {
        if (this.hasPermission(requiredRole)) {
            element.style.display = '';
            element.classList.remove('hidden-by-role');
        } else {
            element.style.display = 'none';
            element.classList.add('hidden-by-role');
        }
    },

    /**
     * Oculta un elemento si el usuario no tiene el rol requerido
     */
    hideIfNotRole(element, requiredRole) {
        this.showIfRole(element, requiredRole);
    },

    /**
     * Aplica clases condicionales según el rol
     * @param {HTMLElement} element - Elemento a modificar
     * @param {string} className - Clase a aplicar
     * @param {string} requiredRole - Rol requerido
     */
    addClassIfRole(element, className, requiredRole) {
        if (this.hasPermission(requiredRole)) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    },

    /**
     * Habilita/deshabilita elementos según el rol
     */
    enableIfRole(element, requiredRole) {
        if (this.hasPermission(requiredRole)) {
            element.disabled = false;
            element.removeAttribute('disabled');
        } else {
            element.disabled = true;
            element.setAttribute('disabled', 'true');
        }
    },

    /**
     * Inicializa la UI condicional en todo el documento
     */
    init() {
        // Actualizar elementos con data-role
        this.updateConditionalUI();
        
        // Actualizar elementos con data-permission
        this.updateConditionalUI('[data-permission]');
        
        // Actualizar elementos con class owner-only (compatibilidad)
        const ownerElements = document.querySelectorAll('.owner-only');
        const hasOwnerAccess = this.hasPermission(ROLES.OWNER);
        
        ownerElements.forEach(el => {
            if (!hasOwnerAccess) {
                el.style.display = 'none';
                el.classList.add('hidden-by-role');
            } else {
                el.style.display = '';
                el.classList.remove('hidden-by-role');
            }
        });

        console.log('UI Role Manager initialized');
    },

    /**
     * Crea un botón condicional según el rol
     * @param {string} html - HTML del botón
     * @param {string} requiredRole - Rol requerido
     * @returns {string|null} - HTML del botón o null si no tiene permiso
     */
    renderButtonIfRole(html, requiredRole) {
        return this.hasPermission(requiredRole) ? html : null;
    },

    /**
     * Renderiza HTML condicionalmente según el rol
     */
    renderIfRole(html, requiredRole) {
        return this.hasPermission(requiredRole) ? html : '';
    }
};

// ========================================
// DIRECTIVAS PERSONALIZADAS (data attributes)
// ========================================

/**
 * Procesa atributos data-* para control de roles
 */
function processRoleDirectives() {
    // data-role: muestra el elemento solo para ciertos roles
    document.querySelectorAll('[data-role]').forEach(el => {
        UIRoleManager.updateConditionalUI();
    });

    // data-role-hide: oculta el elemento para ciertos roles
    document.querySelectorAll('[data-role-hide]').forEach(el => {
        const hiddenRoles = el.getAttribute('data-role-hide').split(',').map(r => r.trim());
        const user = UIRoleManager.getCurrentUser();
        
        if (user && hiddenRoles.includes(user.role)) {
            el.style.display = 'none';
        }
    });

    // data-permission: verifica permisos específicos
    document.querySelectorAll('[data-permission]').forEach(el => {
        const permission = el.getAttribute('data-permission');
        const user = UIRoleManager.getCurrentUser();
        
        if (typeof AuthService !== 'undefined') {
            const hasPermission = AuthService.hasPermission(user, permission);
            el.style.display = hasPermission ? '' : 'none';
        }
    });
}

// ========================================
// ESTILOS PARA ELEMENTOS OCULTOS
// ========================================

/**
 * Inyecta estilos para elementos ocultos por rol
 */
function injectRoleStyles() {
    if (document.getElementById('role-styles')) {
        return;
    }

    const styles = document.createElement('style');
    styles.id = 'role-styles';
    styles.textContent = `
        .hidden-by-role {
            display: none !important;
        }
        
        .disabled-by-role {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;

    document.head.appendChild(styles);
}

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa las utilidades de UI por roles
 */
function initUIRoleUtilities() {
    // Inyectar estilos
    injectRoleStyles();
    
    // Procesar directivas
    processRoleDirectives();
    
    // Inicializar manager
    UIRoleManager.init();
}

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIRoleManager };
}

// Auto-inicializar en navegador
if (typeof window !== 'undefined') {
    window.UIRoleManager = UIRoleManager;
    document.addEventListener('DOMContentLoaded', initUIRoleUtilities);
}
