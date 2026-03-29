/**
 * ============================================
 * ANTONY CHEF - APLICACIÓN UNIFICADA
 * ============================================
 * Todos los módulos consolidados en un solo archivo
 * para funcionar sin servidor local (sin CORS)
 */

// ============================================
// MÓDULO: STORAGE
// ============================================
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    getKeys() {
        return Object.keys(localStorage);
    },

    exportData() {
        const data = {};
        const keys = this.getKeys();
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    },

    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

const KEYS = {
    VENTAS: 'restaurante_ventas',
    GASTOS: 'restaurante_gastos',
    PRODUCTOS: 'restaurante_productos',
    EMPLEADOS: 'restaurante_empleados',
    CONFIG: 'restaurante_config',
    SETTINGS: 'restaurante_settings'
};

function initializeData() {
    if (!Storage.get(KEYS.PRODUCTOS)) {
        const defaultProducts = [
            { id: 1, nombre: 'Hamburguesa Clásica', categoria: 'alimentos', precio: 15000, stock: 50, stockMin: 10 },
            { id: 2, nombre: 'Pizza Margarita', categoria: 'alimentos', precio: 25000, stock: 30, stockMin: 5 },
            { id: 3, nombre: 'Ensalada César', categoria: 'alimentos', precio: 18000, stock: 25, stockMin: 8 },
            { id: 4, nombre: 'Pasta Carbonara', categoria: 'alimentos', precio: 22000, stock: 20, stockMin: 5 },
            { id: 5, nombre: 'Coca Cola', categoria: 'bebidas', precio: 5000, stock: 100, stockMin: 20 },
            { id: 6, nombre: 'Jugo Natural', categoria: 'bebidas', precio: 6000, stock: 50, stockMin: 15 },
            { id: 7, nombre: 'Cerveza', categoria: 'bebidas', precio: 8000, stock: 80, stockMin: 25 },
            { id: 8, nombre: 'Agua', categoria: 'bebidas', precio: 3000, stock: 100, stockMin: 30 },
            { id: 9, nombre: 'Tiramisú', categoria: 'postres', precio: 12000, stock: 15, stockMin: 5 },
            { id: 10, nombre: 'Flan', categoria: 'postres', precio: 8000, stock: 20, stockMin: 8 },
            { id: 11, nombre: 'Helado', categoria: 'postres', precio: 10000, stock: 25, stockMin: 10 },
            { id: 12, nombre: 'Servilletas', categoria: 'insumos', precio: 2000, stock: 200, stockMin: 50 }
        ];
        Storage.set(KEYS.PRODUCTOS, defaultProducts);
    }

    if (!Storage.get(KEYS.EMPLEADOS)) {
        const defaultEmployees = [
            { id: 1, nombre: 'Juan Pérez', cargo: 'cocinero', telefono: '3001234567', email: 'juan@restaurante.com', salario: 1500000, estado: 'activo' },
            { id: 2, nombre: 'María García', cargo: 'mesero', telefono: '3002345678', email: 'maria@restaurante.com', salario: 1200000, estado: 'activo' },
            { id: 3, nombre: 'Carlos López', cargo: 'cajero', telefono: '3003456789', email: 'carlos@restaurante.com', salario: 1300000, estado: 'activo' },
            { id: 4, nombre: 'Ana Martínez', cargo: 'limpieza', telefono: '3004567890', email: 'ana@restaurante.com', salario: 1000000, estado: 'activo' },
            { id: 5, nombre: 'Pedro Sánchez', cargo: 'administrador', telefono: '3005678901', email: 'pedro@restaurante.com', salario: 2500000, estado: 'activo' }
        ];
        Storage.set(KEYS.EMPLEADOS, defaultEmployees);
    }

    if (!Storage.get(KEYS.VENTAS)) {
        const today = new Date();
        const defaultSales = [
            {
                id: 1,
                fecha: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30).toISOString(),
                cliente: 'Cliente 1',
                items: [{ productoId: 1, nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 15000 }],
                metodo: 'efectivo',
                total: 30000,
                estado: 'completado'
            },
            {
                id: 2,
                fecha: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 15).toISOString(),
                cliente: 'Cliente 2',
                items: [{ productoId: 5, nombre: 'Coca Cola', cantidad: 3, precio: 5000 }],
                metodo: 'tarjeta',
                total: 15000,
                estado: 'completado'
            },
            {
                id: 3,
                fecha: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0).toISOString(),
                cliente: 'Cliente 3',
                items: [{ productoId: 2, nombre: 'Pizza Margarita', cantidad: 1, precio: 25000 }],
                metodo: 'efectivo',
                total: 25000,
                estado: 'pendiente'
            }
        ];
        Storage.set(KEYS.VENTAS, defaultSales);
    }

    if (!Storage.get(KEYS.GASTOS)) {
        const defaultExpenses = [
            { id: 1, fecha: new Date().toISOString(), descripcion: 'Compra de verduras', categoria: 'proveedores', monto: 150000 },
            { id: 2, fecha: new Date().toISOString(), descripcion: 'Pago de luz', categoria: 'servicios', monto: 200000 },
            { id: 3, fecha: new Date().toISOString(), descripcion: 'Reparación equipo', categoria: 'mantenimiento', monto: 80000 }
        ];
        Storage.set(KEYS.GASTOS, defaultExpenses);
    }

    if (!Storage.get(KEYS.CONFIG)) {
        Storage.set(KEYS.CONFIG, {
            nombre: 'Antony Chef',
            direccion: 'Calle 123 #45-67',
            telefono: '(601) 555-0123',
            email: 'contacto@antonychef.com'
        });
    }

    if (!Storage.get(KEYS.SETTINGS)) {
        Storage.set(KEYS.SETTINGS, {
            temaOscuro: false,
            sidebarColapsado: false
        });
    }
}

// ============================================
// MÓDULO: UI
// ============================================
const UI = {
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });

        setTimeout(() => {
            this.removeToast(toast);
        }, 4000);
    },

    removeToast(toast) {
        toast.style.animation = 'toastSlideIn 0.25s ease reverse';
        setTimeout(() => toast.remove(), 250);
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    formatDateShort(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    getStatusBadge(status) {
        const badges = {
            completado: '<span class="badge badge-success"><i class="fas fa-check"></i> Completado</span>',
            pendiente: '<span class="badge badge-warning"><i class="fas fa-clock"></i> Pendiente</span>',
            cancelado: '<span class="badge badge-danger"><i class="fas fa-times"></i> Cancelado</span>',
            activo: '<span class="badge badge-success">Activo</span>',
            inactivo: '<span class="badge badge-secondary">Inactivo</span>',
            vacaciones: '<span class="badge badge-warning">Vacaciones</span>'
        };
        return badges[status] || `<span class="badge badge-secondary">${status}</span>`;
    },

    getPaymentBadge(method) {
        const badges = {
            efectivo: '<span class="payment-badge efectivo"><i class="fas fa-money-bill"></i> Efectivo</span>',
            tarjeta: '<span class="payment-badge tarjeta"><i class="fas fa-credit-card"></i> Tarjeta</span>',
            transferencia: '<span class="payment-badge transferencia"><i class="fas fa-university"></i> Transferencia</span>'
        };
        return badges[method] || method;
    },

    getCategoryBadge(category) {
        return `<span class="category-badge ${category}">${category}</span>`;
    },

    getStockIndicator(stock, stockMin) {
        const percentage = Math.min(100, (stock / (stockMin * 3)) * 100);
        let level = 'high';
        if (percentage < 33) level = 'low';
        else if (percentage < 66) level = 'medium';

        return `
            <div class="stock-indicator">
                <span>${stock}</span>
                <div class="stock-bar">
                    <div class="stock-fill ${level}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    },

    updateTitle(title) {
        const titleEl = document.getElementById('headerTitle');
        if (titleEl) {
            titleEl.textContent = title;
        }
    },

    updateDateDisplay() {
        const dateEl = document.getElementById('dateDisplay');
        if (dateEl) {
            const now = new Date();
            dateEl.textContent = new Intl.DateTimeFormat('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(now);
        }
    },

    setActiveNav(section) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });
    },

    showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    },

    confirm(message) {
        return window.confirm(message);
    },

    getEmptyState(icon, message) {
        return `
            <div class="no-data">
                <i class="fas ${icon}"></i>
                <p>${message}</p>
            </div>
        `;
    }
};

// ============================================
// MÓDULO: DASHBOARD
// ============================================
const Dashboard = {
    chartInstance: null,
    autoRefreshInterval: null,

    init() {
        this.renderCards();
        this.renderAlertas();
        this.renderVentasChart();
        this.renderEmpleadosActivos();
        this.renderResumen();
        this.setupAutoRefresh();
    },

    getDiaMetrics() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const ventas = Storage.get(KEYS.VENTAS, []);
        const gastos = Storage.get(KEYS.GASTOS, []);

        const ventasDia = ventas.filter(v => {
            const fecha = new Date(v.fecha);
            fecha.setHours(0, 0, 0, 0);
            return fecha.getTime() === hoy.getTime() && v.estado === 'completado';
        });
        const totalVentas = ventasDia.reduce((sum, v) => sum + v.total, 0);

        const gastosDia = gastos.filter(g => {
            const fecha = new Date(g.fecha);
            fecha.setHours(0, 0, 0, 0);
            return fecha.getTime() === hoy.getTime();
        });
        const totalGastos = gastosDia.reduce((sum, g) => sum + g.monto, 0);

        const ganancia = totalVentas - totalGastos;

        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const bajoStock = productos.filter(p => p.stock <= p.stockMin);

        return {
            ventas: totalVentas,
            gastos: totalGastos,
            ganancia,
            bajoStock: bajoStock.length,
            pedidosHoy: ventasDia.length
        };
    },

    renderCards() {
        const metrics = this.getDiaMetrics();

        const cardsHTML = `
            <div class="stat-card stat-ventas">
                <div class="stat-card-content">
                    <div class="stat-icon bg-green">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-details">
                        <span class="stat-label">Ventas del Día</span>
                        <span class="stat-value">${UI.formatCurrency(metrics.ventas)}</span>
                        <span class="stat-pedidos">${metrics.pedidosHoy} pedidos</span>
                    </div>
                </div>
                <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>Hoy</span>
                </div>
            </div>

            <div class="stat-card stat-gastos">
                <div class="stat-card-content">
                    <div class="stat-icon bg-red">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="stat-details">
                        <span class="stat-label">Gastos del Día</span>
                        <span class="stat-value">${UI.formatCurrency(metrics.gastos)}</span>
                        <span class="stat-pedidos">${this.gastosCount()} registros</span>
                    </div>
                </div>
                <div class="stat-trend negative">
                    <i class="fas fa-arrow-down"></i>
                    <span>Salida</span>
                </div>
            </div>

            <div class="stat-card stat-ganancia">
                <div class="stat-card-content">
                    <div class="stat-icon bg-blue">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-details">
                        <span class="stat-label">Ganancia Neta</span>
                        <span class="stat-value ${metrics.ganancia >= 0 ? 'positive' : 'negative'}">
                            ${UI.formatCurrency(metrics.ganancia)}
                        </span>
                        <span class="stat-pedidos">
                            ${metrics.ganancia >= 0 ? '✓ Positivo' : '⚠ Negativo'}
                        </span>
                    </div>
                </div>
                <div class="stat-trend ${metrics.ganancia >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-${metrics.ganancia >= 0 ? 'check' : 'exclamation'}"></i>
                    <span>${metrics.ganancia >= 0 ? 'Óptimo' : 'Revisar'}</span>
                </div>
            </div>

            <div class="stat-card stat-stock">
                <div class="stat-card-content">
                    <div class="stat-icon bg-orange">
                        <i class="fas fa-boxes"></i>
                    </div>
                    <div class="stat-details">
                        <span class="stat-label">Bajo Stock</span>
                        <span class="stat-value ${metrics.bajoStock > 0 ? 'warning' : ''}">
                            ${metrics.bajoStock}
                        </span>
                        <span class="stat-pedidos">
                            ${metrics.bajoStock === 0 ? '✓ Todo bien' : '⚠ Reponer'}
                        </span>
                    </div>
                </div>
                <div class="stat-trend ${metrics.bajoStock > 0 ? 'warning' : 'positive'}">
                    <i class="fas fa-${metrics.bajoStock > 0 ? 'exclamation-triangle' : 'check'}"></i>
                    <span>${metrics.bajoStock === 0 ? 'Normal' : 'Alerta'}</span>
                </div>
            </div>
        `;

        const container = document.querySelector('.stats-grid');
        if (container) {
            container.innerHTML = cardsHTML;
        }
    },

    gastosCount() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const gastos = Storage.get(KEYS.GASTOS, []);
        return gastos.filter(g => {
            const fecha = new Date(g.fecha);
            fecha.setHours(0, 0, 0, 0);
            return fecha.getTime() === hoy.getTime();
        }).length;
    },

    renderAlertas() {
        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const bajoStock = productos.filter(p => p.stock <= p.stockMin);
        const agotados = productos.filter(p => p.stock === 0);

        const alertasContainer = document.getElementById('alertasInventario');
        if (!alertasContainer) return;

        let alertasHTML = '';

        agotados.forEach(producto => {
            alertasHTML += `
                <div class="alerta-item alerta-critical">
                    <div class="alerta-icon">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="alerta-content">
                        <span class="alerta-title">${producto.nombre}</span>
                        <span class="alerta-desc">Producto agotado - Stock: 0</span>
                    </div>
                    <div class="alerta-badge critical">Crítico</div>
                </div>
            `;
        });

        bajoStock.filter(p => p.stock > 0).forEach(producto => {
            alertasHTML += `
                <div class="alerta-item alerta-warning">
                    <div class="alerta-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alerta-content">
                        <span class="alerta-title">${producto.nombre}</span>
                        <span class="alerta-desc">Stock: ${producto.stock} / Mín: ${producto.stockMin}</span>
                    </div>
                    <div class="alerta-badge warning">Bajo</div>
                </div>
            `;
        });

        if (alertasHTML === '') {
            alertasHTML = `
                <div class="no-alertas">
                    <i class="fas fa-check-circle"></i>
                    <span>Todo en orden - Sin alertas</span>
                </div>
            `;
        }

        alertasContainer.innerHTML = alertasHTML;
    },

    renderVentasChart() {
        const canvas = document.getElementById('ventasChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const ventas = Storage.get(KEYS.VENTAS, []);
        const labels = [];
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - i);
            fecha.setHours(0, 0, 0, 0);

            const diaVentas = ventas.filter(v => {
                const vFecha = new Date(v.fecha);
                vFecha.setHours(0, 0, 0, 0);
                return vFecha.getTime() === fecha.getTime() && v.estado === 'completado';
            });

            const total = diaVentas.reduce((sum, v) => sum + v.total, 0);

            labels.push(new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(fecha));
            data.push(total);
        }

        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Ventas',
                    data,
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2e7d32',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                return ' $' + context.parsed.y.toLocaleString('es-CO');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString('es-CO', { notation: 'compact' });
                            },
                            color: '#666'
                        }
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#666' }
                    }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    },

    setupAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        this.autoRefreshInterval = setInterval(() => {
            this.renderCards();
            this.renderAlertas();
            this.renderResumen();
        }, 30000);
    },

    refresh() {
        this.renderCards();
        this.renderAlertas();
        this.renderVentasChart();
        this.renderEmpleadosActivos();
        this.renderResumen();
    },

    renderEmpleadosActivos() {
        const empleados = Storage.get(KEYS.EMPLEADOS, []);
        const container = document.getElementById('empleadosActivos');
        if (!container) return;

        const activos = empleados.filter(e => e.estado === 'activo');

        if (activos.length === 0) {
            container.innerHTML = `
                <div class="no-alertas">
                    <i class="fas fa-users"></i>
                    <span>No hay empleados activos</span>
                </div>
            `;
            return;
        }

        container.innerHTML = activos.slice(0, 6).map(empleado => `
            <div class="empleado-item">
                <div class="empleado-avatar">
                    ${this.getInitials(empleado.nombre)}
                </div>
                <div class="empleado-name">${empleado.nombre}</div>
                <div class="empleado-cargo">${this.capitalize(empleado.cargo)}</div>
                <span class="empleado-status activo">Activo</span>
            </div>
        `).join('');
    },

    renderResumen() {
        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const config = Storage.get(KEYS.CONFIG, {});
        const metrics = this.getDiaMetrics();

        const totalProductosEl = document.getElementById('totalProductos');
        const pedidosHoyEl = document.getElementById('pedidosHoy');
        const nombreRestauranteEl = document.getElementById('nombreRestauranteDash');

        if (totalProductosEl) totalProductosEl.textContent = productos.length;
        if (pedidosHoyEl) pedidosHoyEl.textContent = metrics.pedidosHoy;
        if (nombreRestauranteEl) nombreRestauranteEl.textContent = config.nombre || 'Antony Chef';
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// ============================================
// MÓDULO: VENTAS
// ============================================
const Ventas = {
    currentItems: [],

    init() {
        this.renderTable();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('btnNuevaVenta')?.addEventListener('click', () => this.openNewSaleModal());
        document.getElementById('btnExportarVentas')?.addEventListener('click', () => this.exportData());
        document.getElementById('searchVentas')?.addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('filterVentasEstado')?.addEventListener('change', (e) => this.filterTable(null, e.target.value));
        document.getElementById('btnAgregarProducto')?.addEventListener('click', () => this.addProductToSale());
        document.getElementById('btnGuardarVenta')?.addEventListener('click', () => this.saveSale());

        document.getElementById('ventaProducto')?.addEventListener('change', () => {
            const productId = document.getElementById('ventaProducto').value;
            if (productId) {
                const product = Storage.get(KEYS.PRODUCTOS).find(p => p.id == productId);
                if (product) {
                    document.getElementById('ventaCantidad').max = product.stock;
                }
            }
        });

        const ventasSection = document.getElementById('ventas');
        if (ventasSection) {
            ventasSection.addEventListener('click', (e) => {
                const viewBtn = e.target.closest('button[onclick*="viewSale"]');
                const deleteBtn = e.target.closest('button[onclick*="deleteSale"]');
                if (viewBtn) {
                    e.preventDefault();
                    const id = parseInt(viewBtn.getAttribute('onclick').match(/viewSale\((\d+)\)/)[1]);
                    this.viewSale(id);
                } else if (deleteBtn) {
                    e.preventDefault();
                    const id = parseInt(deleteBtn.getAttribute('onclick').match(/deleteSale\((\d+)\)/)[1]);
                    this.deleteSale(id);
                }
            });
        }

        const modalVenta = document.getElementById('modalVenta');
        if (modalVenta) {
            modalVenta.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.venta-item-remove');
                if (removeBtn) {
                    const index = parseInt(removeBtn.getAttribute('onclick').match(/removeItem\((\d+)\)/)[1]);
                    this.removeItem(index);
                }
            });
        }
    },

    openNewSaleModal() {
        this.currentItems = [];
        this.updateVentaResumen();
        this.populateProductosSelect();
        document.getElementById('ventaCliente').value = '';
        document.getElementById('ventaProducto').value = '';
        document.getElementById('ventaCantidad').value = '1';
        document.getElementById('ventaMetodo').value = 'efectivo';
        document.getElementById('ventaItems').innerHTML = '';
        UI.openModal('modalVenta');
    },

    populateProductosSelect() {
        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const select = document.getElementById('ventaProducto');
        select.innerHTML = '<option value="">Seleccionar producto</option>' +
            productos.filter(p => p.stock > 0).map(p =>
                `<option value="${p.id}" data-precio="${p.precio}">${p.nombre} - ${UI.formatCurrency(p.precio)} (Stock: ${p.stock})</option>`
            ).join('');
    },

    addProductToSale() {
        const productId = document.getElementById('ventaProducto').value;
        const cantidad = parseInt(document.getElementById('ventaCantidad').value);

        if (!productId || cantidad < 1) {
            UI.showToast('Seleccione un producto y cantidad válida', 'warning');
            return;
        }

        const productos = Storage.get(KEYS.PRODUCTOS);
        const product = productos.find(p => p.id == productId);

        if (!product) {
            UI.showToast('Producto no encontrado', 'error');
            return;
        }

        if (product.stock < cantidad) {
            UI.showToast('Stock insuficiente', 'error');
            return;
        }

        const existingItem = this.currentItems.find(item => item.productoId == productId);
        if (existingItem) {
            if (existingItem.cantidad + cantidad > product.stock) {
                UI.showToast('Stock insuficiente para la cantidad total', 'error');
                return;
            }
            existingItem.cantidad += cantidad;
            existingItem.subtotal = existingItem.cantidad * existingItem.precio;
        } else {
            this.currentItems.push({
                productoId: product.id,
                nombre: product.nombre,
                cantidad,
                precio: product.precio,
                subtotal: cantidad * product.precio
            });
        }

        this.renderVentaItems();
        this.updateVentaResumen();

        document.getElementById('ventaProducto').value = '';
        document.getElementById('ventaCantidad').value = '1';
    },

    renderVentaItems() {
        const container = document.getElementById('ventaItems');

        if (this.currentItems.length === 0) {
            container.innerHTML = '<p class="no-data">No hay productos agregados</p>';
            return;
        }

        container.innerHTML = this.currentItems.map((item, index) => `
            <div class="venta-item">
                <div class="venta-item-info">
                    <div class="venta-item-name">${item.nombre}</div>
                    <div class="venta-item-details">${item.cantidad} x ${UI.formatCurrency(item.precio)}</div>
                </div>
                <div class="venta-item-total">${UI.formatCurrency(item.subtotal)}</div>
                <button class="venta-item-remove" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    },

    removeItem(index) {
        this.currentItems.splice(index, 1);
        this.renderVentaItems();
        this.updateVentaResumen();
    },

    updateVentaResumen() {
        const subtotal = this.currentItems.reduce((sum, item) => sum + item.subtotal, 0);
        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        document.getElementById('ventaSubtotal').textContent = UI.formatCurrency(subtotal);
        document.getElementById('ventaIva').textContent = UI.formatCurrency(iva);
        document.getElementById('ventaTotal').textContent = UI.formatCurrency(total);
    },

    saveSale() {
        if (this.currentItems.length === 0) {
            UI.showToast('Agregue al menos un producto', 'warning');
            return;
        }

        const cliente = document.getElementById('ventaCliente').value || 'Cliente General';
        const metodo = document.getElementById('ventaMetodo').value;
        const total = this.currentItems.reduce((sum, item) => sum + item.subtotal, 0) * 1.19;

        const ventas = Storage.get(KEYS.VENTAS, []);
        const newId = ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 1;

        const newVenta = {
            id: newId,
            fecha: new Date().toISOString(),
            cliente,
            items: [...this.currentItems],
            metodo,
            total: Math.round(total),
            estado: 'completado'
        };

        const productos = Storage.get(KEYS.PRODUCTOS);
        this.currentItems.forEach(item => {
            const product = productos.find(p => p.id == item.productoId);
            if (product) {
                product.stock -= item.cantidad;
            }
        });
        Storage.set(KEYS.PRODUCTOS, productos);

        ventas.push(newVenta);
        Storage.set(KEYS.VENTAS, ventas);

        UI.showToast('Venta guardada exitosamente', 'success');
        UI.closeModal('modalVenta');
        this.renderTable();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    renderTable() {
        const ventas = Storage.get(KEYS.VENTAS, []);
        const tbody = document.querySelector('#ventasTable tbody');

        if (ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No hay ventas registradas</td></tr>';
            return;
        }

        tbody.innerHTML = ventas.slice().reverse().map(venta => `
            <tr>
                <td>#${venta.id}</td>
                <td>${UI.formatDate(venta.fecha)}</td>
                <td>${venta.cliente}</td>
                <td>${UI.getPaymentBadge(venta.metodo)}</td>
                <td>${UI.formatCurrency(venta.total)}</td>
                <td>${UI.getStatusBadge(venta.estado)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" data-view="${venta.id}" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" data-delete="${venta.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    viewSale(id) {
        const venta = Storage.get(KEYS.VENTAS).find(v => v.id === id);
        if (!venta) return;

        const subtotal = venta.items.reduce((sum, item) => sum + item.subtotal, 0);
        const iva = subtotal * 0.19;

        alert(`
VENTA #${venta.id}
====================
Cliente: ${venta.cliente}
Fecha: ${UI.formatDate(venta.fecha)}
Método: ${venta.metodo}

PRODUCTOS:
${venta.items.map(i => `- ${i.nombre} x${i.cantidad}: ${UI.formatCurrency(i.subtotal)}`).join('\n')}

Subtotal: ${UI.formatCurrency(subtotal)}
IVA (19%): ${UI.formatCurrency(iva)}
TOTAL: ${UI.formatCurrency(venta.total)}
Estado: ${venta.estado}
        `);
    },

    deleteSale(id) {
        if (!UI.confirm('¿Está seguro de eliminar esta venta?')) return;

        const ventas = Storage.get(KEYS.VENTAS);
        const venta = ventas.find(v => v.id === id);

        if (venta) {
            const productos = Storage.get(KEYS.PRODUCTOS);
            venta.items.forEach(item => {
                const product = productos.find(p => p.id == item.productoId);
                if (product) {
                    product.stock += item.cantidad;
                }
            });
            Storage.set(KEYS.PRODUCTOS, productos);
        }

        Storage.set(KEYS.VENTAS, ventas.filter(v => v.id !== id));
        UI.showToast('Venta eliminada', 'success');
        this.renderTable();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    filterTable(search = null, estado = null) {
        search = search || document.getElementById('searchVentas')?.value || '';
        estado = estado || document.getElementById('filterVentasEstado')?.value || '';

        let ventas = Storage.get(KEYS.VENTAS, []);

        if (search) {
            ventas = ventas.filter(v =>
                v.cliente.toLowerCase().includes(search.toLowerCase()) ||
                v.id.toString().includes(search)
            );
        }

        if (estado) {
            ventas = ventas.filter(v => v.estado === estado);
        }

        const tbody = document.querySelector('#ventasTable tbody');

        if (ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No se encontraron ventas</td></tr>';
            return;
        }

        tbody.innerHTML = ventas.slice().reverse().map(venta => `
            <tr>
                <td>#${venta.id}</td>
                <td>${UI.formatDate(venta.fecha)}</td>
                <td>${venta.cliente}</td>
                <td>${UI.getPaymentBadge(venta.metodo)}</td>
                <td>${UI.formatCurrency(venta.total)}</td>
                <td>${UI.getStatusBadge(venta.estado)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" data-view="${venta.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" data-delete="${venta.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    exportData() {
        const ventas = Storage.get(KEYS.VENTAS, []);
        const csv = [
            ['ID', 'Fecha', 'Cliente', 'Método', 'Total', 'Estado'].join(','),
            ...ventas.map(v => [v.id, v.fecha, v.cliente, v.metodo, v.total, v.estado].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        UI.showToast('Datos exportados exitosamente', 'success');
    },

    refresh() {
        this.renderTable();
    }
};

// ============================================
// MÓDULO: GASTOS
// ============================================
const Gastos = {
    init() {
        this.renderTable();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('btnNuevoGasto')?.addEventListener('click', () => this.openNewExpenseModal());
        document.getElementById('btnExportarGastos')?.addEventListener('click', () => this.exportData());
        document.getElementById('searchGastos')?.addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('filterGastosCategoria')?.addEventListener('change', (e) => this.filterTable(null, e.target.value));
        document.getElementById('btnGuardarGasto')?.addEventListener('click', () => this.saveExpense());

        const gastosSection = document.getElementById('gastos');
        if (gastosSection) {
            gastosSection.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('button[data-delete-gasto]');
                if (deleteBtn) {
                    e.preventDefault();
                    const id = parseInt(deleteBtn.getAttribute('data-delete-gasto'));
                    this.deleteExpense(id);
                }
            });
        }
    },

    openNewExpenseModal() {
        document.getElementById('gastoDescripcion').value = '';
        document.getElementById('gastoCategoria').value = '';
        document.getElementById('gastoMonto').value = '';
        document.getElementById('gastoFecha').value = new Date().toISOString().split('T')[0];
        UI.openModal('modalGasto');
    },

    saveExpense() {
        const descripcion = document.getElementById('gastoDescripcion').value.trim();
        const categoria = document.getElementById('gastoCategoria').value;
        const monto = parseFloat(document.getElementById('gastoMonto').value);
        const fecha = document.getElementById('gastoFecha').value;

        if (!descripcion) {
            UI.showToast('Ingrese una descripción', 'warning');
            return;
        }

        if (!categoria) {
            UI.showToast('Seleccione una categoría', 'warning');
            return;
        }

        if (!monto || monto <= 0) {
            UI.showToast('Ingrese un monto válido', 'warning');
            return;
        }

        if (!fecha) {
            UI.showToast('Seleccione una fecha', 'warning');
            return;
        }

        const gastos = Storage.get(KEYS.GASTOS, []);
        const newId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1;

        const newGasto = {
            id: newId,
            fecha: new Date(fecha).toISOString(),
            descripcion,
            categoria,
            monto: Math.round(monto)
        };

        gastos.push(newGasto);
        Storage.set(KEYS.GASTOS, gastos);

        UI.showToast('Gasto registrado exitosamente', 'success');
        UI.closeModal('modalGasto');
        this.renderTable();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    renderTable() {
        const gastos = Storage.get(KEYS.GASTOS, []);
        const tbody = document.querySelector('#gastosTable tbody');

        if (gastos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay gastos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = gastos.slice().reverse().map(gasto => `
            <tr>
                <td>#${gasto.id}</td>
                <td>${UI.formatDateShort(gasto.fecha)}</td>
                <td>${gasto.descripcion}</td>
                <td>${UI.getCategoryBadge(gasto.categoria)}</td>
                <td>${UI.formatCurrency(gasto.monto)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-danger" data-delete-gasto="${gasto.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    deleteExpense(id) {
        if (!UI.confirm('¿Está seguro de eliminar este gasto?')) return;

        const gastos = Storage.get(KEYS.GASTOS);
        Storage.set(KEYS.GASTOS, gastos.filter(g => g.id !== id));

        UI.showToast('Gasto eliminado', 'success');
        this.renderTable();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    filterTable(search = null, categoria = null) {
        search = search || document.getElementById('searchGastos')?.value || '';
        categoria = categoria || document.getElementById('filterGastosCategoria')?.value || '';

        let gastos = Storage.get(KEYS.GASTOS, []);

        if (search) {
            gastos = gastos.filter(g =>
                g.descripcion.toLowerCase().includes(search.toLowerCase()) ||
                g.id.toString().includes(search)
            );
        }

        if (categoria) {
            gastos = gastos.filter(g => g.categoria === categoria);
        }

        const tbody = document.querySelector('#gastosTable tbody');

        if (gastos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No se encontraron gastos</td></tr>';
            return;
        }

        tbody.innerHTML = gastos.slice().reverse().map(gasto => `
            <tr>
                <td>#${gasto.id}</td>
                <td>${UI.formatDateShort(gasto.fecha)}</td>
                <td>${gasto.descripcion}</td>
                <td>${UI.getCategoryBadge(gasto.categoria)}</td>
                <td>${UI.formatCurrency(gasto.monto)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-danger" data-delete-gasto="${gasto.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    exportData() {
        const gastos = Storage.get(KEYS.GASTOS, []);
        const csv = [
            ['ID', 'Fecha', 'Descripción', 'Categoría', 'Monto'].join(','),
            ...gastos.map(g => [g.id, g.fecha, `"${g.descripcion}"`, g.categoria, g.monto].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gastos_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        UI.showToast('Datos exportados exitosamente', 'success');
    },

    refresh() {
        this.renderTable();
    }
};

// ============================================
// MÓDULO: INVENTARIO
// ============================================
const Inventario = {
    editingId: null,

    init() {
        this.renderTable();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('btnNuevoProducto')?.addEventListener('click', () => this.openNewProductModal());
        document.getElementById('btnExportarInventario')?.addEventListener('click', () => this.exportData());
        document.getElementById('searchInventario')?.addEventListener('input', (e) => this.filterTable(e.target.value));
        document.getElementById('filterInventarioCategoria')?.addEventListener('change', (e) => this.filterTable(null, e.target.value));
        document.getElementById('btnGuardarProducto')?.addEventListener('click', () => this.saveProduct());

        const inventarioSection = document.getElementById('inventario');
        if (inventarioSection) {
            inventarioSection.addEventListener('click', (e) => {
                const editBtn = e.target.closest('button[data-edit]');
                const deleteBtn = e.target.closest('button[data-delete]');
                if (editBtn) {
                    e.preventDefault();
                    const id = parseInt(editBtn.getAttribute('data-edit'));
                    this.editProduct(id);
                } else if (deleteBtn) {
                    e.preventDefault();
                    const id = parseInt(deleteBtn.getAttribute('data-delete'));
                    this.deleteProduct(id);
                }
            });
        }
    },

    openNewProductModal() {
        this.editingId = null;
        document.getElementById('productoNombre').value = '';
        document.getElementById('productoCategoria').value = '';
        document.getElementById('productoPrecio').value = '';
        document.getElementById('productoStock').value = '';
        document.getElementById('productoStockMin').value = '5';
        document.getElementById('btnGuardarProducto').innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
        UI.openModal('modalProducto');
    },

    saveProduct() {
        const nombre = document.getElementById('productoNombre').value.trim();
        const categoria = document.getElementById('productoCategoria').value;
        const precio = parseFloat(document.getElementById('productoPrecio').value);
        const stock = parseInt(document.getElementById('productoStock').value);
        const stockMin = parseInt(document.getElementById('productoStockMin').value) || 5;

        if (!nombre) {
            UI.showToast('Ingrese un nombre', 'warning');
            return;
        }

        if (!categoria) {
            UI.showToast('Seleccione una categoría', 'warning');
            return;
        }

        if (!precio || precio <= 0) {
            UI.showToast('Ingrese un precio válido', 'warning');
            return;
        }

        if (stock === undefined || stock < 0) {
            UI.showToast('Ingrese un stock válido', 'warning');
            return;
        }

        const productos = Storage.get(KEYS.PRODUCTOS, []);

        if (this.editingId) {
            const index = productos.findIndex(p => p.id === this.editingId);
            if (index !== -1) {
                productos[index] = { ...productos[index], nombre, categoria, precio: Math.round(precio), stock, stockMin };
                Storage.set(KEYS.PRODUCTOS, productos);
                UI.showToast('Producto actualizado exitosamente', 'success');
            }
        } else {
            const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
            productos.push({ id: newId, nombre, categoria, precio: Math.round(precio), stock, stockMin });
            Storage.set(KEYS.PRODUCTOS, productos);
            UI.showToast('Producto registrado exitosamente', 'success');
        }

        UI.closeModal('modalProducto');
        this.renderTable();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    renderTable() {
        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const tbody = document.querySelector('#inventarioTable tbody');

        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No hay productos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = productos.map(producto => `
            <tr>
                <td>#${producto.id}</td>
                <td><strong>${producto.nombre}</strong></td>
                <td>${UI.getCategoryBadge(producto.categoria)}</td>
                <td>${UI.getStockIndicator(producto.stock, producto.stockMin)}</td>
                <td>${UI.formatCurrency(producto.precio)}</td>
                <td>${this.getStockStatus(producto.stock, producto.stockMin)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" data-edit="${producto.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" data-delete="${producto.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    getStockStatus(stock, stockMin) {
        if (stock === 0) return '<span class="badge badge-danger">Agotado</span>';
        if (stock <= stockMin) return '<span class="badge badge-warning">Bajo</span>';
        if (stock <= stockMin * 2) return '<span class="badge badge-info">Normal</span>';
        return '<span class="badge badge-success">Óptimo</span>';
    },

    editProduct(id) {
        const productos = Storage.get(KEYS.PRODUCTOS);
        const producto = productos.find(p => p.id === id);

        if (!producto) return;

        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoCategoria').value = producto.categoria;
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoStockMin').value = producto.stockMin;

        this.editingId = id;
        document.getElementById('btnGuardarProducto').innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
        UI.openModal('modalProducto');
    },

    deleteProduct(id) {
        if (!UI.confirm('¿Está seguro de eliminar este producto?')) return;

        const productos = Storage.get(KEYS.PRODUCTOS);
        Storage.set(KEYS.PRODUCTOS, productos.filter(p => p.id !== id));

        UI.showToast('Producto eliminado', 'success');
        this.renderTable();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    filterTable(search = null, categoria = null) {
        search = search || document.getElementById('searchInventario')?.value || '';
        categoria = categoria || document.getElementById('filterInventarioCategoria')?.value || '';

        let productos = Storage.get(KEYS.PRODUCTOS, []);

        if (search) {
            productos = productos.filter(p =>
                p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toString().includes(search)
            );
        }

        if (categoria) {
            productos = productos.filter(p => p.categoria === categoria);
        }

        const tbody = document.querySelector('#inventarioTable tbody');

        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No se encontraron productos</td></tr>';
            return;
        }

        tbody.innerHTML = productos.map(producto => `
            <tr>
                <td>#${producto.id}</td>
                <td><strong>${producto.nombre}</strong></td>
                <td>${UI.getCategoryBadge(producto.categoria)}</td>
                <td>${UI.getStockIndicator(producto.stock, producto.stockMin)}</td>
                <td>${UI.formatCurrency(producto.precio)}</td>
                <td>${this.getStockStatus(producto.stock, producto.stockMin)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" data-edit="${producto.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" data-delete="${producto.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    exportData() {
        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const csv = [
            ['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Stock Mínimo'].join(','),
            ...productos.map(p => [p.id, `"${p.nombre}"`, p.categoria, p.precio, p.stock, p.stockMin].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        UI.showToast('Datos exportados exitosamente', 'success');
    },

    refresh() {
        this.renderTable();
    }
};

// ============================================
// MÓDULO: EMPLEADOS
// ============================================
const Empleados = {
    editingId: null,

    init() {
        this.renderCards();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('btnNuevoEmpleado')?.addEventListener('click', () => this.openNewEmployeeModal());
        document.getElementById('searchEmpleados')?.addEventListener('input', (e) => this.filterCards(e.target.value));
        document.getElementById('filterEmpleadosCargo')?.addEventListener('change', (e) => this.filterCards(null, e.target.value));
        document.getElementById('btnGuardarEmpleado')?.addEventListener('click', () => this.saveEmployee());

        const empleadosSection = document.getElementById('empleados');
        if (empleadosSection) {
            empleadosSection.addEventListener('click', (e) => {
                const editBtn = e.target.closest('button[data-edit-emp]');
                const deleteBtn = e.target.closest('button[data-delete-emp]');
                if (editBtn) {
                    e.preventDefault();
                    const id = parseInt(editBtn.getAttribute('data-edit-emp'));
                    this.editEmployee(id);
                } else if (deleteBtn) {
                    e.preventDefault();
                    const id = parseInt(deleteBtn.getAttribute('data-delete-emp'));
                    this.deleteEmployee(id);
                }
            });
        }
    },

    openNewEmployeeModal() {
        this.editingId = null;
        document.getElementById('empleadoNombre').value = '';
        document.getElementById('empleadoCargo').value = '';
        document.getElementById('empleadoTelefono').value = '';
        document.getElementById('empleadoEmail').value = '';
        document.getElementById('empleadoSalario').value = '';
        document.getElementById('empleadoEstado').value = 'activo';
        UI.openModal('modalEmpleado');
    },

    saveEmployee() {
        const nombre = document.getElementById('empleadoNombre').value.trim();
        const cargo = document.getElementById('empleadoCargo').value;
        const telefono = document.getElementById('empleadoTelefono').value.trim();
        const email = document.getElementById('empleadoEmail').value.trim();
        const salario = parseFloat(document.getElementById('empleadoSalario').value) || 0;
        const estado = document.getElementById('empleadoEstado').value;

        if (!nombre) {
            UI.showToast('Ingrese un nombre', 'warning');
            return;
        }

        if (!cargo) {
            UI.showToast('Seleccione un cargo', 'warning');
            return;
        }

        const empleados = Storage.get(KEYS.EMPLEADOS, []);

        if (this.editingId) {
            const index = empleados.findIndex(e => e.id === this.editingId);
            if (index !== -1) {
                empleados[index] = { ...empleados[index], nombre, cargo, telefono, email, salario: Math.round(salario), estado };
                Storage.set(KEYS.EMPLEADOS, empleados);
                UI.showToast('Empleado actualizado exitosamente', 'success');
            }
        } else {
            const newId = empleados.length > 0 ? Math.max(...empleados.map(e => e.id)) + 1 : 1;
            empleados.push({ id: newId, nombre, cargo, telefono, email, salario: Math.round(salario), estado });
            Storage.set(KEYS.EMPLEADOS, empleados);
            UI.showToast('Empleado registrado exitosamente', 'success');
        }

        UI.closeModal('modalEmpleado');
        this.renderCards();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    renderCards() {
        const empleados = Storage.get(KEYS.EMPLEADOS, []);
        const container = document.getElementById('empleadosCards');

        if (empleados.length === 0) {
            container.innerHTML = UI.getEmptyState('fa-users', 'No hay empleados registrados');
            return;
        }

        container.innerHTML = empleados.map(empleado => `
            <div class="empleado-card">
                <div class="empleado-card-avatar">
                    ${this.getInitials(empleado.nombre)}
                </div>
                <h3 class="empleado-card-name">${empleado.nombre}</h3>
                <p class="empleado-card-cargo">${this.capitalize(empleado.cargo)}</p>
                <div class="empleado-card-info">
                    <div class="empleado-card-row">
                        <span>Teléfono</span>
                        <span>${empleado.telefono || '-'}</span>
                    </div>
                    <div class="empleado-card-row">
                        <span>Email</span>
                        <span>${empleado.email || '-'}</span>
                    </div>
                    <div class="empleado-card-row">
                        <span>Salario</span>
                        <span>${UI.formatCurrency(empleado.salario)}</span>
                    </div>
                    <div class="empleado-card-row">
                        <span>Estado</span>
                        <span>${UI.getStatusBadge(empleado.estado)}</span>
                    </div>
                </div>
                <div class="empleado-card-actions">
                    <button class="btn btn-sm btn-secondary" data-edit-emp="${empleado.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" data-delete-emp="${empleado.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    },

    editEmployee(id) {
        const empleados = Storage.get(KEYS.EMPLEADOS);
        const empleado = empleados.find(e => e.id === id);

        if (!empleado) return;

        document.getElementById('empleadoNombre').value = empleado.nombre;
        document.getElementById('empleadoCargo').value = empleado.cargo;
        document.getElementById('empleadoTelefono').value = empleado.telefono || '';
        document.getElementById('empleadoEmail').value = empleado.email || '';
        document.getElementById('empleadoSalario').value = empleado.salario || '';
        document.getElementById('empleadoEstado').value = empleado.estado;

        this.editingId = id;
        UI.openModal('modalEmpleado');
    },

    deleteEmployee(id) {
        if (!UI.confirm('¿Está seguro de eliminar este empleado?')) return;

        const empleados = Storage.get(KEYS.EMPLEADOS);
        Storage.set(KEYS.EMPLEADOS, empleados.filter(e => e.id !== id));

        UI.showToast('Empleado eliminado', 'success');
        this.renderCards();

        if (document.getElementById('dashboard').classList.contains('active')) {
            Dashboard.refresh();
        }
    },

    filterCards(search = null, cargo = null) {
        search = search || document.getElementById('searchEmpleados')?.value || '';
        cargo = cargo || document.getElementById('filterEmpleadosCargo')?.value || '';

        let empleados = Storage.get(KEYS.EMPLEADOS, []);

        if (search) {
            empleados = empleados.filter(e =>
                e.nombre.toLowerCase().includes(search.toLowerCase()) ||
                e.id.toString().includes(search)
            );
        }

        if (cargo) {
            empleados = empleados.filter(e => e.cargo === cargo);
        }

        const container = document.getElementById('empleadosCards');

        if (empleados.length === 0) {
            container.innerHTML = UI.getEmptyState('fa-users', 'No se encontraron empleados');
            return;
        }

        container.innerHTML = empleados.map(empleado => `
            <div class="empleado-card">
                <div class="empleado-card-avatar">
                    ${this.getInitials(empleado.nombre)}
                </div>
                <h3 class="empleado-card-name">${empleado.nombre}</h3>
                <p class="empleado-card-cargo">${this.capitalize(empleado.cargo)}</p>
                <div class="empleado-card-info">
                    <div class="empleado-card-row">
                        <span>Teléfono</span>
                        <span>${empleado.telefono || '-'}</span>
                    </div>
                    <div class="empleado-card-row">
                        <span>Email</span>
                        <span>${empleado.email || '-'}</span>
                    </div>
                    <div class="empleado-card-row">
                        <span>Salario</span>
                        <span>${UI.formatCurrency(empleado.salario)}</span>
                    </div>
                    <div class="empleado-card-row">
                        <span>Estado</span>
                        <span>${UI.getStatusBadge(empleado.estado)}</span>
                    </div>
                </div>
                <div class="empleado-card-actions">
                    <button class="btn btn-sm btn-secondary" data-edit-emp="${empleado.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" data-delete-emp="${empleado.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    refresh() {
        this.renderCards();
    }
};

// ============================================
// MÓDULO: CONFIGURACION
// ============================================
const Configuracion = {
    init() {
        this.loadConfig();
        this.loadSettings();
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('formRestaurante')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConfig();
        });

        document.getElementById('temaOscuro')?.addEventListener('change', (e) => {
            this.updateSetting('temaOscuro', e.target.checked);
        });

        document.getElementById('sidebarColapsado')?.addEventListener('change', (e) => {
            this.updateSetting('sidebarColapsado', e.target.checked);
        });

        document.getElementById('btnBackup')?.addEventListener('click', () => this.exportBackup());
        document.getElementById('btnRestore')?.addEventListener('click', () => this.importBackup());
        document.getElementById('btnResetData')?.addEventListener('click', () => this.resetData());
    },

    loadConfig() {
        const config = Storage.get(KEYS.CONFIG, {});
        document.getElementById('nombreRestaurante').value = config.nombre || '';
        document.getElementById('direccionRestaurante').value = config.direccion || '';
        document.getElementById('telefonoRestaurante').value = config.telefono || '';
        document.getElementById('emailRestaurante').value = config.email || '';
    },

    saveConfig() {
        const config = {
            nombre: document.getElementById('nombreRestaurante').value.trim(),
            direccion: document.getElementById('direccionRestaurante').value.trim(),
            telefono: document.getElementById('telefonoRestaurante').value.trim(),
            email: document.getElementById('emailRestaurante').value.trim()
        };

        Storage.set(KEYS.CONFIG, config);
        UI.showToast('Configuración guardada exitosamente', 'success');
    },

    loadSettings() {
        const settings = Storage.get(KEYS.SETTINGS, {});
        document.getElementById('temaOscuro').checked = settings.temaOscuro || false;
        document.getElementById('sidebarColapsado').checked = settings.sidebarColapsado || false;
        this.applySettings(settings);
    },

    updateSetting(key, value) {
        const settings = Storage.get(KEYS.SETTINGS, {});
        settings[key] = value;
        Storage.set(KEYS.SETTINGS, settings);
        this.applySettings(settings);
    },

    applySettings(settings) {
        if (settings.temaOscuro) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        const sidebar = document.getElementById('sidebar');
        if (settings.sidebarColapsado && sidebar) {
            sidebar.classList.add('collapsed');
        } else if (sidebar) {
            sidebar.classList.remove('collapsed');
        }
    },

    exportBackup() {
        const data = Storage.exportData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_antony_chef_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        UI.showToast('Backup exportado exitosamente', 'success');
    },

    importBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (Storage.importData(data)) {
                        UI.showToast('Backup importado exitosamente', 'success');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        UI.showToast('Error al importar backup', 'error');
                    }
                } catch (error) {
                    UI.showToast('Archivo inválido', 'error');
                }
            };
            reader.readAsText(file);
        });

        input.click();
    },

    resetData() {
        if (!UI.confirm('¿Está seguro de resetear todos los datos? Esta acción no se puede deshacer.')) return;
        if (!UI.confirm('¿Realmente está seguro? Se perderán todos los datos.')) return;

        Storage.clear();
        initializeData();
        UI.showToast('Datos reseteados exitosamente', 'success');
        setTimeout(() => location.reload(), 1000);
    },

    refresh() {
        this.loadConfig();
        this.loadSettings();
    }
};

// ============================================
// MÓDULO: NAVIGATION
// ============================================
const Navigation = {
    currentModule: 'dashboard',
    modules: {},
    history: [],

    register(name, module) {
        this.modules[name] = module;
    },

    init() {
        this.setupEventListeners();
        this.setupHashRouting();
        this.loadFromHashOrStorage();
        this.setupBackButton();
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.dataset.section;
                if (module) {
                    this.navigateTo(module);
                }
            });
        });

        document.querySelectorAll('.card-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.dataset.section;
                if (module) {
                    this.navigateTo(module);
                }
            });
        });

        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.module) {
                this.loadModule(e.state.module, false);
            }
        });
    },

    setupHashRouting() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && this.modules[hash]) {
                this.navigateTo(hash, false);
            }
        });
    },

    loadFromHashOrStorage() {
        const hash = window.location.hash.slice(1);
        const lastModule = localStorage.getItem('lastModule');

        if (hash && this.modules[hash]) {
            this.navigateTo(hash, false);
        } else if (lastModule && this.modules[lastModule]) {
            this.navigateTo(lastModule, false);
        } else {
            this.navigateTo('dashboard', false);
        }
    },

    navigateTo(module, updateHistory = true) {
        if (!this.modules[module]) {
            console.error(`Module "${module}" not registered`);
            return;
        }

        if (this.currentModule === module && updateHistory) {
            return;
        }

        if (updateHistory) {
            this.history.push(this.currentModule);
            window.history.pushState({ module }, '', `#${module}`);
        }

        this.loadModule(module);
        localStorage.setItem('lastModule', module);
    },

    loadModule(module, animate = true) {
        const contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) return;

        if (animate) {
            contentWrapper.style.opacity = '0';
            contentWrapper.style.transform = 'translateY(10px)';
        }

        setTimeout(() => {
            this.updateActiveNav(module);
            this.updateHeaderTitle(module);

            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(module);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (this.modules[module]?.init && !this.modules[module].initialized) {
                this.modules[module].init();
                this.modules[module].initialized = true;
            }

            if (this.modules[module]?.refresh) {
                this.modules[module].refresh();
            }

            this.currentModule = module;

            if (animate) {
                contentWrapper.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                contentWrapper.style.opacity = '1';
                contentWrapper.style.transform = 'translateY(0)';
            }

            window.dispatchEvent(new CustomEvent('moduleChange', {
                detail: { module, previous: this.history[this.history.length - 1] }
            }));

        }, animate ? 50 : 0);
    },

    updateActiveNav(module) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === module) {
                link.classList.add('active');
            }
        });
    },

    updateHeaderTitle(module) {
        const titles = {
            dashboard: 'Dashboard',
            ventas: 'Ventas',
            gastos: 'Gastos',
            inventario: 'Inventario',
            empleados: 'Empleados',
            configuracion: 'Configuración'
        };

        const titleEl = document.getElementById('headerTitle');
        if (titleEl) {
            titleEl.textContent = titles[module] || 'Dashboard';
        }
    },

    setupBackButton() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (this.modules[this.currentModule]?.refresh) {
                    this.modules[this.currentModule].refresh();
                    UI.showToast('Datos actualizados', 'success');
                }
            });
        }
    },

    goBack() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            window.history.back();
            return previous;
        }
        return null;
    },

    getCurrentModule() {
        return this.currentModule;
    }
};

// ============================================
// APLICACIÓN PRINCIPAL
// ============================================
const App = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.warn('App ya está inicializada');
            return;
        }
        this.initialized = true;

        console.log('🚀 Iniciando Antony Chef...');

        initializeData();

        Navigation.register('dashboard', Dashboard);
        Navigation.register('ventas', Ventas);
        Navigation.register('gastos', Gastos);
        Navigation.register('inventario', Inventario);
        Navigation.register('empleados', Empleados);
        Navigation.register('configuracion', Configuracion);

        this.setupSidebar();
        this.setupHeaderActions();
        this.setupModals();

        Navigation.init();

        UI.updateDateDisplay();
        setInterval(() => UI.updateDateDisplay(), 60000);

        window.addEventListener('moduleChange', (e) => {
            console.log(`📍 Navegando a: ${e.detail.module}`);
        });

        console.log('✅ Antony Chef inicializado correctamente');
    },

    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const menuToggle = document.getElementById('menuToggle');

        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const settings = Storage.get(KEYS.SETTINGS, {});
            settings.sidebarColapsado = sidebar.classList.contains('collapsed');
            Storage.set(KEYS.SETTINGS, settings);
        });

        menuToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                setTimeout(() => ripple.remove(), 600);
            });
        });
    },

    setupHeaderActions() {
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            this.showNotifications();
        });
    },

    showNotifications() {
        const productos = Storage.get(KEYS.PRODUCTOS, []);
        const lowStock = productos.filter(p => p.stock <= p.stockMin);

        if (lowStock.length === 0) {
            UI.showToast('✅ No hay notificaciones nuevas', 'success');
        } else {
            UI.showToast(`⚠️ ${lowStock.length} productos con stock bajo`, 'warning');
        }
    },

    setupModals() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                UI.closeAllModals();
            });
        });

        document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                if (modalId) {
                    UI.closeModal(modalId);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                UI.closeAllModals();
            }
        });
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exportar para debugging
window.App = App;
window.Navigation = Navigation;
window.Dashboard = Dashboard;
window.Ventas = Ventas;
window.Gastos = Gastos;
window.Inventario = Inventario;
window.Empleados = Empleados;
window.Configuracion = Configuracion;
window.Storage = Storage;
window.UI = UI;
