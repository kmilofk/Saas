/**
 * ========================================
 * ANTHONY CHEF - EMPLOYEE MODEL
 * Modelo de Empleados
 * ========================================
 */

// ========================================
// CONSTANTES Y CONFIGURACIÓN
// ========================================

const EMPLOYEE_STORAGE_KEY = 'anthony_chef_employees';

const EMPLOYEE_ROLES = {
    ADMINISTRADOR: 'administrador',
    COCINERO: 'cocinero',
    MESERO: 'mesero',
    CAJERO: 'cajero',
    LIMPIEZA: 'limpieza',
    BODEGUERO: 'bodeguero',
    SUPERVISOR: 'supervisor'
};

const EMPLOYEE_STATUS = {
    ACTIVE: 'activo',
    INACTIVE: 'inactivo',
    VACATION: 'vacaciones',
    SUSPENDED: 'suspendido'
};

const SHIFT_TYPES = {
    MORNING: 'mañana',
    AFTERNOON: 'tarde',
    NIGHT: 'noche',
    FLEXIBLE: 'flexible'
};

// ========================================
// CLASE EMPLOYEE
// ========================================

class Employee {
    constructor({
        id = null,
        name = '',
        email = '',
        phone = '',
        document = '',
        role = EMPLOYEE_ROLES.MESERO,
        status = EMPLOYEE_STATUS.ACTIVE,
        salary = 0,
        branchId = null,
        hireDate = null,
        endDate = null,
        address = '',
        emergencyContact = '',
        emergencyPhone = '',
        notes = '',
        createdAt = null,
        updatedAt = null
    }) {
        this.id = id || this.generateId();
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.document = document;
        this.role = role;
        this.status = status;
        this.salary = salary;
        this.branchId = branchId;
        this.hireDate = hireDate || new Date().toISOString();
        this.endDate = endDate;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.emergencyPhone = emergencyPhone;
        this.notes = notes;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Genera un ID único para el empleado
     */
    generateId() {
        return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Convierte el empleado a objeto plano
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            document: this.document,
            role: this.role,
            status: this.status,
            salary: this.salary,
            branchId: this.branchId,
            hireDate: this.hireDate,
            endDate: this.endDate,
            address: this.address,
            emergencyContact: this.emergencyContact,
            emergencyPhone: this.emergencyPhone,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Valida los datos del empleado
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('El nombre es requerido');
        }

        if (!this.email && !this.phone) {
            errors.push('Debe proporcionar email o teléfono');
        }

        if (!Object.values(EMPLOYEE_ROLES).includes(this.role)) {
            errors.push('Rol inválido');
        }

        if (!Object.values(EMPLOYEE_STATUS).includes(this.status)) {
            errors.push('Estado inválido');
        }

        if (this.salary < 0) {
            errors.push('El salario no puede ser negativo');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Obtiene el rol como texto formateado
     */
    getRoleLabel() {
        const labels = {
            [EMPLOYEE_ROLES.ADMINISTRADOR]: 'Administrador',
            [EMPLOYEE_ROLES.COCINERO]: 'Cocinero',
            [EMPLOYEE_ROLES.MESERO]: 'Mesero',
            [EMPLOYEE_ROLES.CAJERO]: 'Cajero',
            [EMPLOYEE_ROLES.LIMPIEZA]: 'Limpieza',
            [EMPLOYEE_ROLES.BODEGUERO]: 'Bodeguero',
            [EMPLOYEE_ROLES.SUPERVISOR]: 'Supervisor'
        };
        return labels[this.role] || this.role;
    }

    /**
     * Obtiene el estado como texto formateado
     */
    getStatusLabel() {
        const labels = {
            [EMPLOYEE_STATUS.ACTIVE]: 'Activo',
            [EMPLOYEE_STATUS.INACTIVE]: 'Inactivo',
            [EMPLOYEE_STATUS.VACATION]: 'Vacaciones',
            [EMPLOYEE_STATUS.SUSPENDED]: 'Suspendido'
        };
        return labels[this.status] || this.status;
    }

    /**
     * Verifica si el empleado está activo
     */
    isActive() {
        return this.status === EMPLOYEE_STATUS.ACTIVE;
    }
}

// ========================================
// EMPLOYEE SERVICE
// ========================================

const EmployeeService = {
    /**
     * Obtiene todos los empleados desde localStorage
     */
    getAll() {
        const employees = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
        return employees ? JSON.parse(employees) : [];
    },

    /**
     * Guarda la colección de empleados en localStorage
     */
    saveAll(employees) {
        localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
    },

    /**
     * Busca un empleado por ID
     */
    findById(id) {
        const employees = this.getAll();
        return employees.find(emp => emp.id === id) || null;
    },

    /**
     * Busca un empleado por email
     */
    findByEmail(email) {
        const employees = this.getAll();
        return employees.find(emp => 
            emp.email.toLowerCase() === email.toLowerCase()
        ) || null;
    },

    /**
     * Busca empleados por nombre (búsqueda parcial)
     */
    findByName(name) {
        const employees = this.getAll();
        return employees.filter(emp =>
            emp.name.toLowerCase().includes(name.toLowerCase())
        );
    },

    /**
     * Busca empleados por rol
     */
    findByRole(role) {
        const employees = this.getAll();
        return employees.filter(emp => emp.role === role);
    },

    /**
     * Busca empleados por sucursal
     */
    findByBranch(branchId) {
        const employees = this.getAll();
        return employees.filter(emp => emp.branchId === branchId);
    },

    /**
     * Obtiene empleados activos
     */
    getActive() {
        const employees = this.getAll();
        return employees.filter(emp => emp.status === EMPLOYEE_STATUS.ACTIVE);
    },

    /**
     * Busca un empleado por documento
     */
    findByDocument(document) {
        const employees = this.getAll();
        return employees.find(emp => emp.document === document) || null;
    },

    /**
     * Crea un nuevo empleado
     */
    create(employeeData) {
        const employees = this.getAll();
        const newEmployee = new Employee(employeeData);

        // Validar que no exista email duplicado
        if (newEmployee.email) {
            const existingEmail = this.findByEmail(newEmployee.email);
            if (existingEmail) {
                throw new Error('El email ya está registrado');
            }
        }

        // Validar que no exista documento duplicado
        if (newEmployee.document) {
            const existingDocument = this.findByDocument(newEmployee.document);
            if (existingDocument) {
                throw new Error('El documento ya está registrado');
            }
        }

        // Validar datos
        const validation = newEmployee.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        employees.push(newEmployee);
        this.saveAll(employees);
        return newEmployee.toJSON();
    },

    /**
     * Actualiza un empleado existente
     */
    update(id, employeeData) {
        const employees = this.getAll();
        const employeeIndex = employees.findIndex(emp => emp.id === id);

        if (employeeIndex === -1) {
            throw new Error('Empleado no encontrado');
        }

        // Validar que el nuevo email no esté duplicado (si se cambia)
        if (employeeData.email) {
            const existingEmail = employees.find(emp =>
                emp.email.toLowerCase() === employeeData.email.toLowerCase() && 
                emp.id !== id
            );
            if (existingEmail) {
                throw new Error('El email ya está registrado');
            }
        }

        const updatedEmployee = {
            ...employees[employeeIndex],
            ...employeeData,
            updatedAt: new Date().toISOString()
        };

        // Validar datos actualizados
        const tempEmployee = new Employee(updatedEmployee);
        const validation = tempEmployee.validate();
        if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
        }

        employees[employeeIndex] = updatedEmployee;
        this.saveAll(employees);
        return updatedEmployee;
    },

    /**
     * Elimina un empleado (cambio de estado a inactive)
     */
    delete(id) {
        return this.update(id, { status: EMPLOYEE_STATUS.INACTIVE });
    },

    /**
     * Actualiza el estado de un empleado
     */
    updateStatus(id, newStatus) {
        if (!Object.values(EMPLOYEE_STATUS).includes(newStatus)) {
            throw new Error('Estado inválido');
        }
        return this.update(id, { status: newStatus });
    },

    /**
     * Obtiene el total de empleados activos
     */
    getActiveCount(branchId = null) {
        let employees = this.getActive();
        if (branchId) {
            employees = employees.filter(emp => emp.branchId === branchId);
        }
        return employees.length;
    },

    /**
     * Obtiene estadísticas de empleados
     */
    getStats(branchId = null) {
        let employees = this.getAll();
        
        if (branchId) {
            employees = employees.filter(emp => emp.branchId === branchId);
        }

        const total = employees.length;
        const activos = employees.filter(e => e.status === EMPLOYEE_STATUS.ACTIVE).length;
        const inactivos = employees.filter(e => e.status === EMPLOYEE_STATUS.INACTIVE).length;
        const vacaciones = employees.filter(e => e.status === EMPLOYEE_STATUS.VACATION).length;

        // Empleados por rol
        const porRol = {};
        employees.forEach(emp => {
            if (!porRol[emp.role]) {
                porRol[emp.role] = 0;
            }
            porRol[emp.role]++;
        });

        return {
            total,
            activos,
            inactivos,
            vacaciones,
            porRol
        };
    }
};

// ========================================
// ATTENDANCE SERVICE (Asistencia)
// ========================================

const ATTENDANCE_STORAGE_KEY = 'anthony_chef_attendance';

const AttendanceService = {
    /**
     * Obtiene todos los registros de asistencia
     */
    getAll() {
        const attendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
        return attendance ? JSON.parse(attendance) : [];
    },

    /**
     * Guarda la colección de asistencia
     */
    saveAll(attendance) {
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
    },

    /**
     * Registra asistencia de un empleado
     */
    register(employeeId, branchId, notes = '') {
        const attendance = this.getAll();
        const today = new Date().toISOString().split('T')[0];
        
        // Verificar si ya hay registro para hoy
        const existingRecord = attendance.find(record => 
            record.employeeId === employeeId && 
            record.date === today
        );

        if (existingRecord) {
            throw new Error('Ya existe un registro de asistencia para hoy');
        }

        const newRecord = {
            id: 'att_' + Date.now(),
            employeeId,
            branchId,
            date: today,
            checkIn: new Date().toISOString(),
            checkOut: null,
            notes,
            createdAt: new Date().toISOString()
        };

        attendance.push(newRecord);
        this.saveAll(attendance);
        return newRecord;
    },

    /**
     * Registra la salida de un empleado
     */
    checkOut(employeeId) {
        const attendance = this.getAll();
        const today = new Date().toISOString().split('T')[0];
        
        const recordIndex = attendance.findIndex(record => 
            record.employeeId === employeeId && 
            record.date === today
        );

        if (recordIndex === -1) {
            throw new Error('No hay registro de entrada para hoy');
        }

        attendance[recordIndex].checkOut = new Date().toISOString();
        this.saveAll(attendance);
        return attendance[recordIndex];
    },

    /**
     * Obtiene asistencia por empleado
     */
    findByEmployee(employeeId) {
        const attendance = this.getAll();
        return attendance.filter(record => record.employeeId === employeeId);
    },

    /**
     * Obtiene asistencia por fecha
     */
    findByDate(date, branchId = null) {
        let attendance = this.getAll();
        attendance = attendance.filter(record => record.date === date);
        
        if (branchId) {
            attendance = attendance.filter(record => record.branchId === branchId);
        }
        
        return attendance;
    },

    /**
     * Obtiene asistencia por rango de fechas
     */
    findByDateRange(startDate, endDate, branchId = null) {
        let attendance = this.getAll();
        
        attendance = attendance.filter(record => {
            return record.date >= startDate && record.date <= endDate;
        });

        if (branchId) {
            attendance = attendance.filter(record => record.branchId === branchId);
        }

        return attendance;
    }
};

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Employee, 
        EmployeeService, 
        AttendanceService,
        EMPLOYEE_ROLES, 
        EMPLOYEE_STATUS,
        SHIFT_TYPES
    };
}
