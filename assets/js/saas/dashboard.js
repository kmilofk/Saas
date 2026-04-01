/**
 * ANTHONY CHEF - DASHBOARD JS
 * Panel Ejecutivo con datos reales de sucursales
 */

const Dashboard = {
    chartBarras: null,
    chartLinea: null,
    activeFilter: 'all',
    activeTransFilter: 'todas',

    SUCURSALES: [
        {
            id: 1, nombre: 'Sucursal San Cayetano', encargado: 'Maye Cortez',
            telefono: '(602) 555-1234', email: 'maye.cortez@anthonychef.com',
            direccion: 'Calle 5 #12-34, San Cayetano', empleados: 12,
            ventasMes: 52300000, pedidos: 1284, estado: 'activo',
            color: '#2D3A6B'
        },
        {
            id: 2, nombre: 'Sucursal Universidad Icesi', encargado: 'Thania Ortiz',
            telefono: '(602) 555-5678', email: 'thania.ortiz@anthonychef.com',
            direccion: 'Calle 18 #117-100, Ciudad Jardín', empleados: 10,
            ventasMes: 38450000, pedidos: 892, estado: 'activo',
            color: '#10B981'
        },
        {
            id: 3, nombre: 'Fábrica', encargado: 'Kevin Esteban Rojas',
            telefono: '(602) 555-9876', email: 'kevin.rojas@anthonychef.com',
            direccion: 'Zona Industrial Km 5 Vía Cali', empleados: 15,
            ventasMes: 28920000, pedidos: 654, estado: 'activo',
            color: '#F59E0B'
        }
    ],

    TRANSACCIONES: [
        { id: '#TRX-001', sucursal: 'San Cayetano', tipo: 'Venta en mostrador', monto: 125000, fecha: 'Hoy', estado: 'completado' },
        { id: '#TRX-002', sucursal: 'Icesi', tipo: 'Pedido online #4521', monto: 89500, fecha: 'Hoy', estado: 'completado' },
        { id: '#TRX-003', sucursal: 'Fábrica', tipo: 'Devolución producto', monto: -23400, fecha: 'Ayer', estado: 'cancelado' },
        { id: '#TRX-004', sucursal: 'San Cayetano', tipo: 'Transferencia bancaria', monto: 267800, fecha: 'Ayer', estado: 'procesando' },
        { id: '#TRX-005', sucursal: 'Icesi', tipo: 'Venta corporativa', monto: 456200, fecha: '29 Mar', estado: 'completado' }
    ],

    MENSUAL: {
        labels: ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'],
        data: [92, 98, 110, 105, 115, 119.67]
    },

    formatCurrency(val) {
        return '$' + val.toLocaleString('es-CO');
    },

    getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return 'Buenos días';
        if (h < 18) return 'Buenas tardes';
        return 'Buenas noches';
    },

    getActiveSucursales() {
        const val = this._selectedBranch || 'all';
        if (val === 'all') return this.SUCURSALES;
        return this.SUCURSALES.filter(s => s.id == val);
    },

    init() {
        this.renderGreeting();
        this.renderKPIs();
        this.renderCharts();
        this.renderTransactions('todas');
        this.updateMeta();
    },

    renderGreeting() {
        const greet = document.getElementById('greeting-text');
        const dateEl = document.getElementById('greeting-date');
        if (greet) greet.textContent = `${this.getGreeting()}, Angelica ☀️`;
        if (dateEl) {
            const now = new Date();
            dateEl.textContent = now.toLocaleDateString('es-CO', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        }
    },

    renderKPIs() {
        const suc = this.getActiveSucursales();
        const totalVentas = suc.reduce((a, s) => a + s.ventasMes, 0);
        const totalEmpleados = suc.reduce((a, s) => a + s.empleados, 0);
        const totalPedidos = suc.reduce((a, s) => a + s.pedidos, 0);

        const elV = document.getElementById('kpi-ventas');
        const elI = document.getElementById('kpi-ingresos');
        const elU = document.getElementById('kpi-usuarios');
        const elP = document.getElementById('kpi-productos');

        if (elV) elV.textContent = this.formatCurrency(totalVentas);
        if (elI) elI.textContent = this.formatCurrency(totalVentas);
        if (elU) elU.textContent = totalEmpleados;
        if (elP) elP.textContent = '3,421';

        // Quick metrics
        const qTicket = document.getElementById('quick-ticket');
        const qLider = document.getElementById('quick-lider');
        if (qTicket) qTicket.textContent = this.formatCurrency(42280);
        if (qLider) qLider.textContent = suc.length === 1 ? suc[0].nombre : 'San Cayetano';
    },

    renderCharts() {
        this.renderBarChart();
        this.renderLineChart();
    },

    renderBarChart() {
        const ctx = document.getElementById('chart-barras');
        if (!ctx) return;
        if (this.chartBarras) this.chartBarras.destroy();

        const suc = this.getActiveSucursales();

        this.chartBarras = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: suc.map(s => s.nombre.replace('Sucursal ', '')),
                datasets: [{
                    label: 'Ventas del Mes',
                    data: suc.map(s => s.ventasMes / 1000000),
                    backgroundColor: suc.map(s => s.color + 'CC'),
                    borderColor: suc.map(s => s.color),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                onClick: (e, elements) => {
                    if (elements.length > 0) {
                        const idx = elements[0].index;
                        this.showBranchSalesModal(suc[idx]);
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ' $' + (ctx.raw * 1000000).toLocaleString('es-CO')
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { callback: v => '$' + v + 'M' }
                    },
                    y: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    renderLineChart() {
        const ctx = document.getElementById('chart-linea');
        if (!ctx) return;
        if (this.chartLinea) this.chartLinea.destroy();

        const gradient = ctx.getContext('2d');
        const grad = gradient.createLinearGradient(0, 0, 0, 280);
        grad.addColorStop(0, 'rgba(59,130,246,0.25)');
        grad.addColorStop(1, 'rgba(59,130,246,0.02)');

        this.chartLinea = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.MENSUAL.labels,
                datasets: [{
                    label: 'Ventas (Millones)',
                    data: this.MENSUAL.data,
                    borderColor: '#3B82F6',
                    backgroundColor: grad,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6',
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
                        callbacks: {
                            label: ctx => ' $' + ctx.raw + 'M'
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { callback: v => '$' + v + 'M' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    showBranchSalesModal(suc) {
        const meses = ['Enero', 'Febrero', 'Marzo'];
        const baseVentas = [suc.ventasMes * 0.88, suc.ventasMes * 0.94, suc.ventasMes];
        Swal.fire({
            title: `📊 Ventas - ${suc.nombre}`,
            html: `
                <div style="text-align:left">
                    ${meses.map((m, i) => `
                    <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:12px 16px;margin-bottom:8px;background:#F8FAFF;border-radius:10px;border:1px solid #E8EDF5;">
                        <span style="font-weight:600;color:#1A1F36;">${m} 2026</span>
                        <span style="font-weight:700;color:#10B981;font-size:1.05rem;">${this.formatCurrency(Math.round(baseVentas[i]))}</span>
                    </div>`).join('')}
                    <div style="display:flex;justify-content:space-between;padding:12px 16px;
                        background:#0B132B;border-radius:10px;margin-top:4px;">
                        <span style="font-weight:700;color:white;">Encargado/a</span>
                        <span style="font-weight:600;color:#93C5FD;">${suc.encargado}</span>
                    </div>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#0B132B',
            width: '420px'
        });
    },

    _selectedBranch: 'all',

    filterBranch(value) {
        if (value !== undefined) this._selectedBranch = value;
        this.renderKPIs();
        this.renderBarChart();
    },

    renderTransactions(filter) {
        this.activeTransFilter = filter;
        const tbody = document.getElementById('transactions-body');
        if (!tbody) return;

        let data = this.TRANSACCIONES;
        if (filter === 'completadas') data = data.filter(t => t.estado === 'completado');

        const estadoConfig = {
            completado: { class: 'badge-success', text: 'Completado' },
            cancelado: { class: 'badge-danger', text: 'Cancelado' },
            procesando: { class: 'badge-warning', text: 'Procesando' }
        };

        tbody.innerHTML = data.map(t => {
            const cfg = estadoConfig[t.estado] || { class: 'badge-info', text: t.estado };
            const montoFmt = (t.monto < 0 ? '-' : '') + this.formatCurrency(Math.abs(t.monto));
            const montoColor = t.monto < 0 ? 'color:#EF4444;' : '';
            return `
            <tr>
                <td><span style="font-weight:600;color:#1A1F36;">${t.sucursal}</span></td>
                <td><span style="color:#5A6E8A;">${t.tipo} <strong>${t.id}</strong></span></td>
                <td><span style="font-weight:700;${montoColor}">${montoFmt}</span></td>
                <td><span style="color:#8898AA;">${t.fecha}</span></td>
                <td><span class="badge ${cfg.class}">${cfg.text}</span></td>
                <td>
                    <button class="btn-table-action" onclick="Dashboard.viewTransaction('${t.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');

        // Update active filter buttons
        document.querySelectorAll('.trans-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.filter === filter);
        });
    },

    viewTransaction(id) {
        const t = this.TRANSACCIONES.find(x => x.id === id);
        if (!t) return;
        const cfg = { completado: '#10B981', cancelado: '#EF4444', procesando: '#F59E0B' };
        Swal.fire({
            title: `Transacción ${t.id}`,
            html: `
                <div style="text-align:left;display:flex;flex-direction:column;gap:12px;margin-top:8px;">
                    <div style="display:flex;justify-content:space-between;padding:12px;background:#F8FAFF;border-radius:8px;">
                        <span style="color:#8898AA;font-size:.875rem;">Sucursal</span>
                        <span style="font-weight:600;">${t.sucursal}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:12px;background:#F8FAFF;border-radius:8px;">
                        <span style="color:#8898AA;font-size:.875rem;">Descripción</span>
                        <span style="font-weight:600;">${t.tipo}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:12px;background:#F8FAFF;border-radius:8px;">
                        <span style="color:#8898AA;font-size:.875rem;">Monto</span>
                        <span style="font-weight:700;color:${t.monto<0?'#EF4444':'#10B981'};font-size:1.1rem;">
                            ${(t.monto<0?'-':'') + this.formatCurrency(Math.abs(t.monto))}
                        </span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:12px;background:#F8FAFF;border-radius:8px;">
                        <span style="color:#8898AA;font-size:.875rem;">Fecha</span>
                        <span style="font-weight:600;">${t.fecha}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:12px;background:#F8FAFF;border-radius:8px;">
                        <span style="color:#8898AA;font-size:.875rem;">Estado</span>
                        <span style="font-weight:700;color:${cfg[t.estado]};">${t.estado.charAt(0).toUpperCase()+t.estado.slice(1)}</span>
                    </div>
                </div>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#0B132B',
            width: '400px'
        });
    },

    updateMeta() {
        const bar = document.getElementById('meta-bar');
        const txt = document.getElementById('meta-texto');
        if (bar) bar.style.width = '78%';
        if (txt) txt.textContent = '$119,670,000 de $150,000,000 — 15 días restantes';
    }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
