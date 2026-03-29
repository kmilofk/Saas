/**
 * ========================================
 * ANTHONY CHEF - USER MODEL
 * Modelo de Usuario con Sistema de Roles
 * ========================================
 */

// ========================================
// CONSTANTES Y CONFIGURACIÓN
// ========================================

const USER_STORAGE_KEY = 'anthony_chef_users';

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
// CLASE USER
// ========================================

class User {
    constructor({
        id = null,
        email = '',
        phone = '',
        password = '',
        name = '',
        role = ROLES.USER,
        branchId = null,
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id || this.generateId();
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.name = name;
        this.role = role;
        this.branchId = branchId;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Genera un ID único para el usuario
     */
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Convierte el usuario a objeto plano (sin password)
     */
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }

    /**
     * Valida los datos del usuario
     */
    validate() {
        const errors = [];

        if (!this.email && !this.phone) {
            errors.push('Debe proporcionar email o teléfono');
        }

        if (!this.name) {
            errors.push('El nombre es requerido');
        }

        if (!Object.values(ROLES).includes(this.role)) {
            errors.push('Rol inválido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// ========================================
// USER SERVICE
// ========================================

const UserService = {
    /**
     * Obtiene todos los usuarios desde localStorage
     */
    getAll() {
        const users = localStorage.getItem(USER_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Guarda la colección de usuarios en localStorage
     */
    saveAll(users) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    },

    /**
     * Busca un usuario por ID
     */
    findById(id) {
        const users = this.getAll();
        return users.find(user => user.id === id) || null;
    },

    /**
     * Busca un usuario por email
     */
    findByEmail(email) {
        const users = this.getAll();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    },

    /**
     * Busca un usuario por teléfono
     */
    findByPhone(phone) {
        const users = this.getAll();
        return users.find(user => user.phone === phone) || null;
    },

    /**
     * Busca usuarios por rol
     */
    findByRole(role) {
        const users = this.getAll();
        return users.filter(user => user.role === role);
    },

    /**
     * Busca usuarios por sucursal
     */
    findByBranch(branchId) {
        const users = this.getAll();
        return users.filter(user => user.branchId === branchId);
    },

    /**
     * Crea un nuevo usuario
     */
    create(userData) {
        const users = this.getAll();
        const newUser = new User(userData);

        // Validar que no exista email duplicado
        if (newUser.email) {
            const existingEmail = this.findByEmail(newUser.email);
            if (existingEmail) {
                throw new Error('El email ya está registrado');
            }
        }

        // Validar que no exista teléfono duplicado
        if (newUser.phone) {
            const existingPhone = this.findByPhone(newUser.phone);
            if (existingPhone) {
                throw new Error('El teléfono ya está registrado');
            }
        }

        users.push(newUser);
        this.saveAll(users);
        return newUser.toJSON();
    },

    /**
     * Actualiza un usuario existente
     */
    update(id, userData) {
        const users = this.getAll();
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        // No permitir modificar el rol directamente (debe hacerse mediante servicio especializado)
        const { role, ...updateData } = userData;

        const updatedUser = {
            ...users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        users[userIndex] = updatedUser;
        this.saveAll(users);
        return new User(updatedUser).toJSON();
    },

    /**
     * Elimina un usuario
     */
    delete(id) {
        const users = this.getAll();
        const filteredUsers = users.filter(user => user.id !== id);

        if (filteredUsers.length === users.length) {
            throw new Error('Usuario no encontrado');
        }

        this.saveAll(filteredUsers);
        return true;
    },

    /**
     * Actualiza el rol de un usuario (solo owner puede hacerlo)
     */
    updateRole(userId, newRole, requestedBy) {
        // Validar que el nuevo rol sea válido
        if (!Object.values(ROLES).includes(newRole)) {
            throw new Error('Rol inválido');
        }

        // Validar que quien solicita tenga permisos (debe ser owner)
        if (requestedBy.role !== ROLES.OWNER) {
            throw new Error('No tienes permisos para cambiar roles');
        }

        const users = this.getAll();
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        // No permitir cambiar el rol del owner principal
        if (users[userIndex].role === ROLES.OWNER && userId !== requestedBy.id) {
            throw new Error('No se puede modificar el rol del dueño principal');
        }

        users[userIndex] = {
            ...users[userIndex],
            role: newRole,
            updatedAt: new Date().toISOString()
        };

        this.saveAll(users);
        return new User(users[userIndex]).toJSON();
    }
};

// ========================================
// EXPORTS (para uso en otros módulos)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { User, UserService, ROLES, ROLE_HIERARCHY };
}
