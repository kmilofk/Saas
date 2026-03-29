/**
 * ========================================
 * ANTHONY CHEF - ADMIN SERVICE
 * Servicio de Gestión de Administradores
 * ========================================
 * Solo el Owner puede crear, editar o eliminar administradores
 * Cada admin está asignado a una sucursal específica
 */

// ========================================
// CONFIGURACIÓN Y CONSTANTES
// ========================================

const ADMIN_CONFIG = {
    MAX_ADMINS_PER_BRANCH: 1, // 1 admin por sucursal (configurable)
    DEFAULT_PASSWORD: '1234',
    STORAGE_KEYS: {
        USERS: 'anthony_chef_users',
        BRANCHES: 'anthony_chef_branches',
        CURRENT_USER: 'anthony_chef_current_user'
    }
};

const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    USER: 'user'
};

// ========================================
// ADMIN SERVICE
// ========================================

const AdminService = {
    /**
     * Obtiene todos los usuarios desde localStorage
     */
    _getUsers() {
        const users = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Guarda la colección de usuarios en localStorage
     */
    _saveUsers(users) {
        localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    /**
     * Obtiene todas las sucursales desde localStorage
     */
    _getBranches() {
        if (typeof BranchService !== 'undefined') {
            return BranchService.getAll();
        }
        const branches = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.BRANCHES);
        return branches ? JSON.parse(branches) : [];
    },

    /**
     * Obtiene el usuario actual
     */
    _getCurrentUser() {
        const user = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.CURRENT_USER);
        if (user) {
            try {
                return JSON.parse(user);
            } catch (error) {
                return null;
            }
        }
        return null;
    },

    /**
     * Verifica si el usuario actual es Owner
     */
    _isOwner() {
        const user = this._getCurrentUser();
        return user && user.role === ROLES.OWNER;
    },

    /**
     * VALIDA PERMISOS: Solo owner puede gestionar admins
     */
    _validateOwnerPermission() {
        if (!this._isOwner()) {
            throw new Error('Solo el dueño puede gestionar administradores');
        }
        return true;
    },

    /**
     * Obtiene todos los administradores
     */
    getAllAdmins() {
        const users = this._getUsers();
        return users.filter(user => user.role === ROLES.ADMIN);
    },

    /**
     * Obtiene administradores activos
     */
    getActiveAdmins() {
        const admins = this.getAllAdmins();
        return admins.filter(admin => admin.status !== 'inactive');
    },

    /**
     * Busca un admin por ID
     */
    findById(id) {
        const users = this._getUsers();
        return users.find(user => user.id === id && user.role === ROLES.ADMIN) || null;
    },

    /**
     * Busca admin por email
     */
    findByEmail(email) {
        const users = this._getUsers();
        return users.find(user => 
            user.email?.toLowerCase() === email.toLowerCase() && user.role === ROLES.ADMIN
        ) || null;
    },

    /**
     * Obtiene el admin asignado a una sucursal
     */
    findByBranch(branchId) {
        const users = this._getUsers();
        return users.filter(user => 
            user.role === ROLES.ADMIN && user.branchId === branchId
        );
    },

    /**
     * VERIFICA si una sucursal ya tiene admin asignado
     */
    branchHasAdmin(branchId) {
        const admins = this.findByBranch(branchId);
        return admins.length >= ADMIN_CONFIG.MAX_ADMINS_PER_BRANCH;
    },

    /**
     * Obtiene sucursales sin admin asignado
     */
    getBranchesWithoutAdmin() {
        const branches = this._getBranches();
        return branches.filter(branch => {
            const hasAdmin = this.branchHasAdmin(branch.id);
            return !hasAdmin && branch.type === 'sucursal';
        });
    },

    /**
     * Obtiene sucursales con admin asignado
     */
    getBranchesWithAdmin() {
        const branches = this._getBranches();
        return branches.filter(branch => {
            const hasAdmin = this.branchHasAdmin(branch.id);
            return hasAdmin;
        });
    },

    /**
     * VALIDA: 1 admin por sucursal
     */
    validateBranchAssignment(branchId, excludeAdminId = null) {
        if (this.branchHasAdmin(branchId)) {
            // Verificar si el admin existente es el mismo que se está editando
            const existingAdmins = this.findByBranch(branchId);
            const isSameAdmin = existingAdmins.some(admin => admin.id === excludeAdminId);
            
            if (!isSameAdmin) {
                const branch = this._getBranches().find(b => b.id === branchId);
                throw new Error(
                    `La sucursal "${branch?.name || branchId}" ya tiene un administrador asignado. ` +
                    `Máximo permitido: ${ADMIN_CONFIG.MAX_ADMINS_PER_BRANCH}`
                );
            }
        }
        return true;
    },

    /**
     * CREA un nuevo administrador
     * @param {Object} adminData - Datos del admin
     * @param {string} adminData.name - Nombre completo
     * @param {string} adminData.email - Email único
     * @param {string} adminData.phone - Teléfono
     * @param {string} adminData.branchId - ID de sucursal asignada
     * @param {string} [adminData.password] - Contraseña (opcional, usa default si no se proporciona)
     */
    create(adminData) {
        // Validar permisos de owner
        this._validateOwnerPermission();

        const users = this._getUsers();

        // Validaciones
        if (!adminData.name || !adminData.email || !adminData.branchId) {
            throw new Error('Nombre, email y sucursal son requeridos');
        }

        // Verificar email duplicado
        const existingEmail = users.find(u => 
            u.email?.toLowerCase() === adminData.email.toLowerCase()
        );
        if (existingEmail) {
            throw new Error('El email ya está registrado');
        }

        // Verificar teléfono duplicado (si se proporciona)
        if (adminData.phone) {
            const existingPhone = users.find(u => u.phone === adminData.phone);
            if (existingPhone) {
                throw new Error('El teléfono ya está registrado');
            }
        }

        // Validar que la sucursal no tenga admin (1 admin por sucursal)
        this.validateBranchAssignment(adminData.branchId);

        // Verificar que la sucursal existe
        const branches = this._getBranches();
        const branch = branches.find(b => b.id === adminData.branchId);
        if (!branch) {
            throw new Error('La sucursal asignada no existe');
        }

        // Crear nuevo admin
        const newAdmin = {
            id: 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: adminData.name,
            email: adminData.email,
            phone: adminData.phone || '',
            password: adminData.password || ADMIN_CONFIG.DEFAULT_PASSWORD,
            role: ROLES.ADMIN,
            branchId: adminData.branchId,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newAdmin);
        this._saveUsers(users);

        console.log(`✅ Administrador creado: ${newAdmin.name} (${newAdmin.email})`);
        return newAdmin;
    },

    /**
     * ACTUALIZA un administrador existente
     * @param {string} id - ID del admin
     * @param {Object} updateData - Datos a actualizar
     */
    update(id, updateData) {
        // Validar permisos de owner
        this._validateOwnerPermission();

        const users = this._getUsers();
        const adminIndex = users.findIndex(user => user.id === id && user.role === ROLES.ADMIN);

        if (adminIndex === -1) {
            throw new Error('Administrador no encontrado');
        }

        // Validar email duplicado (si se cambia)
        if (updateData.email) {
            const existingEmail = users.find(u => 
                u.email?.toLowerCase() === updateData.email.toLowerCase() && u.id !== id
            );
            if (existingEmail) {
                throw new Error('El email ya está registrado');
            }
        }

        // Validar sucursal (1 admin por sucursal)
        if (updateData.branchId) {
            this.validateBranchAssignment(updateData.branchId, id);
        }

        // Actualizar datos
        users[adminIndex] = {
            ...users[adminIndex],
            ...updateData,
            // No permitir cambiar rol
            role: ROLES.ADMIN,
            updatedAt: new Date().toISOString()
        };

        this._saveUsers(users);

        console.log(`✅ Administrador actualizado: ${users[adminIndex].name}`);
        return users[adminIndex];
    },

    /**
     * ELIMINA un administrador (eliminación lógica)
     */
    delete(id) {
        // Validar permisos de owner
        this._validateOwnerPermission();

        const users = this._getUsers();
        const adminIndex = users.findIndex(user => user.id === id && user.role === ROLES.ADMIN);

        if (adminIndex === -1) {
            throw new Error('Administrador no encontrado');
        }

        // Eliminación lógica: cambiar status a inactive
        users[adminIndex] = {
            ...users[adminIndex],
            status: 'inactive',
            updatedAt: new Date().toISOString()
        };

        this._saveUsers(users);

        console.log(`✅ Administrador eliminado: ${users[adminIndex].name}`);
        return true;
    },

    /**
     * Elimina físicamente un administrador
     */
    permanentDelete(id) {
        // Validar permisos de owner
        this._validateOwnerPermission();

        const users = this._getUsers();
        const filteredUsers = users.filter(user => user.id !== id);

        if (filteredUsers.length === users.length) {
            throw new Error('Administrador no encontrado');
        }

        this._saveUsers(filteredUsers);

        console.log(`✅ Administrador eliminado permanentemente: ${id}`);
        return true;
    },

    /**
     * CAMBIA la sucursal asignada a un admin
     */
    reassignBranch(adminId, newBranchId) {
        return this.update(adminId, { branchId: newBranchId });
    },

    /**
     * RESTABLECE la contraseña de un admin
     */
    resetPassword(adminId, newPassword = ADMIN_CONFIG.DEFAULT_PASSWORD) {
        // Validar permisos de owner
        this._validateOwnerPermission();

        const users = this._getUsers();
        const adminIndex = users.findIndex(user => user.id === adminId && user.role === ROLES.ADMIN);

        if (adminIndex === -1) {
            throw new Error('Administrador no encontrado');
        }

        users[adminIndex] = {
            ...users[adminIndex],
            password: newPassword,
            updatedAt: new Date().toISOString()
        };

        this._saveUsers(users);

        console.log(`✅ Contraseña restablecida para: ${users[adminIndex].name}`);
        return true;
    },

    /**
     * Obtiene estadísticas de administradores
     */
    getStats() {
        const admins = this.getAllAdmins();
        const activeAdmins = admins.filter(a => a.status === 'active');
        const branchesWithAdmin = new Set(admins.map(a => a.branchId)).size;
        const branchesWithoutAdmin = this.getBranchesWithoutAdmin().length;

        return {
            total: admins.length,
            active: activeAdmins.length,
            inactive: admins.length - activeAdmins.length,
            branchesWithAdmin,
            branchesWithoutAdmin,
            maxPerBranch: ADMIN_CONFIG.MAX_ADMINS_PER_BRANCH
        };
    },

    /**
     * Obtiene la configuración actual
     */
    getConfig() {
        return { ...ADMIN_CONFIG };
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminService, ADMIN_CONFIG };
}

// Auto-inicializar en navegador
if (typeof window !== 'undefined') {
    window.AdminService = AdminService;
    window.ADMIN_CONFIG = ADMIN_CONFIG;
}
