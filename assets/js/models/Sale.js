/**
 * ========================================
 * ANTHONY CHEF - SALE MODEL
 * Modelo de Ventas
 * ========================================
 */

// ========================================
// CONSTANTES Y CONFIGURACIÓN
// ========================================

const SALE_STORAGE_KEY = 'anthony_chef_sales';

const SALE_STATUS = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    CANCELLED: 'cancelled'
};

const PAYMENT_METHODS = {
    CASH: 'efectivo',
    CARD: 'tarjeta',
    TRANSFER: 'transferencia',
    NEQUI: 'nequi',
    DATEFONO: 'daviplata'
};

// ========================================
// CLASE SALE
// ========================================

class Sale {
    constructor({
        id = null,
        codigo = '',
        customerId = null,
        customerName = '',
        items = [],
        subtotal = 0,
        discount = 0,
        total = 0,
        paymentMethod = PAYMENT_METHODS.CASH,
        status = SALE_STATUS.COMPLETED,
        branchId = null,
        sellerId = null,
        notes = '',
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id || this.generateId();
        this.codigo = codigo || this.generateCode();
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items;
        this.subtotal = subtotal;
        this.discount = discount;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.branchId = branchId;
        this.sellerId = sellerId;
        this.notes = notes;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Genera un ID único para la venta
     */
    generateId() {
        return 'sale_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Genera código consecutivo para la venta
     */
    generateCode() {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `V-${year}${month}${day}-${random}`;
    }

    /**
     * Convierte la venta a objeto plano
     */
    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            customerId: this.customerId,
            customerName: this.customerName,
            items: this.items,
            subtotal: this.subtotal,
            discount: this.discount,
            total: this.total,
            paymentMethod: this.paymentMethod,
            status: this.status,
            branchId: this.branchId,
            sellerId: this.sellerId,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Valida los datos de la venta
     */
    validate() {
        const errors = [];

        if (!this.items || this.items.length === 0) {
            errors.push('La venta debe tener al menos un producto');
        }

        if (this.total <= 0) {
            errors.push('El total debe ser mayor a cero');
        }

        if (!Object.values(SALE_STATUS).includes(this.status)) {
            errors.push('Estado de venta inválido');
        }

        if (!Object.values(PAYMENT_METHODS).includes(this.paymentMethod)) {
            errors.push('Método de pago inválido');
        }

        // Validar items
        this.items.forEach((item, index) => {
            if (!item.productId || !item.quantity || !item.price) {
                errors.push(`El item ${index + 1} tiene datos inválidos`);
            }
            if (item.quantity <= 0) {
                errors.push(`La cantidad del item ${index + 1} debe ser mayor a cero`);
            }
            if (item.price < 0) {
                errors.push(`El precio del item ${index + 1} no puede ser negativo`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calcula el subtotal automáticamente
     */
    calculateSubtotal() {
        this.subtotal = this.items.reduce((sum, item) => 
            sum + (item.quantity * item.price), 0
        );
        return this.subtotal;
    }

    /**
     * Calcula el total con descuento
     */
    calculateTotal() {
        this.calculateSubtotal();
        this.total = this.subtotal - this.discount;
        return this.total;
    }

    /**
     * Agrega un item a la venta
     */
    addItem(product, quantity, price) {
        this.items.push({
            productId: product.id,
            productName: product.name,
            quantity,
            price,
            subtotal: quantity * price
        });
        this.calculateTotal();
    }

    /**
     * Remueve un item de la venta
     */
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.calculateTotal();
        }
    }
}

// ========================================
// SALE SERVICE
// ========================================

const SaleService = {
    /**
     * Obtiene todas las ventas desde localStorage
     */
    getAll() {
        const sales = localStorage.getItem(SALE_STORAGE_KEY);
        return sales ? JSON.parse(sales) : [];
    },

    /**
     * Guarda la colección de ventas en localStorage
     */
    saveAll(sales) {
        localStorage.setItem(SALE_STORAGE_KEY, JSON.stringify(sales));
    },

    /**
     * Busca una venta por ID
     */
    findById(id) {
        const sales = this.getAll();
        return sales.find(sale => sale.id === id) || null;
    },

    /**
     * Busca una venta por código
     */
    findByCode(code) {
        const sales = this.getAll();
        return sales.find(sale => sale.codigo === code) || null;
    },

    /**
     * Busca ventas por sucursal
     */
    findByBranch(branchId) {
        const sales = this.getAll();
        return sales.filter(sale => sale.branchId === branchId);
    },

    /**
     * Busca ventas por estado
     */
    findByStatus(status) {
        const sales = this.getAll();
        return sales.filter(sale => sale.status === status);
    },

    /**
     * Obtiene ventas completadas
     */
    getCompleted() {
        return this.findByStatus(SALE_STATUS.COMPLETED);
    },

    /**
     * Obtiene ventas por rango de fechas
     */
    findByDateRange(startDate, endDate, branchId = null) {
        let sales = this.getAll();
        
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        sales = sales.filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate >= start && saleDate <= end;
        });

        if (branchId) {
            sales = sales.filter(sale => sale.branchId === branchId);
        }

        return sales;
    },

    /**
     * Obtiene ventas de hoy
     */
    getToday(branchId = null) {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = startDate;
        return this.findByDateRange(startDate, endDate, branchId);
    },

    /**
     * Crea una nueva venta
     */
    create(saleData) {
        const sales = this.getAll();
        const newSale = new Sale(saleData);

        // Validar datos
        const validation = newSale.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        // Calcular totales
        newSale.calculateTotal();

        sales.push(newSale);
        this.saveAll(sales);
        return newSale.toJSON();
    },

    /**
     * Actualiza una venta existente
     */
    update(id, saleData) {
        const sales = this.getAll();
        const saleIndex = sales.findIndex(sale => sale.id === id);

        if (saleIndex === -1) {
            throw new Error('Venta no encontrada');
        }

        const updatedSale = {
            ...sales[saleIndex],
            ...saleData,
            updatedAt: new Date().toISOString()
        };

        // Recalcular totales
        const tempSale = new Sale(updatedSale);
        tempSale.calculateTotal();

        // Validar datos actualizados
        const validation = tempSale.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        sales[saleIndex] = tempSale.toJSON();
        this.saveAll(sales);
        return tempSale.toJSON();
    },

    /**
     * Cancela una venta
     */
    cancel(id) {
        return this.update(id, { status: SALE_STATUS.CANCELLED });
    },

    /**
     * Elimina una venta físicamente
     */
    delete(id) {
        const sales = this.getAll();
        const filteredSales = sales.filter(sale => sale.id !== id);

        if (filteredSales.length === sales.length) {
            throw new Error('Venta no encontrada');
        }

        this.saveAll(filteredSales);
        return true;
    },

    /**
     * Obtiene estadísticas de ventas
     */
    getStats(startDate, endDate, branchId = null) {
        let sales = this.findByDateRange(startDate, endDate, branchId);
        sales = sales.filter(s => s.status === SALE_STATUS.COMPLETED);

        const totalVentas = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalPedidos = sales.length;
        const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

        // Ventas por día
        const ventasPorDia = {};
        sales.forEach(sale => {
            const date = sale.createdAt.split('T')[0];
            if (!ventasPorDia[date]) {
                ventasPorDia[date] = 0;
            }
            ventasPorDia[date] += sale.total;
        });

        // Ventas por método de pago
        const ventasPorMetodo = {};
        sales.forEach(sale => {
            if (!ventasPorMetodo[sale.paymentMethod]) {
                ventasPorMetodo[sale.paymentMethod] = 0;
            }
            ventasPorMetodo[sale.paymentMethod] += sale.total;
        });

        return {
            totalVentas,
            totalPedidos,
            ticketPromedio,
            ventasPorDia,
            ventasPorMetodo
        };
    },

    /**
     * Obtiene las ventas más recientes
     */
    getRecent(limit = 10, branchId = null) {
        let sales = this.getCompleted();
        
        if (branchId) {
            sales = sales.filter(s => s.branchId === branchId);
        }

        return sales
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Sale, 
        SaleService, 
        SALE_STATUS, 
        PAYMENT_METHODS
    };
}
