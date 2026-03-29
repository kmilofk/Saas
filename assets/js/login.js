/**
 * ========================================
 * ANTHONY CHEF - LOGIN MODULE
 * Sistema de Autenticación
 * ========================================
 */

// ========================================
// CONFIGURACIÓN Y CONSTANTES
// ========================================

const CREDENTIALS = {
    OWNER: {
        phone: '3001234567',
        password: 'admin123',
        role: 'owner'
    },
    ADMIN: {
        username: 'admin1',
        password: '1234',
        role: 'admin'
    }
};

const STORAGE_KEYS = {
    CURRENT_USER: 'anthony_chef_current_user',
    SESSION: 'anthony_chef_session'
};

const REDIRECT_URL = 'app.html';

// ========================================
// SELECTORES DEL DOM
// ========================================

const elements = {
    tabs: document.querySelectorAll('.tab-btn'),
    forms: {
        owner: document.getElementById('owner-form'),
        admin: document.getElementById('admin-form')
    },
    inputs: {
        owner: {
            phone: document.getElementById('owner-phone'),
            password: document.getElementById('owner-password')
        },
        admin: {
            username: document.getElementById('admin-username'),
            password: document.getElementById('admin-password')
        }
    },
    errors: {
        owner: {
            phone: document.getElementById('owner-phone-error'),
            password: document.getElementById('owner-password-error')
        },
        admin: {
            username: document.getElementById('admin-username-error'),
            password: document.getElementById('admin-password-error')
        }
    },
    toggleButtons: document.querySelectorAll('.toggle-password'),
    message: document.getElementById('login-message')
};

// ========================================
// UTILIDADES
// ========================================

/**
 * Limpia todos los errores de un formulario
 */
function clearErrors(formType) {
    const errorElements = elements.errors[formType];
    Object.values(errorElements).forEach(errorEl => {
        if (errorEl) errorEl.textContent = '';
    });

    const inputs = elements.inputs[formType];
    Object.values(inputs).forEach(input => {
        if (input) input.classList.remove('error');
    });
}

/**
 * Muestra un error en un campo específico
 */
function showError(field, formType, message) {
    const errorEl = elements.errors[formType][field];
    const inputEl = elements.inputs[formType][field];

    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('error');
}

/**
 * Valida que un campo no esté vacío
 */
function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return `El campo ${fieldName} es requerido`;
    }
    return null;
}

/**
 * Valida un número de usuario
 */
function validatePhone(phone) {
    const phoneRegex = /^3\d{9}$/;
    if (!phoneRegex.test(phone)) {
        return 'Ingrese un usuario válido (ej: 3001234567)';
    }
    return null;
}

/**
 * Valida una contraseña
 */
function validatePassword(password, minLength = 4) {
    if (password.length < minLength) {
        return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    return null;
}

/**
 * Muestra un mensaje de estado
 */
function showMessage(message, type = 'info') {
    elements.message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'circle-notch fa-spin'}"></i>
        <span>${message}</span>
    `;
    elements.message.className = `login-message show ${type}`;
}

/**
 * Oculta el mensaje de estado
 */
function hideMessage() {
    elements.message.classList.remove('show');
}

/**
 * Guarda la sesión del usuario
 */
function saveSession(user) {
    const sessionData = {
        id: user.id,
        email: user.email || user.phone,
        role: user.role,
        name: user.name,
        branchId: user.branchId || null,
        loginAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
        ...sessionData,
        token: generateToken()
    }));
}

/**
 * Genera un token simple para la sesión
 */
function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2) + '_' + Date.now();
}

/**
 * Simula un delay de red
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// MANEJO DE PESTAÑAS
// ========================================

function initTabs() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;

            // Remover clase active de todas las pestañas
            elements.tabs.forEach(t => t.classList.remove('active'));

            // Ocultar todos los formularios
            Object.values(elements.forms).forEach(form => {
                form.classList.remove('active');
            });

            // Activar pestaña y formulario seleccionados
            tab.classList.add('active');
            elements.forms[tabType].classList.add('active');

            // Limpiar errores y mensajes
            clearErrors(tabType);
            hideMessage();

            // Enfocar el primer input del formulario
            const firstInput = Object.values(elements.inputs[tabType])[0];
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        });
    });
}

// ========================================
// MANEJO DE CONTRASEÑAS
// ========================================

function initPasswordToggle() {
    elements.toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                button.classList.add('active');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                button.classList.remove('active');
            }
        });
    });
}

// ========================================
// VALIDACIÓN DE FORMULARIOS
// ========================================

function validateOwnerForm() {
    const phone = elements.inputs.owner.phone.value.trim();
    const password = elements.inputs.owner.password.value;

    let isValid = true;
    clearErrors('owner');

    // Validar usuario
    const phoneError = validateRequired(phone, 'usuario') || validatePhone(phone);
    if (phoneError) {
        showError('phone', 'owner', phoneError);
        isValid = false;
    }

    // Validar contraseña
    const passwordError = validateRequired(password, 'contraseña') || validatePassword(password);
    if (passwordError) {
        showError('password', 'owner', passwordError);
        isValid = false;
    }

    return { isValid, phone, password };
}

function validateAdminForm() {
    const username = elements.inputs.admin.username.value.trim();
    const password = elements.inputs.admin.password.value;

    let isValid = true;
    clearErrors('admin');

    // Validar usuario
    const usernameError = validateRequired(username, 'usuario o correo');
    if (usernameError) {
        showError('username', 'admin', usernameError);
        isValid = false;
    }

    // Validar contraseña
    const passwordError = validateRequired(password, 'contraseña') || validatePassword(password);
    if (passwordError) {
        showError('password', 'admin', passwordError);
        isValid = false;
    }

    return { isValid, username, password };
}

// ========================================
// AUTENTICACIÓN
// ========================================

async function authenticateOwner(phone, password) {
    await delay(800); // Simular delay de red

    const credentials = CREDENTIALS.OWNER;

    if (phone !== credentials.phone) {
        throw new Error('El número de usuario no está registrado');
    }

    if (password !== credentials.password) {
        throw new Error('Contraseña incorrecta');
    }

    // Usuario autenticado exitosamente
    return {
        id: 'owner_001',
        phone: credentials.phone,
        role: credentials.role,
        name: 'Dueño del Restaurante',
        branchId: null // El dueño tiene acceso a todas las sucursales
    };
}

async function authenticateAdmin(username, password) {
    await delay(800); // Simular delay de red

    const credentials = CREDENTIALS.ADMIN;

    // Validar usuario (acepta tanto username como email)
    const isUsernameValid = username.toLowerCase() === credentials.username;
    const isEmailValid = username.toLowerCase() === 'admin@restaurante.com';

    if (!isUsernameValid && !isEmailValid) {
        throw new Error('El usuario no está registrado');
    }

    if (password !== credentials.password) {
        throw new Error('Contraseña incorrecta');
    }

    // Administrador autenticado exitosamente
    return {
        id: 'admin_001',
        username: credentials.username,
        email: 'admin@restaurante.com',
        role: credentials.role,
        name: 'Administrador',
        branchId: 'branch_001' // El admin tiene una sucursal asignada
    };
}

// ========================================
// LOADING OVERLAY
// ========================================

/**
 * Muestra el overlay de carga con animación
 */
function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

/**
 * Oculta el overlay de carga con animación
 */
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// ========================================
// MANEJO DE ENVÍO DE FORMULARIOS
// ========================================

async function handleOwnerSubmit(event) {
    event.preventDefault();

    const validation = validateOwnerForm();

    if (!validation.isValid) {
        return;
    }

    try {
        // Mostrar estado de carga
        showMessage('Verificando credenciales...', 'info');

        // Deshabilitar botón
        const submitBtn = event.target.querySelector('.btn-login');
        submitBtn.disabled = true;

        // Autenticar
        const user = await authenticateOwner(validation.phone, validation.password);

        // Guardar sesión
        saveSession(user);

        // Mostrar overlay de carga premium
        showLoadingOverlay();

        // Esperar un momento antes de redirigir
        await delay(1500);

        // Redirigir al dashboard
        window.location.href = REDIRECT_URL;

    } catch (error) {
        showMessage(error.message, 'error');

        // Rehabilitar botón
        event.target.querySelector('.btn-login').disabled = false;

        // Marcar campo de contraseña como error
        elements.inputs.owner.password.classList.add('error');
    }
}

async function handleAdminSubmit(event) {
    event.preventDefault();

    const validation = validateAdminForm();

    if (!validation.isValid) {
        return;
    }

    try {
        // Mostrar estado de carga
        showMessage('Verificando credenciales...', 'info');

        // Deshabilitar botón
        const submitBtn = event.target.querySelector('.btn-login');
        submitBtn.disabled = true;

        // Autenticar
        const user = await authenticateAdmin(validation.username, validation.password);

        // Guardar sesión
        saveSession(user);

        // Mostrar overlay de carga premium
        showLoadingOverlay();

        // Esperar un momento antes de redirigir
        await delay(1500);

        // Redirigir al dashboard
        window.location.href = REDIRECT_URL;

    } catch (error) {
        showMessage(error.message, 'error');

        // Rehabilitar botón
        event.target.querySelector('.btn-login').disabled = false;

        // Marcar campo de contraseña como error
        elements.inputs.admin.password.classList.add('error');
    }
}

function initFormHandlers() {
    // Owner form
    elements.forms.owner.addEventListener('submit', handleOwnerSubmit);

    // Admin form
    elements.forms.admin.addEventListener('submit', handleAdminSubmit);

    // Limpiar errores al escribir
    Object.entries(elements.inputs).forEach(([formType, inputs]) => {
        Object.entries(inputs).forEach(([field, input]) => {
            input.addEventListener('input', () => {
                elements.errors[formType][field].textContent = '';
                input.classList.remove('error');
            });

            input.addEventListener('blur', () => {
                // Validación en tiempo real opcional
            });
        });
    });
}

// ========================================
// VERIFICAR SESIÓN EXISTENTE
// ========================================

function checkExistingSession() {
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            // Si hay una sesión activa, redirigir directamente
            console.log('Sesión existente detectada:', user);
            // Opcional: Redirigir automáticamente
            // window.location.href = REDIRECT_URL;
        } catch (error) {
            console.error('Error al parsear sesión:', error);
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================

function init() {
    // Verificar sesión existente
    checkExistingSession();

    // Inicializar pestañas
    initTabs();

    // Inicializar toggle de contraseñas
    initPasswordToggle();

    // Inicializar handlers de formularios
    initFormHandlers();

    // Enfocar primer input
    const firstInput = elements.inputs.owner.phone;
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }

    console.log('Login module initialized');
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
