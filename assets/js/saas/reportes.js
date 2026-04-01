/**
 * ANTHONY CHEF - REPORTES JS
 * Generación y exportación de reportes
 */

const Reportes = {
    chart: null,

    // Datos estáticos de ejemplo
    data: {
        sucursales: [
            { id: 1, nombre: 'Sucursal Centro', ventas: 52300, meta: 60000, pedidos: 523, ticket: 100 },
            { id: 2, nombre: 'Sucursal Norte', ventas: 38450, meta: 45000, pedidos: 385, ticket: 100 },
            { id: 3, nombre: 'Sucursal Sur', ventas: 28920, meta: 35000, pedidos: 289, ticket: 100 }
        ],
        productos: [
            { id: 1, nombre: 'Hamburguesa Clásica', categoria: 'Comida Rápida', ventas: 1250, ingresos: 18750000 },
            { id: 2, nombre: 'Pizza Pepperoni', categoria: 'Pizzas', ventas: 980, ingresos: 24500000 },
            { id: 3, nombre: 'Hot Dog Especial', categoria: 'Comida Rápida', ventas: 875, ingresos: 8750000 },
            { id: 4, nombre: 'Ensalada César', categoria: 'Ensaladas', ventas: 720, ingresos: 10800000 },
            { id: 5, nombre: 'Gaseosa 1.5L', categoria: 'Bebidas', ventas: 650, ingresos: 3250000 },
            { id: 6, nombre: 'Jugo Natural', categoria: 'Bebidas', ventas: 580, ingresos: 4640000 },
            { id: 7, nombre: 'Papas Fritas', categoria: 'Complementos', ventas: 520, ingresos: 3120000 },
            { id: 8, nombre: 'Aros de Cebolla', categoria: 'Complementos', ventas: 480, ingresos: 3360000 },
            { id: 9, nombre: 'Helado', categoria: 'Postres', ventas: 420, ingresos: 2520000 },
            { id: 10, nombre: 'Brownie', categoria: 'Postres', ventas: 380, ingresos: 2660000 }
        ]
    },

    init() {
        this.renderSummary();
        this.renderChart();
        this.renderSucursalesTable();
        this.renderProductosTable();
    },

    renderSummary() {
        const totalVentas = this.data.sucursales.reduce((acc, s) => acc + s.ventas, 0);
        const totalPedidos = this.data.sucursales.reduce((acc, s) => acc + s.pedidos, 0);
        const promedio = totalVentas / this.data.sucursales.length;
        const activas = this.data.sucursales.filter(s => s.meta > 0).length;

        document.getElementById('report-ventas').textContent = this.formatCurrency(totalVentas);
        document.getElementById('report-promedio').textContent = this.formatCurrency(promedio);
        document.getElementById('report-pedidos').textContent = totalPedidos.toLocaleString();
        document.getElementById('report-sucursales').textContent = activas;
    },

    renderChart() {
        const ctx = document.getElementById('chart-sucursales').getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.sucursales.map(s => s.nombre),
                datasets: [{
                    label: 'Ventas',
                    data: this.data.sucursales.map(s => s.ventas),
                    backgroundColor: ['#2D3A6B', '#10B981', '#F59E0B'],
                    borderColor: ['#2D3A6B', '#10B981', '#F59E0B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + (value / 1000).toFixed(0) + 'K'
                        }
                    }
                }
            }
        });
    },

    renderSucursalesTable() {
        const totalVentas = this.data.sucursales.reduce((acc, s) => acc + s.ventas, 0);

        const tbody = document.getElementById('tabla-sucursales');
        tbody.innerHTML = this.data.sucursales.map(s => {
            const porcentaje = ((s.ventas / s.meta) * 100).toFixed(0);
            const cumplimientoClass = porcentaje >= 100 ? 'success' : porcentaje >= 80 ? 'warning' : 'danger';
            return `
                <tr>
                    <td><strong>${s.nombre}</strong></td>
                    <td>${this.formatCurrency(s.ventas)}</td>
                    <td>${s.pedidos.toLocaleString()}</td>
                    <td>${this.formatCurrency(s.ticket)}</td>
                    <td>
                        <span class="badge badge-${cumplimientoClass}">
                            ${porcentaje}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderProductosTable() {
        const tbody = document.getElementById('tabla-productos');
        tbody.innerHTML = this.data.productos.map((p, i) => `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria}</td>
                <td>${p.ventas.toLocaleString()}</td>
                <td>${this.formatCurrency(p.ingresos)}</td>
            </tr>
        `).join('');
    },

    formatCurrency(value) {
        return '$' + value.toLocaleString('es-CO');
    },

    generate() {
        const dateStart = document.getElementById('filter-date-start').value;
        const dateEnd = document.getElementById('filter-date-end').value;
        const sucursal = document.getElementById('filter-sucursal').value;
        const type = document.getElementById('filter-type').value;

        const sucursales = {
            'all': 'Todas las Sucursales',
            '1': 'Sucursal Centro',
            '2': 'Sucursal Norte',
            '3': 'Sucursal Sur'
        };

        const tipos = {
            'ventas': 'Ventas',
            'inventario': 'Inventario',
            'usuarios': 'Usuarios'
        };

        const filters = {
            fechaInicio: dateStart || 'No especificada',
            fechaFin: dateEnd || 'No especificada',
            sucursal: sucursales[sucursal],
            tipo: tipos[type]
        };

        Swal.fire({
            icon: 'success',
            title: 'Reporte Generado',
            html: `
                <div style="text-align: left;">
                    <p><strong>Filtros aplicados:</strong></p>
                    <p>📅 Inicio: ${filters.fechaInicio}</p>
                    <p>📅 Fin: ${filters.fechaFin}</p>
                    <p>🏪 Sucursal: ${filters.sucursal}</p>
                    <p>📊 Tipo: ${filters.tipo}</p>
                </div>
            `,
            confirmButtonText: 'Cerrar'
        });
    },

    exportPDF() {
        Swal.fire({
            icon: 'info',
            title: 'Exportar PDF',
            text: 'Generando archivo PDF...',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'PDF Exportado',
                text: 'El archivo se ha descargado correctamente',
                showConfirmButton: false,
                timer: 2000
            });
        });
    },

    exportExcel() {
        Swal.fire({
            icon: 'info',
            title: 'Exportar Excel',
            text: 'Generando archivo Excel...',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Excel Exportado',
                text: 'El archivo se ha descargado correctamente',
                showConfirmButton: false,
                timer: 2000
            });
        });
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => Reportes.init());
