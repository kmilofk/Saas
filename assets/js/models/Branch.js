/**
 * ========================================
 * ANTHONY CHEF - BRANCH MODEL
 * Modelo de Sucursales y Fábrica
 * ========================================
 */

// ========================================
// CONSTANTES Y CONFIGURACIÓN
// ========================================

const BRANCH_STORAGE_KEY = 'anthony_chef_branches';

const BRANCH_TYPES = {
    SUCURSAL: 'sucursal',
    FABRICA: 'fabrica'
};

const BRANCH_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

// ========================================
// CLASE BRANCH
// ========================================

class Branch {
    constructor({
        id = null,
        name = '',
        type = BRANCH_TYPES.SUCURSAL,
        manager = '',
        address = '',
        phone = '',
        email = '',
        status = BRANCH_STATUS.ACTIVE,
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id || this.generateId();
        this.name = name;
        this.type = type;
        this.manager = manager;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Genera un ID único para la sucursal
     */
    generateId() {
        return 'branch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Convierte la sucursal a objeto plano
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            manager: this.manager,
            address: this.address,
            phone: this.phone,
            email: this.email,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Valida los datos de la sucursal
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('El nombre es requerido');
        }

        if (!Object.values(BRANCH_TYPES).includes(this.type)) {
            errors.push('Tipo de ubicación inválido');
        }

        if (!Object.values(BRANCH_STATUS).includes(this.status)) {
            errors.push('Estado inválido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Obtiene el tipo de ubicación como texto
     */
    getTypeLabel() {
        return this.type === BRANCH_TYPES.FABRICA ? 'Fábrica' : 'Sucursal';
    }

    /**
     * Verifica si es una fábrica
     */
    isFactory() {
        return this.type === BRANCH_TYPES.FABRICA;
    }

    /**
     * Verifica si es una sucursal
     */
    isBranch() {
        return this.type === BRANCH_TYPES.SUCURSAL;
    }
}

// ========================================
// BRANCH SERVICE
// ========================================

const BranchService = {
    /**
     * Obtiene todas las ubicaciones desde localStorage
     */
    getAll() {
        const branches = localStorage.getItem(BRANCH_STORAGE_KEY);
        return branches ? JSON.parse(branches) : [];
    },

    /**
     * Guarda la colección de ubicaciones en localStorage
     */
    saveAll(branches) {
        localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branches));
    },

    /**
     * Busca una ubicación por ID
     */
    findById(id) {
        const branches = this.getAll();
        return branches.find(branch => branch.id === id) || null;
    },

    /**
     * Busca ubicaciones por tipo
     */
    findByType(type) {
        const branches = this.getAll();
        return branches.filter(branch => branch.type === type);
    },

    /**
     * Obtiene todas las sucursales
     */
    getAllBranches() {
        return this.findByType(BRANCH_TYPES.SUCURSAL);
    },

    /**
     * Obtiene todas las fábricas
     */
    getAllFactories() {
        return this.findByType(BRANCH_TYPES.FABRICA);
    },

    /**
     * Busca ubicaciones por estado
     */
    findByStatus(status) {
        const branches = this.getAll();
        return branches.filter(branch => branch.status === status);
    },

    /**
     * Busca ubicaciones activas
     */
    getActive() {
        return this.findByStatus(BRANCH_STATUS.ACTIVE);
    },

    /**
     * Busca una ubicación por nombre
     */
    findByName(name) {
        const branches = this.getAll();
        return branches.find(branch =>
            branch.name.toLowerCase() === name.toLowerCase()
        ) || null;
    },

    /**
     * Crea una nueva ubicación
     */
    create(branchData) {
        const branches = this.getAll();
        const newBranch = new Branch(branchData);

        // Validar que no exista nombre duplicado
        const existingBranch = this.findByName(newBranch.name);
        if (existingBranch) {
            throw new Error('Ya existe una ubicación con este nombre');
        }

        // Validar datos
        const validation = newBranch.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        branches.push(newBranch);
        this.saveAll(branches);
        return newBranch.toJSON();
    },

    /**
     * Actualiza una ubicación existente
     */
    update(id, branchData) {
        const branches = this.getAll();
        const branchIndex = branches.findIndex(branch => branch.id === id);

        if (branchIndex === -1) {
            throw new Error('Ubicación no encontrada');
        }

        // Validar que el nuevo nombre no esté duplicado (si se cambia)
        if (branchData.name) {
            const existingBranch = branches.find(
                branch => branch.name.toLowerCase() === branchData.name.toLowerCase() && branch.id !== id
            );
            if (existingBranch) {
                throw new Error('Ya existe una ubicación con este nombre');
            }
        }

        const updatedBranch = {
            ...branches[branchIndex],
            ...branchData,
            updatedAt: new Date().toISOString()
        };

        // Validar datos actualizados
        const tempBranch = new Branch(updatedBranch);
        const validation = tempBranch.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        branches[branchIndex] = updatedBranch;
        this.saveAll(branches);
        return updatedBranch;
    },

    /**
     * Elimina una ubicación (cambio de estado a inactive)
     */
    delete(id) {
        const branches = this.getAll();
        const branchIndex = branches.findIndex(branch => branch.id === id);

        if (branchIndex === -1) {
            throw new Error('Ubicación no encontrada');
        }

        // Eliminación lógica: cambiar estado a inactive
        branches[branchIndex] = {
            ...branches[branchIndex],
            status: BRANCH_STATUS.INACTIVE,
            updatedAt: new Date().toISOString()
        };

        this.saveAll(branches);
        return true;
    },

    /**
     * Elimina físicamente una ubicación
     */
    permanentDelete(id) {
        const branches = this.getAll();
        const filteredBranches = branches.filter(branch => branch.id !== id);

        if (filteredBranches.length === branches.length) {
            throw new Error('Ubicación no encontrada');
        }

        this.saveAll(filteredBranches);
        return true;
    },

    /**
     * Actualiza el encargado de una ubicación
     */
    updateManager(id, managerName) {
        return this.update(id, { manager: managerName });
    },

    /**
     * Obtiene el total de ubicaciones activas
     */
    getActiveCount() {
        return this.getActive().length;
    },

    /**
     * Obtiene el total de sucursales activas
     */
    getBranchCount() {
        return this.getAllBranches().filter(b => b.status === BRANCH_STATUS.ACTIVE).length;
    },

    /**
     * Obtiene el total de fábricas activas
     */
    getFactoryCount() {
        return this.getAllFactories().filter(b => b.status === BRANCH_STATUS.ACTIVE).length;
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Branch, BranchService, BRANCH_TYPES, BRANCH_STATUS };
}
