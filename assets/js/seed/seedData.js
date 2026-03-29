/**
 * ========================================
 * ANTHONY CHEF - SEED DATA
 * Datos Iniciales del Sistema
 * ========================================
 * Este script inicializa los datos básicos del sistema:
 * - Dueña principal: Angelica Alejandra Buitrago Rojas
 * - Sucursales: San Cayetano, Universidad Icesi
 * - Fábrica: Fábrica Principal
 * - Encargados por ubicación
 */

// ========================================
// CONFIGURACIÓN
// ========================================

const SEED_CONFIG = {
    STORAGE_KEYS: {
        USERS: 'anthony_chef_users',
        BRANCHES: 'anthony_chef_branches',
        CURRENT_USER: 'anthony_chef_current_user',
        SESSION: 'anthony_chef_session'
    },
    CREDENTIALS: {
        OWNER: {
            phone: '3001234567',
            password: 'admin123'
        }
    }
};

// ========================================
// DATOS DE SUCURSALES Y FÁBRICA
// ========================================

const BRANCHES_DATA = [
    {
        id: 'branch_san_cayetano',
        name: 'Sucursal San Cayetano',
        type: 'sucursal',
        manager: '', // Pendiente por asignar
        address: 'San Cayetano, Bogotá',
        phone: '3001111111',
        email: 'sancayetano@anthonychef.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'branch_icesi',
        name: 'Sucursal Universidad Icesi',
        type: 'sucursal',
        manager: 'Thania Ortiz',
        address: 'Universidad Icesi, Cali',
        phone: '3002222222',
        email: 'icesi@anthonychef.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'branch_fabrica_principal',
        name: 'Fábrica Principal',
        type: 'fabrica',
        manager: 'Kevin Esteban Rojas',
        address: 'Zona Industrial, Bogotá',
        phone: '3003333333',
        email: 'fabrica@anthonychef.com',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// ========================================
// DATOS DE USUARIOS
// ========================================

const USERS_DATA = [
    {
        id: 'owner_001',
        name: 'Angelica Alejandra Buitrago Rojas',
        email: 'angelica.buitrago@anthonychef.com',
        phone: SEED_CONFIG.CREDENTIALS.OWNER.phone,
        password: SEED_CONFIG.CREDENTIALS.OWNER.password,
        role: 'owner',
        branchId: null, // La dueña tiene acceso a todas las sucursales
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'admin_icesi',
        name: 'Thania Ortiz',
        email: 'thania.ortiz@anthonychef.com',
        phone: '3004444444',
        password: '1234',
        role: 'admin',
        branchId: 'branch_icesi', // Asignada a Sucursal Universidad Icesi
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'admin_fabrica',
        name: 'Kevin Esteban Rojas',
        email: 'kevin.rojas@anthonychef.com',
        phone: '3005555555',
        password: '1234',
        role: 'admin',
        branchId: 'branch_fabrica_principal', // Asignado a Fábrica Principal
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// ========================================
// FUNCIONES DE SEED
// ========================================

const SeedData = {
    /**
     * Verifica si los datos ya han sido inicializados
     */
    isSeeded() {
        const users = localStorage.getItem(SEED_CONFIG.STORAGE_KEYS.USERS);
        const branches = localStorage.getItem(SEED_CONFIG.STORAGE_KEYS.BRANCHES);
        
        // Si ya existen datos, no hacer seed (para no sobreescribir)
        return users !== null && branches !== null;
    },

    /**
     * Inicializa los datos de sucursales
     */
    seedBranches() {
        console.log('Inicializando sucursales y fábrica...');
        
        try {
            // Verificar si ya existen datos
            const existingBranches = localStorage.getItem(SEED_CONFIG.STORAGE_KEYS.BRANCHES);
            if (existingBranches && JSON.parse(existingBranches).length > 0) {
                console.log('Las sucursales ya existen, saltando seed...');
                return JSON.parse(existingBranches);
            }

            // Guardar datos iniciales
            localStorage.setItem(SEED_CONFIG.STORAGE_KEYS.BRANCHES, JSON.stringify(BRANCHES_DATA));
            console.log('✅ Sucursales inicializadas correctamente');
            return BRANCHES_DATA;
        } catch (error) {
            console.error('Error al inicializar sucursales:', error);
            return [];
        }
    },

    /**
     * Inicializa los datos de usuarios
     */
    seedUsers() {
        console.log('Inicializando usuarios...');
        
        try {
            // Verificar si ya existen datos
            const existingUsers = localStorage.getItem(SEED_CONFIG.STORAGE_KEYS.USERS);
            if (existingUsers && JSON.parse(existingUsers).length > 0) {
                console.log('Los usuarios ya existen, saltando seed...');
                return JSON.parse(existingUsers);
            }

            // Guardar datos iniciales
            localStorage.setItem(SEED_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(USERS_DATA));
            console.log('✅ Usuarios inicializados correctamente');
            return USERS_DATA;
        } catch (error) {
            console.error('Error al inicializar usuarios:', error);
            return [];
        }
    },

    /**
     * Inicializa todos los datos del sistema
     */
    seedAll() {
        console.log('🌱 Iniciando seed de datos del sistema...');
        
        const branches = this.seedBranches();
        const users = this.seedUsers();

        console.log('🎉 Seed completado exitosamente');
        console.log('📊 Resumen:');
        console.log(`   - Sucursales/Fábrica: ${branches.length}`);
        console.log(`   - Usuarios: ${users.length}`);
        console.log(`   - Dueña: ${users.find(u => u.role === 'owner')?.name || 'No encontrada'}`);

        return {
            branches,
            users,
            success: true
        };
    },

    /**
     * Reinicia los datos (eliminar y volver a crear)
     * ⚠️ ADVERTENCIA: Esto eliminará todos los datos existentes
     */
    reset() {
        console.warn('⚠️ RESETEANDO DATOS DEL SISTEMA...');
        
        localStorage.removeItem(SEED_CONFIG.STORAGE_KEYS.USERS);
        localStorage.removeItem(SEED_CONFIG.STORAGE_KEYS.BRANCHES);
        // No eliminar sesión actual para no cerrar al usuario
        
        return this.seedAll();
    },

    /**
     * Obtiene los datos seedeados
     */
    getData() {
        const branches = localStorage.getItem(SEED_CONFIG.STORAGE_KEYS.BRANCHES);
        const users = localStorage.getItem(SEED_CONFIG.STORAGE_KEYS.USERS);

        return {
            branches: branches ? JSON.parse(branches) : [],
            users: users ? JSON.parse(users) : []
        };
    },

    /**
     * Actualiza el encargado de una sucursal
     */
    updateBranchManager(branchId, managerName) {
        const data = this.getData();
        const branchIndex = data.branches.findIndex(b => b.id === branchId);

        if (branchIndex === -1) {
            console.error('Sucursal no encontrada');
            return false;
        }

        data.branches[branchIndex].manager = managerName;
        data.branches[branchIndex].updatedAt = new Date().toISOString();

        localStorage.setItem(SEED_CONFIG.STORAGE_KEYS.BRANCHES, JSON.stringify(data.branches));
        console.log(`✅ Encargado actualizado: ${managerName} en ${data.branches[branchIndex].name}`);
        return true;
    },

    /**
     * Obtiene la información de la dueña
     */
    getOwnerData() {
        const data = this.getData();
        return data.users.find(u => u.role === 'owner') || null;
    },

    /**
     * Obtiene las credenciales de la dueña para login
     */
    getOwnerCredentials() {
        return {
            phone: SEED_CONFIG.CREDENTIALS.OWNER.phone,
            password: SEED_CONFIG.CREDENTIALS.OWNER.password
        };
    }
};

// ========================================
// ACTUALIZAR CREDENTIALS EN LOGIN.JS
// ========================================

/**
 * Actualiza las credenciales hardcodeadas en el login
 * para que coincidan con los datos seedeados
 */
function updateLoginCredentials() {
    if (typeof CREDENTIALS !== 'undefined') {
        CREDENTIALS.OWNER = {
            phone: SEED_CONFIG.CREDENTIALS.OWNER.phone,
            password: SEED_CONFIG.CREDENTIALS.OWNER.password,
            role: 'owner'
        };
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

/**
 * Inicializa los datos cuando se carga el sistema
 */
function initSeedData() {
    // Solo hacer seed si no existen datos
    if (!SeedData.isSeeded()) {
        SeedData.seedAll();
    } else {
        console.log('✅ Datos del sistema ya inicializados');
    }

    // Actualizar credenciales del login
    updateLoginCredentials();
}

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SeedData, SEED_CONFIG, BRANCHES_DATA, USERS_DATA };
}

// Auto-inicializar en navegador
if (typeof window !== 'undefined') {
    window.SeedData = SeedData;
    window.SEED_CONFIG = SEED_CONFIG;
    
    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', initSeedData);
}
