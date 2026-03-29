/**
 * ========================================
 * ANTHONY CHEF - PRODUCT MODEL
 * Modelo de Productos para Inventario
 * ========================================
 */

// ========================================
// CONSTANTES Y CONFIGURACIÓN
// ========================================

const PRODUCT_STORAGE_KEY = 'anthony_chef_products';

const PRODUCT_CATEGORIES = {
    BEBIDAS: 'bebidas',
    ALIMENTOS: 'alimentos',
    INSUMOS: 'insumos',
    EMPAQUES: 'empaques',
    LIMPIEZA: 'limpieza',
    PAPELERIA: 'papeleria',
    OTROS: 'otros'
};

const PRODUCT_UNITS = {
    UNIDAD: 'unidad',
    KILOGRAMO: 'kilogramo',
    LITRO: 'litro',
    CAJA: 'caja',
    PAQUETE: 'paquete',
    GRAMO: 'gramo',
    MILILITRO: 'mililitro'
};

const STOCK_STATUS = {
    CRITICO: 'critico',      // Stock < 50% del mínimo
    BAJO: 'bajo',           // Stock < mínimo
    OPTIMO: 'optimo'        // Stock >= mínimo
};

// ========================================
// CLASE PRODUCT
// ========================================

class Product {
    constructor({
        id = null,
        codigo = '',
        name = '',
        category = PRODUCT_CATEGORIES.OTROS,
        unit = PRODUCT_UNITS.UNIDAD,
        stock = 0,
        stockMinimo = 0,
        costo = 0,
        venta = 0,
        ubicacion = '',
        branchId = null,
        proveedorId = null,
        status = 'active',
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id || this.generateId();
        this.codigo = codigo;
        this.name = name;
        this.category = category;
        this.unit = unit;
        this.stock = stock;
        this.stockMinimo = stockMinimo;
        this.costo = costo;
        this.venta = venta;
        this.ubicacion = ubicacion;
        this.branchId = branchId;
        this.proveedorId = proveedorId;
        this.status = status;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Genera un ID único para el producto
     */
    generateId() {
        return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Convierte el producto a objeto plano
     */
    toJSON() {
        return {
            id: this.id,
            codigo: this.codigo,
            name: this.name,
            category: this.category,
            unit: this.unit,
            stock: this.stock,
            stockMinimo: this.stockMinimo,
            costo: this.costo,
            venta: this.venta,
            ubicacion: this.ubicacion,
            branchId: this.branchId,
            proveedorId: this.proveedorId,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Valida los datos del producto
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('El nombre es requerido');
        }

        if (!this.codigo || this.codigo.trim() === '') {
            errors.push('El código es requerido');
        }

        if (this.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }

        if (this.stockMinimo < 0) {
            errors.push('El stock mínimo no puede ser negativo');
        }

        if (this.costo < 0) {
            errors.push('El costo no puede ser negativo');
        }

        if (this.venta < 0) {
            errors.push('El precio de venta no puede ser negativo');
        }

        if (!Object.values(PRODUCT_CATEGORIES).includes(this.category)) {
            errors.push('Categoría inválida');
        }

        if (!Object.values(PRODUCT_UNITS).includes(this.unit)) {
            errors.push('Unidad de medida inválida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Obtiene el estado del stock
     */
    getStockStatus() {
        if (this.stock === 0) {
            return STOCK_STATUS.CRITICO;
        }
        
        if (this.stock < this.stockMinimo * 0.5) {
            return STOCK_STATUS.CRITICO;
        }
        
        if (this.stock < this.stockMinimo) {
            return STOCK_STATUS.BAJO;
        }
        
        return STOCK_STATUS.OPTIMO;
    }

    /**
     * Verifica si el stock es bajo
     */
    isStockLow() {
        return this.stock < this.stockMinimo;
    }

    /**
     * Obtiene el margen de ganancia
     */
    getProfitMargin() {
        if (this.venta === 0 || this.costo === 0) {
            return 0;
        }
        return ((this.venta - this.costo) / this.costo) * 100;
    }

    /**
     * Obtiene el valor total del inventario
     */
    getInventoryValue() {
        return this.stock * this.costo;
    }
}

// ========================================
// PRODUCT SERVICE
// ========================================

const ProductService = {
    /**
     * Obtiene todos los productos desde localStorage
     */
    getAll() {
        const products = localStorage.getItem(PRODUCT_STORAGE_KEY);
        return products ? JSON.parse(products) : [];
    },

    /**
     * Guarda la colección de productos en localStorage
     */
    saveAll(products) {
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
    },

    /**
     * Busca un producto por ID
     */
    findById(id) {
        const products = this.getAll();
        return products.find(product => product.id === id) || null;
    },

    /**
     * Busca un producto por código
     */
    findByCode(code) {
        const products = this.getAll();
        return products.find(product => 
            product.codigo.toLowerCase() === code.toLowerCase()
        ) || null;
    },

    /**
     * Busca productos por nombre (búsqueda parcial)
     */
    findByName(name) {
        const products = this.getAll();
        return products.filter(product =>
            product.name.toLowerCase().includes(name.toLowerCase())
        );
    },

    /**
     * Busca productos por categoría
     */
    findByCategory(category) {
        const products = this.getAll();
        return products.filter(product => product.category === category);
    },

    /**
     * Busca productos por sucursal
     */
    findByBranch(branchId) {
        const products = this.getAll();
        return products.filter(product => product.branchId === branchId);
    },

    /**
     * Obtiene productos activos
     */
    getActive() {
        const products = this.getAll();
        return products.filter(product => product.status === 'active');
    },

    /**
     * Obtiene productos con stock bajo
     */
    getLowStock() {
        const products = this.getActive();
        return products.filter(product => product.stock < product.stockMinimo);
    },

    /**
     * Obtiene productos con stock crítico
     */
    getCriticalStock() {
        const products = this.getActive();
        return products.filter(product => 
            product.stock < product.stockMinimo * 0.5
        );
    },

    /**
     * Busca un producto por nombre y sucursal
     */
    findByNameAndBranch(name, branchId) {
        const products = this.getAll();
        return products.find(product =>
            product.name.toLowerCase() === name.toLowerCase() && 
            product.branchId === branchId
        ) || null;
    },

    /**
     * Crea un nuevo producto
     */
    create(productData) {
        const products = this.getAll();
        const newProduct = new Product(productData);

        // Validar que no exista código duplicado en la misma sucursal
        if (newProduct.codigo) {
            const existingCode = products.find(p => 
                p.codigo.toLowerCase() === newProduct.codigo.toLowerCase() &&
                p.branchId === newProduct.branchId
            );
            if (existingCode) {
                throw new Error('Ya existe un producto con este código en esta sucursal');
            }
        }

        // Validar datos
        const validation = newProduct.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        products.push(newProduct);
        this.saveAll(products);
        return newProduct.toJSON();
    },

    /**
     * Actualiza un producto existente
     */
    update(id, productData) {
        const products = this.getAll();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        // Validar que el nuevo código no esté duplicado (si se cambia)
        if (productData.codigo) {
            const existingCode = products.find(p =>
                p.codigo.toLowerCase() === productData.codigo.toLowerCase() && 
                p.id !== id &&
                p.branchId === products[productIndex].branchId
            );
            if (existingCode) {
                throw new Error('Ya existe un producto con este código en esta sucursal');
            }
        }

        const updatedProduct = {
            ...products[productIndex],
            ...productData,
            updatedAt: new Date().toISOString()
        };

        // Validar datos actualizados
        const tempProduct = new Product(updatedProduct);
        const validation = tempProduct.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        products[productIndex] = updatedProduct;
        this.saveAll(products);
        return updatedProduct;
    },

    /**
     * Elimina un producto (cambio de estado a inactive)
     */
    delete(id) {
        const products = this.getAll();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        // Eliminación lógica: cambiar status a inactive
        products[productIndex] = {
            ...products[productIndex],
            status: 'inactive',
            updatedAt: new Date().toISOString()
        };

        this.saveAll(products);
        return true;
    },

    /**
     * Elimina físicamente un producto
     */
    permanentDelete(id) {
        const products = this.getAll();
        const filteredProducts = products.filter(product => product.id !== id);

        if (filteredProducts.length === products.length) {
            throw new Error('Producto no encontrado');
        }

        this.saveAll(filteredProducts);
        return true;
    },

    /**
     * Actualiza el stock de un producto
     */
    updateStock(id, quantity, type = 'add') {
        const product = this.findById(id);
        
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        let newStock = product.stock;

        if (type === 'add') {
            newStock += quantity;
        } else if (type === 'remove') {
            newStock -= quantity;
            if (newStock < 0) {
                throw new Error('No hay suficiente stock');
            }
        } else if (type === 'set') {
            newStock = quantity;
        }

        return this.update(id, { stock: newStock });
    },

    /**
     * Obtiene el total de productos activos
     */
    getActiveCount() {
        return this.getActive().length;
    },

    /**
     * Obtiene el total de productos con stock bajo
     */
    getLowStockCount() {
        return this.getLowStock().length;
    },

    /**
     * Obtiene el valor total del inventario
     */
    getInventoryValue() {
        const products = this.getActive();
        return products.reduce((total, product) => 
            total + (product.stock * product.costo), 0
        );
    },

    /**
     * Obtiene estadísticas de productos
     */
    getStats(branchId = null) {
        let products = this.getActive();
        
        // Filtrar por sucursal si se proporciona
        if (branchId) {
            products = products.filter(p => p.branchId === branchId);
        }

        const totalProducts = products.length;
        const lowStock = products.filter(p => p.isStockLow()).length;
        const criticalStock = products.filter(p => 
            p.getStockStatus() === STOCK_STATUS.CRITICO
        ).length;
        const optimalStock = products.filter(p => 
            p.getStockStatus() === STOCK_STATUS.OPTIMO
        ).length;
        const inventoryValue = products.reduce((total, p) => 
            total + p.getInventoryValue(), 0
        );

        return {
            totalProducts,
            lowStock,
            criticalStock,
            optimalStock,
            inventoryValue
        };
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Product, 
        ProductService, 
        PRODUCT_CATEGORIES, 
        PRODUCT_UNITS,
        STOCK_STATUS
    };
}
