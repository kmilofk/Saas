/**
 * ========================================
 * ANTHONY CHEF - ROLE MIDDLEWARE
 * Middleware de Protección de Rutas por Roles
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
    SESSION: 'anthony_chef_session'
};

const REDIRECT_URL = 'index.html';

// ========================================
// MIDDLEWARE FUNCTIONS
// ========================================

const RoleMiddleware = {
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
     * Verifica si el usuario tiene sesión activa
     */
    isAuthenticated() {
        const user = this.getCurrentUser();
        return user !== null && user.role !== undefined;
    },

    /**
     * GENERA UN MIDDLEWARE QUE PERMITE EL ACCESO SOLO A ROLES ESPECÍFICOS
     * 
     * @param  {...string} roles - Roles permitidos (ej: 'owner', 'admin')
     * @returns {Function} - Función middleware que verifica permisos
     */
    allowRoles(...roles) {
        return function() {
            const user = RoleMiddleware.getCurrentUser();

            // Verificar autenticación
            if (!user || !user.role) {
                console.warn('Usuario no autenticado, redirigiendo al login...');
                window.location.href = REDIRECT_URL;
                return false;
            }

            // Verificar si el rol del usuario está en los roles permitidos
            // o si tiene un nivel superior
            const userLevel = ROLE_HIERARCHY[user.role] || 0;
            const minRequiredLevel = Math.min(
                ...roles.map(role => ROLE_HIERARCHY[role] || 0)
            );

            if (userLevel < minRequiredLevel) {
                console.warn(`Acceso denegado. Rol requerido: ${roles.join(' o ')}, Rol actual: ${user.role}`);
                
                // Redirigir a página de acceso denegado o dashboard
                if (window.location.pathname.includes('app.html')) {
                    // Mostrar mensaje de acceso denegado
                    RoleMiddleware.showAccessDenied();
                } else {
                    window.location.href = REDIRECT_URL;
                }
                return false;
            }

            console.log(`Acceso permitido para rol: ${user.role}`);
            return true;
        };
    },

    /**
     * Middleware específico para Owner
     */
    requireOwner() {
        return this.allowRoles(ROLES.OWNER);
    },

    /**
     * Middleware específico para Admin o superior
     */
    requireAdmin() {
        return this.allowRoles(ROLES.ADMIN, ROLES.OWNER);
    },

    /**
     * Middleware para cualquier usuario autenticado
     */
    requireAuth() {
        return function() {
            if (!RoleMiddleware.isAuthenticated()) {
                console.warn('Usuario no autenticado, redirigiendo al login...');
                window.location.href = REDIRECT_URL;
                return false;
            }
            return true;
        };
    },

    /**
     * Verifica permisos para una ruta específica
     * @param {string} route - Ruta a verificar (ej: '/admin', '/sucursales')
     */
    protectRoute(route) {
        const user = this.getCurrentUser();

        if (!user) {
            window.location.href = REDIRECT_URL;
            return false;
        }

        // Rutas que solo el owner puede acceder
        const ownerOnlyRoutes = ['/admin', '/sucursales', '/fabrica', '/configuracion-global'];
        
        if (ownerOnlyRoutes.includes(route)) {
            if (user.role !== ROLES.OWNER) {
                console.warn(`Acceso denegado a ${route} para rol: ${user.role}`);
                this.showAccessDenied();
                return false;
            }
        }

        return true;
    },

    /**
     * Muestra mensaje de acceso denegado
     */
    showAccessDenied() {
        // Crear overlay de acceso denegado si no existe
        let overlay = document.getElementById('access-denied-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'access-denied-overlay';
            overlay.className = 'access-denied-overlay';
            overlay.innerHTML = `
                <div class="access-denied-content">
                    <div class="access-denied-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2 class="access-denied-title">Acceso Denegado</h2>
                    <p class="access-denied-text">No tienes permisos para acceder a esta sección</p>
                    <button class="access-denied-btn" onclick="RoleMiddleware.closeAccessDenied()">
                        <i class="fas fa-arrow-left"></i>
                        Volver al Dashboard
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Cierra el overlay de acceso denegado
     */
    closeAccessDenied() {
        const overlay = document.getElementById('access-denied-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Navegar al dashboard
        const dashboardLink = document.querySelector('.nav-link[data-module="dashboard"]');
        if (dashboardLink) {
            dashboardLink.click();
        }
    },

    /**
     * Aplica protección de rutas basado en la configuración
     * @param {Object} routesConfig - Configuración de rutas y roles requeridos
     */
    applyRouteProtection(routesConfig) {
        // routesConfig ejemplo:
        // {
        //     '/sucursales': ['owner'],
        //     '/fabrica': ['owner'],
        //     '/admin': ['owner', 'admin']
        // }
        
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        for (const [route, requiredRoles] of Object.entries(routesConfig)) {
            if (currentPath.includes(route) || currentHash.includes(route)) {
                const user = this.getCurrentUser();
                if (user && requiredRoles.length > 0) {
                    const userLevel = ROLE_HIERARCHY[user.role] || 0;
                    const minRequiredLevel = Math.min(
                        ...requiredRoles.map(role => ROLE_HIERARCHY[role] || 0)
                    );
                    
                    if (userLevel < minRequiredLevel) {
                        this.showAccessDenied();
                        return false;
                    }
                }
            }
        }
        
        return true;
    },

    /**
     * Verifica y actualiza el rol del usuario desde la sesión
     * Previene modificación del rol desde el cliente
     */
    syncUserRole() {
        const user = this.getCurrentUser();
        const session = localStorage.getItem(STORAGE_KEYS.SESSION);
        
        if (!user || !session) {
            return null;
        }

        try {
            const sessionData = JSON.parse(session);
            
            // Verificar consistencia entre user y session
            if (user.role !== sessionData.role) {
                console.warn('Inconsistencia de rol detectada, usando rol de sesión...');
                // Actualizar user con el rol de sesión (más seguro)
                user.role = sessionData.role;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            }
            
            return user;
        } catch (error) {
            console.error('Error al sincronizar rol:', error);
            return user;
        }
    }
};

// ========================================
// ESTILOS PARA OVERLAY DE ACCESO DENEGADO
// ========================================

/**
 * Inyecta estilos CSS para el overlay de acceso denegado
 */
function injectAccessDeniedStyles() {
    if (document.getElementById('access-denied-styles')) {
        return;
    }

    const styles = document.createElement('style');
    styles.id = 'access-denied-styles';
    styles.textContent = `
        .access-denied-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .access-denied-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .access-denied-content {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 3rem;
            border-radius: 1.5rem;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 400px;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .access-denied-overlay.active .access-denied-content {
            transform: scale(1);
        }

        .access-denied-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2.5rem;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .access-denied-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.75rem;
        }

        .access-denied-text {
            color: #64748b;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .access-denied-btn {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            padding: 0.875rem 2rem;
            border-radius: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .access-denied-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5);
        }

        .dark-mode .access-denied-content {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }

        .dark-mode .access-denied-title {
            color: #f1f5f9;
        }

        .dark-mode .access-denied-text {
            color: #94a3b8;
        }
    `;

    document.head.appendChild(styles);
}

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa el middleware de roles
 */
function initRoleMiddleware() {
    // Inyectar estilos
    injectAccessDeniedStyles();

    // Sincronizar rol del usuario
    RoleMiddleware.syncUserRole();

    console.log('Role Middleware initialized');
}

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RoleMiddleware, ROLES, ROLE_HIERARCHY };
}

// Auto-inicializar en navegador
if (typeof window !== 'undefined') {
    window.RoleMiddleware = RoleMiddleware;
    document.addEventListener('DOMContentLoaded', initRoleMiddleware);
}
