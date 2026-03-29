/**
 * ========================================
 * ANTHONY CHEF - VENTAS MODULE
 * Punto de Venta (POS) y Gestión de Ventas
 * ========================================
 */

// ========================================
// ESTADO GLOBAL DEL MÓDULO
// ========================================
const VentasModule = (function () {
    'use strict';

    // Datos de ventas (simulados para demo)
    let ventasData = [
        { id: 'V001', fecha: '28/03 10:30', cliente: 'Juan Pérez', total: 45000, estado: 'pagado', metodo: 'efectivo' },
        { id: 'V002', fecha: '28/03 11:15', cliente: 'María García', total: 78500, estado: 'pagado', metodo: 'tarjeta' },
        { id: 'V003', fecha: '28/03 12:00', cliente: 'Carlos López', total: 32000, estado: 'pendiente', metodo: 'efectivo' },
        { id: 'V004', fecha: '28/03 12:45', cliente: 'Ana Rodríguez', total: 95200, estado: 'en-preparacion', metodo: 'transferencia' },
        { id: 'V005', fecha: '28/03 13:20', cliente: 'Roberto Martínez', total: 67800, estado: 'cancelado', metodo: 'tarjeta' },
        { id: 'V006', fecha: '28/03 14:05', cliente: 'Laura Sánchez', total: 123500, estado: 'pagado', metodo: 'tarjeta' }
    ];

    // Productos disponibles (simulados)
    const productosData = [
        { id: 'P001', nombre: 'Hamburguesa Clásica', precio: 25000, icono: 'fa-hamburger' },
        { id: 'P002', nombre: 'Hamburguesa Doble', precio: 35000, icono: 'fa-hamburger' },
        { id: 'P003', nombre: 'Papas Fritas', precio: 12000, icono: 'fa-drumstick-bite' },
        { id: 'P004', nombre: 'Gaseosa 1.5L', precio: 8000, icono: 'fa-bottle-water' },
        { id: 'P005', nombre: 'Jugo Natural', precio: 10000, icono: 'fa-glass-whiskey' },
        { id: 'P006', nombre: 'Perro Caliente', precio: 18000, icono: 'fa-hotdog' },
        { id: 'P007', nombre: 'Pizza Personal', precio: 28000, icono: 'fa-pizza-slice' },
        { id: 'P008', nombre: 'Ensalada César', precio: 22000, icono: 'fa-leaf' },
        { id: 'P009', nombre: 'Malteada', precio: 15000, icono: 'fa-ice-cream' },
        { id: 'P010', nombre: 'Brownie', precio: 9000, icono: 'fa-cookie' },
        { id: 'P011', nombre: 'Café Americano', precio: 5000, icono: 'fa-mug-hot' },
        { id: 'P012', nombre: 'Capuchino', precio: 8000, icono: 'fa-mug-hot' }
    ];

    // Carrito de compras
    let carrito = [];

    // Filtros actuales
    let filtrosActuales = {
        busqueda: '',
        fecha: 'all',
        metodo: 'all',
        estado: 'all'
    };

    // Referencias DOM
    let elements = {};

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    function init() {
        cacheElements();
        bindEvents();
        // Solo renderizar si los elementos existen
        if (elements.tablaBody) {
            renderTablaVentas();
        }
        if (elements.posListaProductos) {
            renderProductosPOS();
        }
    }

    // ========================================
    // CACHE DE ELEMENTOS DOM
    // ========================================
    function cacheElements() {
        // Buscador y filtros - usar selectores más específicos
        elements.searchInput = document.querySelector('.ventas-module .search-input');

        // Obtener todos los selectores compactos
        const filterSelects = document.querySelectorAll('.ventas-module .filter-select-compact');
        elements.filterFecha = filterSelects[0] || null;
        elements.filterMetodo = filterSelects[1] || null;
        // filterSelects[2] es Sucursal (owner-only)
        elements.filterEstado = filterSelects[3] || null;

        elements.btnFiltrar = document.querySelector('.ventas-module .btn-filter');

        // Tabla de ventas
        elements.tablaBody = document.querySelector('.ventas-module .ventas-table tbody');

        // Modal POS
        elements.modalNuevaVenta = document.getElementById('modal-nueva-venta');
        elements.posBuscarProducto = document.getElementById('pos-buscar-producto');
        elements.posListaProductos = document.getElementById('pos-lista-productos');
        elements.posCarritoItems = document.getElementById('pos-carrito-items');
        elements.posSubtotal = document.getElementById('pos-subtotal');
        elements.posImpuestos = document.getElementById('pos-impuestos');
        elements.posTotal = document.getElementById('pos-total');
        elements.posMetodoPago = document.getElementById('pos-metodo-pago');
        elements.posConfirmarVenta = document.getElementById('pos-confirmar-venta');

        // Modal detalle venta
        elements.modalDetalleVenta = document.getElementById('modal-detalle-venta');
    }

    // ========================================
    // BIND DE EVENTOS
    // ========================================
    function bindEvents() {
        // Buscador en tiempo real
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', function (e) {
                filtrosActuales.busqueda = e.target.value.trim();
                renderTablaVentas();
            });
        }

        // Filtros
        if (elements.filterFecha) {
            elements.filterFecha.addEventListener('change', function (e) {
                filtrosActuales.fecha = e.target.value;
                renderTablaVentas();
            });
        }

        if (elements.filterMetodo) {
            elements.filterMetodo.addEventListener('change', function (e) {
                filtrosActuales.metodo = e.target.value;
                renderTablaVentas();
            });
        }

        if (elements.filterEstado) {
            elements.filterEstado.addEventListener('change', function (e) {
                filtrosActuales.estado = e.target.value;
                renderTablaVentas();
            });
        }

        // Botón Nueva Venta - usar event delegation para mayor compatibilidad
        document.addEventListener('click', function (e) {
            const btnNuevaVenta = e.target.closest('.btn-new-sale');
            if (btnNuevaVenta) {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Botón Nueva Venta clickeado');
                abrirModalPOS();
            }
        });

        // Botón Filtrar - toggle para limpiar filtros
        if (elements.btnFiltrar) {
            elements.btnFiltrar.addEventListener('click', function () {
                // Verificar si hay filtros activos
                const hayFiltrosActivos =
                    filtrosActuales.busqueda !== '' ||
                    filtrosActuales.fecha !== 'all' ||
                    filtrosActuales.metodo !== 'all' ||
                    filtrosActuales.estado !== 'all';

                if (hayFiltrosActivos) {
                    resetFiltros();
                }
                // Si no hay filtros, no hacer nada (solo renderizar)
            });
        }

        // Modal POS - Buscar producto
        if (elements.posBuscarProducto) {
            elements.posBuscarProducto.addEventListener('input', function (e) {
                filtrarProductosPOS(e.target.value);
            });
        }

        // Modal POS - Confirmar venta
        if (elements.posConfirmarVenta) {
            elements.posConfirmarVenta.addEventListener('click', confirmarVenta);
        }

        // Cerrar modales con botones data-modal-close
        document.addEventListener('click', function (e) {
            if (e.target.closest('[data-modal-close]')) {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    modal.classList.remove('active');
                    if (modal.id === 'modal-nueva-venta') {
                        limpiarCarrito();
                    }
                }
            }
        });

        // Click fuera del modal (en el overlay) para cerrar
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                if (e.target.id === 'modal-nueva-venta') {
                    limpiarCarrito();
                }
            }
        });
    }

    // ========================================
    // TABLA DE VENTAS - FILTRADO
    // ========================================
    function renderTablaVentas() {
        if (!elements.tablaBody) return;

        // Filtrar ventas
        const ventasFiltradas = ventasData.filter(venta => {
            // Filtro de búsqueda (ID, cliente, método)
            const coincideBusqueda = !filtrosActuales.busqueda ||
                venta.id.toLowerCase().includes(filtrosActuales.busqueda.toLowerCase()) ||
                venta.cliente.toLowerCase().includes(filtrosActuales.busqueda.toLowerCase()) ||
                venta.metodo.toLowerCase().includes(filtrosActuales.busqueda.toLowerCase());

            // Filtro de método de pago
            const coincideMetodo = filtrosActuales.metodo === 'all' ||
                venta.metodo === filtrosActuales.metodo;

            // Filtro de estado
            const coincideEstado = filtrosActuales.estado === 'all' ||
                venta.estado === filtrosActuales.estado;

            // Filtro de fecha (simplificado para demo)
            let coincideFecha = true;
            if (filtrosActuales.fecha !== 'all' && filtrosActuales.fecha !== '') {
                // Aquí iría la lógica de filtrado por fecha
                coincideFecha = true; // Por ahora siempre coincide
            }

            return coincideBusqueda && coincideMetodo && coincideEstado && coincideFecha;
        });

        // Verificar modo oscuro
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#8b8ba8' : '#9ca3af';

        // Renderizar tabla
        if (ventasFiltradas.length === 0) {
            elements.tablaBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 3rem; color: ${textColor};">
                        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                        No se encontraron registros
                    </td>
                </tr>
            `;
            return;
        }

        elements.tablaBody.innerHTML = ventasFiltradas.map(venta => `
            <tr>
                <td><span class="ventas-id">${venta.id}</span></td>
                <td><span class="ventas-date">${venta.fecha}</span></td>
                <td><span class="ventas-cliente">${venta.cliente}</span></td>
                <td><span class="ventas-total">$${venta.total.toLocaleString()}</span></td>
                <td><span class="status-badge ${venta.estado}">${getEstadoLabel(venta.estado)}</span></td>
                <td><span class="ventas-method"><i class="fas ${getMetodoIcon(venta.metodo)}"></i> ${getMetodoLabel(venta.metodo)}</span></td>
                <td>
                    <div class="ventas-actions">
                        <button class="btn-icon-ventas" title="Ver detalle" onclick="VentasModule.verDetalleVenta('${venta.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon-ventas" title="Imprimir" onclick="VentasModule.imprimirVenta('${venta.id}')">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ========================================
    // UTILIDADES - ESTADOS Y MÉTODOS
    // ========================================
    function getEstadoLabel(estado) {
        const labels = {
            'pagado': 'Pagado',
            'pendiente': 'Pendiente',
            'cancelado': 'Cancelado',
            'en-preparacion': 'En preparación'
        };
        return labels[estado] || estado;
    }

    function getMetodoLabel(metodo) {
        const labels = {
            'efectivo': 'Efectivo',
            'tarjeta': 'Tarjeta',
            'transferencia': 'Transferencia'
        };
        return labels[metodo] || metodo;
    }

    function getMetodoIcon(metodo) {
        const icons = {
            'efectivo': 'fa-money-bill',
            'tarjeta': 'fa-credit-card',
            'transferencia': 'fa-university'
        };
        return icons[metodo] || 'fa-money-bill';
    }

    // ========================================
    // MODAL POS - NUEVA VENTA
    // ========================================
    function abrirModalPOS() {
        console.log('📦 Abriendo modal POS...');

        if (elements.modalNuevaVenta) {
            console.log('✅ Modal encontrado, agregando clase active');
            // Agregar clase active para mostrar con animación
            elements.modalNuevaVenta.classList.add('active');

            renderProductosPOS();
            actualizarCarritoUI();
        } else {
            console.error('❌ Modal no encontrado');
        }
    }

    function cerrarModalPOS() {
        if (elements.modalNuevaVenta) {
            elements.modalNuevaVenta.classList.remove('active');
        }
    }

    function renderProductosPOS(filtro = '') {
        if (!elements.posListaProductos) return;

        const productosFiltrados = productosData.filter(prod =>
            prod.nombre.toLowerCase().includes(filtro.toLowerCase())
        );

        if (productosFiltrados.length === 0) {
            elements.posListaProductos.innerHTML = `
                <div class="pos-empty-cart">
                    <i class="fas fa-search"></i>
                    <span>No se encontraron productos</span>
                </div>
            `;
            return;
        }

        elements.posListaProductos.innerHTML = productosFiltrados.map(prod => `
            <div class="pos-product-card" onclick="VentasModule.agregarAlCarrito('${prod.id}')">
                <div class="pos-product-icon">
                    <i class="fas ${prod.icono}"></i>
                </div>
                <div class="pos-product-name">${prod.nombre}</div>
                <div class="pos-product-price">$${prod.precio.toLocaleString()}</div>
            </div>
        `).join('');
    }

    function filtrarProductosPOS(filtro) {
        renderProductosPOS(filtro);
    }

    // ========================================
    // CARRITO DE COMPRAS
    // ========================================
    function agregarAlCarrito(productId) {
        const producto = productosData.find(p => p.id === productId);
        if (!producto) return;

        const itemExistente = carrito.find(item => item.id === productId);

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        actualizarCarritoUI();
    }

    function removerDelCarrito(productId) {
        const itemExistente = carrito.find(item => item.id === productId);

        if (itemExistente) {
            if (itemExistente.cantidad > 1) {
                itemExistente.cantidad--;
            } else {
                carrito = carrito.filter(item => item.id !== productId);
            }
        }

        actualizarCarritoUI();
    }

    function eliminarItemCarrito(productId) {
        carrito = carrito.filter(item => item.id !== productId);
        actualizarCarritoUI();
    }

    function limpiarCarrito() {
        carrito = [];
        actualizarCarritoUI();
    }

    function actualizarCarritoUI() {
        if (!elements.posCarritoItems) return;

        if (carrito.length === 0) {
            elements.posCarritoItems.innerHTML = `
                <div class="pos-empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span>El carrito está vacío</span>
                </div>
            `;
            elements.posSubtotal.textContent = '$0';
            elements.posImpuestos.textContent = '$0';
            elements.posTotal.textContent = '$0';
            return;
        }

        elements.posCarritoItems.innerHTML = carrito.map(item => `
            <div class="pos-cart-item">
                <div class="pos-cart-item-info">
                    <div class="pos-cart-item-name">${item.nombre}</div>
                </div>
                <div class="pos-cart-item-controls">
                    <button class="pos-cart-item-btn" onclick="VentasModule.removerDelCarrito('${item.id}')">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="pos-cart-item-qty">${item.cantidad}</span>
                    <button class="pos-cart-item-btn" onclick="VentasModule.agregarAlCarrito('${item.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="pos-cart-item-price">$${(item.precio * item.cantidad).toLocaleString()}</div>
                <button class="pos-cart-item-remove" onclick="VentasModule.eliminarItemCarrito('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Calcular totales
        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const impuestos = subtotal * 0.19;
        const total = subtotal + impuestos;

        elements.posSubtotal.textContent = `$${subtotal.toLocaleString()}`;
        elements.posImpuestos.textContent = `$${impuestos.toLocaleString()}`;
        elements.posTotal.textContent = `$${total.toLocaleString()}`;
    }

    // ========================================
    // CONFIRMAR VENTA
    // ========================================
    function confirmarVenta() {
        if (carrito.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de confirmar.');
            return;
        }

        const metodoPago = elements.posMetodoPago?.value || 'efectivo';
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const impuestos = total * 0.19;
        const totalConImpuestos = total + impuestos;

        // Crear nueva venta
        const nuevaVenta = {
            id: 'V' + String(ventasData.length + 1).padStart(3, '0'),
            fecha: new Date().toLocaleString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(',', ''),
            cliente: 'Cliente Mostrador',
            total: Math.round(totalConImpuestos),
            estado: 'pagado',
            metodo: metodoPago,
            items: [...carrito]
        };

        // Agregar a las ventas
        ventasData.unshift(nuevaVenta);

        // Mostrar mensaje de éxito
        showToast('Venta realizada con éxito', 'success');

        // Cerrar modal y limpiar
        cerrarModalPOS();
        limpiarCarrito();
        renderTablaVentas();
    }

    // ========================================
    // VER DETALLE DE VENTA
    // ========================================
    function verDetalleVenta(ventaId) {
        const venta = ventasData.find(v => v.id === ventaId);
        if (!venta) return;

        // Llenar los datos del modal
        const elementosDetalle = {
            'venta-id': venta.id,
            'venta-fecha': venta.fecha,
            'venta-estado': getEstadoLabel(venta.estado),
            'venta-cliente': venta.cliente,
            'venta-metodo': getMetodoLabel(venta.metodo),
            'venta-subtotal': `$${venta.total.toLocaleString()}`,
            'venta-impuestos': `$${Math.round(venta.total * 0.19).toLocaleString()}`,
            'venta-total': `$${venta.total.toLocaleString()}`,
            'venta-observaciones': 'Sin observaciones'
        };

        Object.entries(elementosDetalle).forEach(([id, valor]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = valor;
        });

        // Renderizar productos (simulados para demo)
        const productosBody = document.getElementById('venta-productos-body');
        if (productosBody) {
            if (venta.items && venta.items.length > 0) {
                productosBody.innerHTML = venta.items.map(item => `
                    <tr>
                        <td>${item.nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.precio.toLocaleString()}</td>
                        <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
                    </tr>
                `).join('');
            } else {
                productosBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; color: #9ca3af; padding: 1rem;">
                            Productos no disponibles
                        </td>
                    </tr>
                `;
            }
        }

        // Mostrar modal
        const modalDetalle = document.getElementById('modal-detalle-venta');
        if (modalDetalle) {
            modalDetalle.style.display = 'flex';
        }
    }

    // ========================================
    // IMPRIMIR VENTA
    // ========================================
    function imprimirVenta(ventaId) {
        const venta = ventasData.find(v => v.id === ventaId);
        if (!venta) return;

        // Simular impresión
        showToast('Imprimiendo ticket de venta...', 'info');
        console.log('Imprimiendo venta:', venta);

        // En producción, aquí iría la lógica de impresión real
        // window.print() o una API de impresión de tickets
    }

    // ========================================
    // TOAST NOTIFICATION
    // ========================================
    function showToast(message, type = 'info') {
        // Verificar si existe el sistema de toasts global
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }

        // Fallback: crear toast temporal
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // RESET FILTROS
    // ========================================
    function resetFiltros() {
        filtrosActuales = {
            busqueda: '',
            fecha: 'all',
            metodo: 'all',
            estado: 'all'
        };

        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.filterFecha) elements.filterFecha.value = 'all';
        if (elements.filterMetodo) elements.filterMetodo.value = 'all';
        if (elements.filterEstado) elements.filterEstado.value = 'all';

        renderTablaVentas();
    }

    // ========================================
    // API PÚBLICA
    // ========================================
    return {
        init,
        agregarAlCarrito,
        removerDelCarrito,
        eliminarItemCarrito,
        verDetalleVenta,
        imprimirVenta,
        resetFiltros,
        renderTablaVentas,
        abrirModalPOS,
        cerrarModalPOS
    };
})();

// ========================================
// INICIALIZAR CUANDO EL DOM ESTÉ LISTO
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar módulo de ventas
    VentasModule.init();

    // También inicializar cuando se navegue a la vista de Ventas
    const navLinkVentas = document.querySelector('.nav-link[data-module="ventas"]');
    if (navLinkVentas) {
        navLinkVentas.addEventListener('click', function () {
            setTimeout(() => {
                const ventasView = document.querySelector('.view-ventas');
                if (ventasView && ventasView.classList.contains('active')) {
                    VentasModule.renderTablaVentas();
                }
            }, 100);
        });
    }
});

// ========================================
// AGREGAR ANIMACIONES CSS PARA TOASTS
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
