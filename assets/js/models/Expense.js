/**
 * ========================================
 * ANTHONY CHEF - EXPENSE MODEL
 * Modelo de Gastos
 * ========================================
 */

// ========================================
// CONSTANTES Y CONFIGURACIÓN
// ========================================

const EXPENSE_STORAGE_KEY = 'anthony_chef_expenses';

const EXPENSE_CATEGORIES = {
    PROVEEDORES: 'proveedores',
    NOMINA: 'nomina',
    SERVICIOS: 'servicios',
    ARRIENDOS: 'arriendos',
    MANTENIMIENTO: 'mantenimiento',
    MARKETING: 'marketing',
    IMPUESTOS: 'impuestos',
    EQUIPOS: 'equipos',
    TRANSPORTE: 'transporte',
    VARIOS: 'varios'
};

const PAYMENT_METHODS = {
    CASH: 'efectivo',
    TRANSFER: 'transferencia',
    CARD: 'tarjeta_credito',
    DEBIT_CARD: 'tarjeta_debito',
    CHECK: 'cheque',
    NEQUI: 'nequi',
    DAVIPLATA: 'daviplata'
};

// ========================================
// CLASE EXPENSE
// ========================================

class Expense {
    constructor({
        id = null,
        codigo = '',
        category = EXPENSE_CATEGORIES.VARIOS,
        description = '',
        amount = 0,
        paymentMethod = PAYMENT_METHODS.CASH,
        date = null,
        branchId = null,
        providerName = '',
        providerNIT = '',
        invoiceNumber = '',
        notes = '',
        status = 'completed',
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id || this.generateId();
        this.codigo = codigo || this.generateCode();
        this.category = category;
        this.description = description;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.date = date || new Date().toISOString();
        this.branchId = branchId;
        this.providerName = providerName;
        this.providerNIT = providerNIT;
        this.invoiceNumber = invoiceNumber;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Genera un ID único para el gasto
     */
    generateId() {
        return 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Genera código consecutivo para el gasto
     */
    generateCode() {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `G-${year}${month}${day}-${random}`;
    }

    /**
     * Convierte el gasto a objeto plano
     */
    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            category: this.category,
            description: this.description,
            amount: this.amount,
            paymentMethod: this.paymentMethod,
            date: this.date,
            branchId: this.branchId,
            providerName: this.providerName,
            providerNIT: this.providerNIT,
            invoiceNumber: this.invoiceNumber,
            notes: this.notes,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Valida los datos del gasto
     */
    validate() {
        const errors = [];

        if (!this.description || this.description.trim() === '') {
            errors.push('La descripción es requerida');
        }

        if (this.amount <= 0) {
            errors.push('El monto debe ser mayor a cero');
        }

        if (!Object.values(EXPENSE_CATEGORIES).includes(this.category)) {
            errors.push('Categoría inválida');
        }

        if (!Object.values(PAYMENT_METHODS).includes(this.paymentMethod)) {
            errors.push('Método de pago inválido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Obtiene la categoría como texto formateado
     */
    getCategoryLabel() {
        const labels = {
            [EXPENSE_CATEGORIES.PROVEEDORES]: 'Proveedores',
            [EXPENSE_CATEGORIES.NOMINA]: 'Nómina',
            [EXPENSE_CATEGORIES.SERVICIOS]: 'Servicios Públicos',
            [EXPENSE_CATEGORIES.ARRIENDOS]: 'Arriendos',
            [EXPENSE_CATEGORIES.MANTENIMIENTO]: 'Mantenimiento',
            [EXPENSE_CATEGORIES.MARKETING]: 'Marketing',
            [EXPENSE_CATEGORIES.IMPUESTOS]: 'Impuestos',
            [EXPENSE_CATEGORIES.EQUIPOS]: 'Equipos',
            [EXPENSE_CATEGORIES.TRANSPORTE]: 'Transporte',
            [EXPENSE_CATEGORIES.VARIOS]: 'Varios'
        };
        return labels[this.category] || this.category;
    }

    /**
     * Obtiene el método de pago como texto formateado
     */
    getPaymentMethodLabel() {
        const labels = {
            [PAYMENT_METHODS.CASH]: 'Efectivo',
            [PAYMENT_METHODS.TRANSFER]: 'Transferencia',
            [PAYMENT_METHODS.CARD]: 'Tarjeta Crédito',
            [PAYMENT_METHODS.DEBIT_CARD]: 'Tarjeta Débito',
            [PAYMENT_METHODS.CHECK]: 'Cheque',
            [PAYMENT_METHODS.NEQUI]: 'Nequi',
            [PAYMENT_METHODS.DAVIPLATA]: 'Daviplata'
        };
        return labels[this.paymentMethod] || this.paymentMethod;
    }
}

// ========================================
// EXPENSE SERVICE
// ========================================

const ExpenseService = {
    /**
     * Obtiene todos los gastos desde localStorage
     */
    getAll() {
        const expenses = localStorage.getItem(EXPENSE_STORAGE_KEY);
        return expenses ? JSON.parse(expenses) : [];
    },

    /**
     * Guarda la colección de gastos en localStorage
     */
    saveAll(expenses) {
        localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(expenses));
    },

    /**
     * Busca un gasto por ID
     */
    findById(id) {
        const expenses = this.getAll();
        return expenses.find(expense => expense.id === id) || null;
    },

    /**
     * Busca un gasto por código
     */
    findByCode(code) {
        const expenses = this.getAll();
        return expenses.find(expense => expense.codigo === code) || null;
    },

    /**
     * Busca gastos por sucursal
     */
    findByBranch(branchId) {
        const expenses = this.getAll();
        return expenses.filter(expense => expense.branchId === branchId);
    },

    /**
     * Busca gastos por categoría
     */
    findByCategory(category) {
        const expenses = this.getAll();
        return expenses.filter(expense => expense.category === category);
    },

    /**
     * Busca gastos por rango de fechas
     */
    findByDateRange(startDate, endDate, branchId = null) {
        let expenses = this.getAll();
        
        expenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return expenseDate >= start && expenseDate <= end;
        });

        if (branchId) {
            expenses = expenses.filter(expense => expense.branchId === branchId);
        }

        return expenses;
    },

    /**
     * Obtiene gastos del mes actual
     */
    getCurrentMonth(branchId = null) {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return this.findByDateRange(startDate.toISOString(), endDate.toISOString(), branchId);
    },

    /**
     * Obtiene gastos del día actual
     */
    getToday(branchId = null) {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = startDate;
        return this.findByDateRange(startDate, endDate, branchId);
    },

    /**
     * Crea un nuevo gasto
     */
    create(expenseData) {
        const expenses = this.getAll();
        const newExpense = new Expense(expenseData);

        // Validar datos
        const validation = newExpense.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        expenses.push(newExpense);
        this.saveAll(expenses);
        return newExpense.toJSON();
    },

    /**
     * Actualiza un gasto existente
     */
    update(id, expenseData) {
        const expenses = this.getAll();
        const expenseIndex = expenses.findIndex(expense => expense.id === id);

        if (expenseIndex === -1) {
            throw new Error('Gasto no encontrado');
        }

        const updatedExpense = {
            ...expenses[expenseIndex],
            ...expenseData,
            updatedAt: new Date().toISOString()
        };

        // Validar datos actualizados
        const tempExpense = new Expense(updatedExpense);
        const validation = tempExpense.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        expenses[expenseIndex] = updatedExpense;
        this.saveAll(expenses);
        return updatedExpense;
    },

    /**
     * Elimina un gasto físicamente
     */
    delete(id) {
        const expenses = this.getAll();
        const filteredExpenses = expenses.filter(expense => expense.id !== id);

        if (filteredExpenses.length === expenses.length) {
            throw new Error('Gasto no encontrado');
        }

        this.saveAll(filteredExpenses);
        return true;
    },

    /**
     * Obtiene estadísticas de gastos
     */
    getStats(startDate, endDate, branchId = null) {
        let expenses = this.findByDateRange(startDate, endDate, branchId);

        const totalGastos = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Gastos por categoría
        const gastosPorCategoria = {};
        expenses.forEach(expense => {
            if (!gastosPorCategoria[expense.category]) {
                gastosPorCategoria[expense.category] = 0;
            }
            gastosPorCategoria[expense.category] += expense.amount;
        });

        // Gastos por día
        const gastosPorDia = {};
        expenses.forEach(expense => {
            const date = expense.date.split('T')[0];
            if (!gastosPorDia[date]) {
                gastosPorDia[date] = 0;
            }
            gastosPorDia[date] += expense.amount;
        });

        // Gastos por método de pago
        const gastosPorMetodo = {};
        expenses.forEach(expense => {
            if (!gastosPorMetodo[expense.paymentMethod]) {
                gastosPorMetodo[expense.paymentMethod] = 0;
            }
            gastosPorMetodo[expense.paymentMethod] += expense.amount;
        });

        return {
            totalGastos,
            gastosPorCategoria,
            gastosPorDia,
            gastosPorMetodo,
            totalRegistros: expenses.length
        };
    },

    /**
     * Obtiene los gastos más recientes
     */
    getRecent(limit = 10, branchId = null) {
        let expenses = this.getAll();
        
        if (branchId) {
            expenses = expenses.filter(e => e.branchId === branchId);
        }

        return expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Expense, 
        ExpenseService, 
        EXPENSE_CATEGORIES, 
        PAYMENT_METHODS
    };
}
