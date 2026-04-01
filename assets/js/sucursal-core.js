/**
 * ANTHONY CHEF — SUCURSAL CORE
 * Motor multi-tenant compartido para TODAS las páginas de sucursal.
 * Un solo archivo. Una sola carpeta. Datos aislados por sucursal.
 */

// ============================================================
//  CREDENCIALES DE SUCURSALES (fuente de verdad)
// ============================================================
const SUCURSAL_CREDENTIALS = [
    {
        id: 1,
        usuario: 'san.cayetano',
        password: 'cayetano123',
        nombre: 'Sucursal San Cayetano',
        encargado: 'Maye Cortez',
        direccion: 'Calle 5 #12-34, San Cayetano',
        telefono: '(602) 555-1234',
        color: '#2D3A6B'
    },
    {
        id: 2,
        usuario: 'icesi',
        password: 'icesi123',
        nombre: 'Sucursal Universidad Icesi',
        encargado: 'Thania Ortiz',
        direccion: 'Calle 18 #117-100, Ciudad Jardín',
        telefono: '(602) 555-5678',
        color: '#10B981'
    },
    {
        id: 3,
        usuario: 'fabrica',
        password: 'fabrica123',
        nombre: 'Fábrica',
        encargado: 'Kevin Esteban Rojas',
        direccion: 'Zona Industrial Km 5 Vía Cali',
        telefono: '(602) 555-9876',
        color: '#F59E0B'
    }
];

// ============================================================
//  INVENTARIO INICIAL POR SUCURSAL
// ============================================================
const INVENTARIO_INICIAL = {
    1: [
        { codigo: 'HAM-001', nombre: 'Hamburguesa Clásica',  precio: 15000, stock: 50, stockMin: 10, categoria: 'Comida Rápida' },
        { codigo: 'HAM-002', nombre: 'Hamburguesa Especial', precio: 18000, stock: 30, stockMin: 8,  categoria: 'Comida Rápida' },
        { codigo: 'HOT-001', nombre: 'Hot Dog Especial',     precio: 10000, stock: 40, stockMin: 10, categoria: 'Comida Rápida' },
        { codigo: 'PAP-001', nombre: 'Papas Fritas',         precio: 6000,  stock: 60, stockMin: 15, categoria: 'Complementos'  },
        { codigo: 'GAS-001', nombre: 'Gaseosa 1.5L',         precio: 5000,  stock: 5,  stockMin: 20, categoria: 'Bebidas'       },
        { codigo: 'JUG-001', nombre: 'Jugo Natural',         precio: 8000,  stock: 25, stockMin: 10, categoria: 'Bebidas'       },
        { codigo: 'ARO-001', nombre: 'Aros de Cebolla',      precio: 7000,  stock: 35, stockMin: 10, categoria: 'Complementos'  },
        { codigo: 'POS-001', nombre: 'Brownie',              precio: 7000,  stock: 20, stockMin: 5,  categoria: 'Postres'       }
    ],
    2: [
        { codigo: 'PIZ-001', nombre: 'Pizza Pepperoni',      precio: 25000, stock: 20, stockMin: 5,  categoria: 'Pizzas'        },
        { codigo: 'PIZ-002', nombre: 'Pizza Hawaiana',       precio: 22000, stock: 15, stockMin: 5,  categoria: 'Pizzas'        },
        { codigo: 'ENS-001', nombre: 'Ensalada César',       precio: 15000, stock: 30, stockMin: 8,  categoria: 'Ensaladas'     },
        { codigo: 'ENS-002', nombre: 'Ensalada Mediterránea',precio: 17000, stock: 25, stockMin: 8,  categoria: 'Ensaladas'     },
        { codigo: 'HAM-001', nombre: 'Hamburguesa Clásica',  precio: 15000, stock: 35, stockMin: 10, categoria: 'Comida Rápida' },
        { codigo: 'GAS-001', nombre: 'Gaseosa 1.5L',         precio: 5000,  stock: 40, stockMin: 15, categoria: 'Bebidas'       },
        { codigo: 'JUG-001', nombre: 'Jugo Natural',         precio: 8000,  stock: 30, stockMin: 10, categoria: 'Bebidas'       },
        { codigo: 'HEL-001', nombre: 'Helado',               precio: 6000,  stock: 22, stockMin: 5,  categoria: 'Postres'       }
    ],
    3: [
        { codigo: 'PRO-001', nombre: 'Pan de Hamburguesa x12',  precio: 8000,  stock: 100, stockMin: 30, categoria: 'Materias Primas' },
        { codigo: 'PRO-002', nombre: 'Carne Molida 500g',       precio: 12000, stock: 80,  stockMin: 25, categoria: 'Materias Primas' },
        { codigo: 'PRO-003', nombre: 'Queso Mozzarella 500g',   precio: 15000, stock: 60,  stockMin: 20, categoria: 'Materias Primas' },
        { codigo: 'PRO-004', nombre: 'Salsa de Tomate 1L',      precio: 7000,  stock: 45,  stockMin: 15, categoria: 'Salsas'          },
        { codigo: 'PRO-005', nombre: 'Aceite Vegetal 5L',       precio: 35000, stock: 20,  stockMin: 8,  categoria: 'Materias Primas' },
        { codigo: 'PRO-006', nombre: 'Papas Peladas 5kg',       precio: 18000, stock: 30,  stockMin: 10, categoria: 'Vegetales'       },
        { codigo: 'PRO-007', nombre: 'Pollo en Pieza 2kg',      precio: 22000, stock: 40,  stockMin: 12, categoria: 'Proteínas'       },
        { codigo: 'PRO-008', nombre: 'Harina Especial 5kg',     precio: 14000, stock: 55,  stockMin: 15, categoria: 'Materias Primas' }
    ]
};

// ============================================================
//  CLAVES DE LOCALSTORAGE
// ============================================================
const KEYS = {
    SESSION:    'suc_session',
    SUCURSAL:   'suc_activa',
    INVENTARIO: (id) => `suc_inventario_${id}`,
    VENTAS:     (id) => `suc_ventas_${id}`
};

// ============================================================
//  AUTH SERVICE DE SUCURSAL
// ============================================================
const SucursalAuth = {
    login(usuario, password) {
        const cred = SUCURSAL_CREDENTIALS.find(
            c => c.usuario === usuario.trim() && c.password === password
        );
        if (!cred) return null;
        const session = { ...cred, loginTime: new Date().toISOString() };
        localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
        localStorage.setItem(KEYS.SUCURSAL, cred.id);
        SucursalData.initIfEmpty(cred.id);
        return session;
    },

    logout() {
        localStorage.removeItem(KEYS.SESSION);
        localStorage.removeItem(KEYS.SUCURSAL);
        window.location.href = '../index.html';
    },

    getSession() {
        const s = localStorage.getItem(KEYS.SESSION);
        return s ? JSON.parse(s) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem(KEYS.SESSION);
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return null;
        }
        return this.getSession();
    },

    getCurrentId() {
        return parseInt(localStorage.getItem(KEYS.SUCURSAL));
    }
};

// ============================================================
//  DATA SERVICE — AISLAMIENTO POR SUCURSAL
// ============================================================
const SucursalData = {
    // Inicializa datos si la sucursal aún no tiene registros
    initIfEmpty(id) {
        if (!localStorage.getItem(KEYS.INVENTARIO(id))) {
            const inv = (INVENTARIO_INICIAL[id] || []).map(p => ({ ...p }));
            localStorage.setItem(KEYS.INVENTARIO(id), JSON.stringify(inv));
        }
        if (!localStorage.getItem(KEYS.VENTAS(id))) {
            localStorage.setItem(KEYS.VENTAS(id), JSON.stringify([]));
        }
    },

    // ---------- INVENTARIO ----------
    getInventario(id) {
        const raw = localStorage.getItem(KEYS.INVENTARIO(id));
        return raw ? JSON.parse(raw) : [];
    },

    saveInventario(id, items) {
        localStorage.setItem(KEYS.INVENTARIO(id), JSON.stringify(items));
    },

    addProducto(id, producto) {
        const inv = this.getInventario(id);
        if (inv.find(p => p.codigo === producto.codigo)) return false;
        inv.push({ ...producto });
        this.saveInventario(id, inv);
        return true;
    },

    updateProducto(id, codigo, cambios) {
        const inv = this.getInventario(id);
        const idx = inv.findIndex(p => p.codigo === codigo);
        if (idx === -1) return false;
        inv[idx] = { ...inv[idx], ...cambios };
        this.saveInventario(id, inv);
        return true;
    },

    deleteProducto(id, codigo) {
        const inv = this.getInventario(id).filter(p => p.codigo !== codigo);
        this.saveInventario(id, inv);
    },

    ajustarStock(id, codigo, tipo, cantidad, motivo) {
        const inv = this.getInventario(id);
        const idx = inv.findIndex(p => p.codigo === codigo);
        if (idx === -1) return false;
        const delta = tipo === 'entrada' ? cantidad : -cantidad;
        const nuevoStock = inv[idx].stock + delta;
        if (nuevoStock < 0) return false;
        inv[idx].stock = nuevoStock;
        this.saveInventario(id, inv);
        return true;
    },

    // ---------- VENTAS ----------
    getVentas(id) {
        const raw = localStorage.getItem(KEYS.VENTAS(id));
        return raw ? JSON.parse(raw) : [];
    },

    registrarVenta(id, venta) {
        // Descontar stock
        const inv = this.getInventario(id);
        for (const item of venta.items) {
            const prod = inv.find(p => p.codigo === item.codigo);
            if (!prod || prod.stock < item.cantidad) return { ok: false, msg: `Stock insuficiente: ${item.nombre}` };
        }
        // Aplicar descuento
        for (const item of venta.items) {
            const prod = inv.find(p => p.codigo === item.codigo);
            prod.stock -= item.cantidad;
        }
        this.saveInventario(id, inv);

        // Crear registro de venta
        const ventas = this.getVentas(id);
        const registro = {
            id: `VTA-${Date.now()}`,
            fecha: new Date().toISOString(),
            cliente: venta.cliente || 'Cliente General',
            items: venta.items,
            total: venta.items.reduce((s, i) => s + i.subtotal, 0),
            metodoPago: venta.metodoPago,
            estado: 'completado'
        };
        ventas.unshift(registro);
        localStorage.setItem(KEYS.VENTAS(id), JSON.stringify(ventas));
        return { ok: true, venta: registro };
    }
};

// ============================================================
//  UTILIDADES COMPARTIDAS
// ============================================================
const Utils = {
    fmtCurrency(val) {
        return '$' + Number(val).toLocaleString('es-CO');
    },

    fmtDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }) + ' ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    },

    fmtDateShort(iso) {
        return new Date(iso).toLocaleDateString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    },

    today() {
        return new Date().toISOString().split('T')[0];
    },

    isToday(iso) {
        return iso.startsWith(this.today());
    },

    isThisWeek(iso) {
        const d = new Date(iso);
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0,0,0,0);
        return d >= startOfWeek;
    },

    isThisMonth(iso) {
        const d = new Date(iso);
        const now = new Date();
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    },

    getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Buenos días';
        if (h < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }
};

// ============================================================
//  RENDER SIDEBAR ACTIVO
// ============================================================
function renderSidebarHeader(session, activePage) {
    const pages = [
        { key: 'pos',        href: 'pos.html',        icon: 'fa-cash-register', label: 'Punto de Venta' },
        { key: 'historial',  href: 'historial.html',  icon: 'fa-clock-rotate-left', label: 'Historial' },
        { key: 'inventario', href: 'inventario.html', icon: 'fa-boxes-stacked', label: 'Inventario' }
    ];

    document.querySelectorAll('.suc-branch-name').forEach(el => el.textContent = session.nombre);
    document.querySelectorAll('.suc-encargado').forEach(el => el.textContent = session.encargado);

    const nav = document.getElementById('suc-nav');
    if (nav) {
        nav.innerHTML = pages.map(p => `
            <a href="${p.href}" class="suc-nav-item ${p.key === activePage ? 'active' : ''}">
                <i class="fas ${p.icon}"></i>
                <span>${p.label}</span>
            </a>
        `).join('');
    }
}
