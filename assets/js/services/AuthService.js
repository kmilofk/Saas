/**
 * ========================================
 * ANTHONY CHEF - AUTH SERVICE
 * Servicio de Autenticación y Permisos
 * ========================================
 */

// ========================================
// CONFIGURACIÓN Y CONSTANTES
// ========================================

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

const STORAGE_KEYS = {
    CURRENT_USER: 'anthony_chef_current_user',
    SESSION: 'anthony_chef_session',
    USERS: 'anthony_chef_users'
};

// ========================================
// AUTH SERVICE
// ========================================

const AuthService = {
    /**
     * Obtiene el usuario actual desde localStorage
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
     * Obtiene la sesión actual
     */
    getSession() {
        const session = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (session) {
            try {
                return JSON.parse(session);
            } catch (error) {
                console.error('Error al parsear sesión:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * Verifica si hay una sesión activa
     */
    isAuthenticated() {
        const user = this.getCurrentUser();
        return user !== null && user.role !== undefined;
    },

    /**
     * Valida que la sesión sea válida y el rol no haya sido modificado
     */
    validateSession() {
        const user = this.getCurrentUser();
        const session = this.getSession();

        if (!user || !session) {
            return { isValid: false, reason: 'No hay sesión activa' };
        }

        // Verificar que el token exista
        if (!session.token) {
            return { isValid: false, reason: 'Token de sesión inválido' };
        }

        // Verificar que el rol en la sesión coincida con el del usuario
        if (user.role !== session.role) {
            return { isValid: false, reason: 'Inconsistencia de rol detectada' };
        }

        // Verificar que el rol sea válido
        if (!Object.values(ROLES).includes(user.role)) {
            return { isValid: false, reason: 'Rol de usuario inválido' };
        }

        // Verificar en la base de datos de usuarios (si existe)
        const storedUser = this.getStoredUserById(user.id);
        if (storedUser) {
            // El rol en sesión debe coincidir con el rol en la base de datos
            if (storedUser.role !== user.role) {
                return { 
                    isValid: false, 
                    reason: 'El rol ha sido modificado',
                    actualRole: storedUser.role
                };
            }
        }

        return { isValid: true };
    },

    /**
     * Obtiene un usuario almacenado por ID
     */
    getStoredUserById(id) {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        if (users) {
            try {
                const usersArray = JSON.parse(users);
                return usersArray.find(u => u.id === id) || null;
            } catch (error) {
                console.error('Error al parsear usuarios:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * VERIFICA SI EL USUARIO TIENE EL PERMISO REQUERIDO
     * Valida si el rol del usuario cumple o supera el nivel requerido
     * 
     * @param {Object} user - Usuario con campo role
     * @param {string} requiredRole - Rol requerido (owner, admin, user)
     * @returns {boolean} - True si tiene permiso, false si no
     */
    hasPermission(user, requiredRole) {
        // Si no hay usuario, no hay permiso
        if (!user || !user.role) {
            return false;
        }

        // Obtener nivel del usuario y nivel requerido
        const userLevel = ROLE_HIERARCHY[user.role] || 0;
        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

        // El usuario tiene permiso si su nivel es igual o superior al requerido
        return userLevel >= requiredLevel;
    },

    /**
     * Verifica si el usuario tiene exactamente el rol especificado
     */
    hasRole(user, role) {
        return user && user.role === role;
    },

    /**
     * Verifica si el usuario es Owner
     */
    isOwner(user) {
        return this.hasRole(user, ROLES.OWNER);
    },

    /**
     * Verifica si el usuario es Admin (o Owner)
     */
    isAdminOrHigher(user) {
        return this.hasPermission(user, ROLES.ADMIN);
    },

    /**
     * Obtiene el nivel del rol del usuario
     */
    getRoleLevel(user) {
        if (!user || !user.role) {
            return 0;
        }
        return ROLE_HIERARCHY[user.role] || 0;
    },

    /**
     * Verifica permisos para una acción específica
     * @param {string} action - Acción a realizar (ej: 'create', 'edit', 'delete')
     * @param {string} resource - Recurso sobre el cual actuar (ej: 'user', 'branch')
     * @returns {boolean}
     */
    can(user, action, resource) {
        if (!user || !user.role) {
            return false;
        }

        // Owner tiene todos los permisos
        if (user.role === ROLES.OWNER) {
            return true;
        }

        // Admin puede hacer todo excepto gestionar owners y sucursales
        if (user.role === ROLES.ADMIN) {
            if (resource === 'user' && action === 'delete') {
                return false; // Admin no puede eliminar usuarios
            }
            if (resource === 'branch') {
                return false; // Admin no puede gestionar sucursales
            }
            return true;
        }

        // User solo tiene permisos básicos
        if (user.role === ROLES.USER) {
            return ['read'].includes(action);
        }

        return false;
    },

    /**
     * Guarda la sesión del usuario
     */
    saveSession(user) {
        const sessionData = {
            id: user.id,
            email: user.email || user.phone,
            role: user.role,
            name: user.name,
            branchId: user.branchId || null,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
            ...sessionData,
            token: this.generateToken()
        }));
    },

    /**
     * Genera un token para la sesión
     */
    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2) + '_' + Date.now();
    },

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthService, ROLES, ROLE_HIERARCHY };
}
