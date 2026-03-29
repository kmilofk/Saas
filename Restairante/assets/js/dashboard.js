/**
 * ========================================
 * ANTHONY CHEF - DASHBOARD MODULE
 * Base Dashboard Functionality
 * ========================================
 */

// ========================================
// CONFIGURACIÓN Y CONSTANTES
// ========================================

const STORAGE_KEYS = {
    CURRENT_USER: 'anthony_chef_current_user',
    SESSION: 'anthony_chef_session'
};

const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin'
};

const REDIRECT_URL = 'index.html';

// ========================================
// SELECTORES DEL DOM
// ========================================

const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),

    // Header
    headerToggle: document.getElementById('header-toggle'),
    currentModule: document.getElementById('current-module'),

    // User
    userName: document.getElementById('user-name'),
    userRole: document.getElementById('user-role'),
    userNameHeader: document.getElementById('user-name-header'),
    userMenuBtn: document.getElementById('user-menu-btn'),
    userDropdown: document.getElementById('user-dropdown'),

    // Logout dropdown (único botón de cerrar sesión)
    logoutDropdown: document.getElementById('logout-dropdown'),

    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),

    // Owner only elements
    ownerOnlyElements: document.querySelectorAll('.owner-only'),

    // Branch selector
    branchSelector: document.getElementById('branch-selector'),
    branchSelect: document.getElementById('branch-select'),

    // Modals
    modalPerfil: document.getElementById('modal-perfil'),
    modalConfiguracion: document.getElementById('modal-configuracion'),
    modalSucursales: document.getElementById('modal-sucursales'),
    modalCloseButtons: document.querySelectorAll('[data-modal-close]'),

    // Profile
    profileNameDisplay: document.getElementById('profile-name-display'),
    profileRoleDisplay: document.getElementById('profile-role-display')
};

// ========================================
// UTILIDADES
// ========================================

/**
 * Obtiene el usuario actual desde localStorage
 */
function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (user) {
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error('Error al parsear usuario:', error);
            return null;
        }
    }
    return null;
}

/**
 * Verifica si el usuario tiene sesión activa
 */
function isAuthenticated() {
    const user = getCurrentUser();
    return user !== null && user.role !== undefined;
}

/**
 * Verifica si el usuario es Owner
 */
function isOwner() {
    const user = getCurrentUser();
    return user && user.role === ROLES.OWNER;
}

/**
 * Verifica si el usuario es Admin
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === ROLES.ADMIN;
}

/**
 * Simula un delay de red
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// GESTIÓN DE SESIÓN
// ========================================

/**
 * Verifica la sesión del usuario y redirige si no está autenticado
 */
function checkSession() {
    if (!isAuthenticated()) {
        console.log('No hay sesión activa, redirigiendo al login...');
        window.location.href = REDIRECT_URL;
        return false;
    }
    return true;
}

/**
 * Cierra la sesión del usuario
 */
async function logout() {
    try {
        // Animación de salida
        document.body.style.opacity = '0.5';

        await delay(300);

        // Limpiar localStorage
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION);

        // Redirigir al login
        window.location.href = REDIRECT_URL;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.location.href = REDIRECT_URL;
    }
}

// ========================================
// UI DE USUARIO
// ========================================

/**
 * Actualiza la información del usuario en la UI
 */
function updateUserUI() {
    const user = getCurrentUser();

    if (user) {
        const userName = user.name || 'Usuario';
        const userRole = user.role === ROLES.OWNER ? 'Dueño' : 'Administrador';

        // Actualizar textos
        if (elements.userName) elements.userName.textContent = userName;
        if (elements.userRole) elements.userRole.textContent = userRole;
        if (elements.userNameHeader) elements.userNameHeader.textContent = userName;
    }
}

/**
 * Muestra/oculta elementos según el rol del usuario
 */
function updateUIByRole() {
    if (isOwner()) {
        // Mostrar elementos exclusivos del owner
        elements.ownerOnlyElements.forEach(el => {
            el.classList.add('visible');
            el.style.display = 'flex';
        });

        // Mostrar selector de sucursales
        if (elements.branchSelector) {
            elements.branchSelector.style.display = 'flex';
        }

        console.log('Vista de Owner activada');
    } else {
        // Ocultar elementos exclusivos del owner
        elements.ownerOnlyElements.forEach(el => {
            el.classList.remove('visible');
            el.style.display = 'none';
        });

        // Ocultar selector de sucursales
        if (elements.branchSelector) {
            elements.branchSelector.style.display = 'none';
        }

        // Ocultar vistas owner-only (Sucursales y Fábrica)
        const ownerViews = document.querySelectorAll('.view-container.owner-only');
        ownerViews.forEach(view => {
            view.classList.remove('active');
        });

        // Si la vista actual es owner-only, redirigir a dashboard
        const currentActiveView = document.querySelector('.view-container.active');
        if (currentActiveView && currentActiveView.classList.contains('owner-only')) {
            currentActiveView.classList.remove('active');
            const dashboardView = document.querySelector('.view-container[data-view="dashboard"]');
            if (dashboardView) {
                dashboardView.classList.add('active');
            }
            // Actualizar breadcrumb
            if (elements.currentModule) {
                elements.currentModule.textContent = 'Dashboard';
            }
        }

        console.log('Vista de Admin activada');
    }
}

// ========================================
// SIDEBAR
// ========================================

/**
 * Abre el sidebar en móvil
 */
function openSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.add('active');
    }
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el sidebar en móvil
 */
function closeSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.remove('active');
    }
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

/**
 * Alterna el sidebar
 */
function toggleSidebar() {
    if (elements.sidebar.classList.contains('active')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// ========================================
// USER DROPDOWN
// ========================================

/**
 * Abre el dropdown de usuario
 */
function openUserDropdown() {
    if (elements.userDropdown) {
        elements.userDropdown.classList.add('show');
    }
}

/**
 * Cierra el dropdown de usuario
 */
function closeUserDropdown() {
    if (elements.userDropdown) {
        elements.userDropdown.classList.remove('show');
    }
}

/**
 * Alterna el dropdown de usuario
 */
function toggleUserDropdown() {
    if (elements.userDropdown.classList.contains('show')) {
        closeUserDropdown();
    } else {
        openUserDropdown();
    }
}

// ========================================
// NAVEGACIÓN
// ========================================

/**
 * Maneja el clic en los enlaces de navegación
 */
function handleNavigation(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const moduleName = link.dataset.module;

    // Remover clase active de todos los links
    elements.navLinks.forEach(navLink => {
        navLink.classList.remove('active');
    });

    // Agregar clase active al link actual
    link.classList.add('active');

    // Actualizar breadcrumb
    if (elements.currentModule) {
        elements.currentModule.textContent = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    }

    // Ocultar todas las vistas
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('active');
    });

    // Mostrar la vista correspondiente
    const targetView = document.querySelector(`.view-container[data-view="${moduleName}"]`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Cerrar sidebar en móvil
    if (window.innerWidth <= 768) {
        closeSidebar();
    }

    console.log(`Navegando a: ${moduleName}`);
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Inicializa los event listeners del sidebar
 */
function initSidebarListeners() {
    // Toggle sidebar buttons
    if (elements.sidebarToggle) {
        elements.sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (elements.headerToggle) {
        elements.headerToggle.addEventListener('click', toggleSidebar);
    }

    // Overlay click
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.addEventListener('click', closeSidebar);
    }
}

/**
 * Inicializa los event listeners del user dropdown
 */
function initUserDropdownListeners() {
    // Toggle dropdown
    if (elements.userMenuBtn) {
        elements.userMenuBtn.addEventListener('click', toggleUserDropdown);
    }

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (event) => {
        if (elements.userDropdown &&
            !elements.userMenuBtn.contains(event.target) &&
            !elements.userDropdown.contains(event.target)) {
            closeUserDropdown();
        }
    });

    // Manejar clicks en los items del dropdown
    const dropdownItems = elements.userDropdown.querySelectorAll('.dropdown-item[data-action]');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const action = item.dataset.action;

            // Cerrar dropdown
            closeUserDropdown();

            // Abrir modal correspondiente
            if (action === 'perfil') {
                openProfileModal();
            } else if (action === 'configuracion') {
                openConfigModal();
            }
        });
    });
}

/**
 * Inicializa los event listeners de logout
 */
function initLogoutListeners() {
    // Solo dropdown del header (estándar SaaS)
    if (elements.logoutDropdown) {
        elements.logoutDropdown.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
}

/**
 * Inicializa los event listeners de navegación
 */
function initNavigationListeners() {
    elements.navLinks.forEach(link => {
        const module = link.dataset.module;

        // Verificar si es navegación de sucursales o fábrica (vistas owner-only)
        if (module === 'sucursales' || module === 'fabrica') {
            link.addEventListener('click', handleSucursalesNavigation);
        }
        // Navegación normal para los demás módulos
        else {
            link.addEventListener('click', handleNavigation);
        }
    });
}

/**
 * Inicializa los event listeners del branch selector
 */
function initBranchSelectorListeners() {
    if (elements.branchSelect) {
        elements.branchSelect.addEventListener('change', (event) => {
            const branchId = event.target.value;
            console.log(`Sucursal seleccionada: ${branchId}`);
            // Aquí iría la lógica para filtrar datos por sucursal
        });
    }
}

// ========================================
// CONFIGURACIÓN - MÓDULO COMPLETO
// ========================================

/**
 * Configuración por defecto
 */
const DEFAULT_CONFIG = {
    darkMode: false,
    notifications: true,
    salesNotifications: true,
    inventoryAlerts: true,
    sounds: true,
    volume: 'medium',
    autosave: true,
    tutorial: false
};

/**
 * Obtiene la configuración actual desde localStorage
 */
function getConfig() {
    const savedConfig = localStorage.getItem('anthony_chef_config');
    if (savedConfig) {
        try {
            return { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
        } catch (error) {
            console.error('Error al parsear configuración:', error);
            return { ...DEFAULT_CONFIG };
        }
    }
    return { ...DEFAULT_CONFIG };
}

/**
 * Guarda la configuración en localStorage
 */
function saveConfigToLocalStorage(config) {
    localStorage.setItem('anthony_chef_config', JSON.stringify(config));
    console.log('Configuración guardada:', config);
}

/**
 * Aplica la configuración a la interfaz
 */
function applyConfig(config) {
    // Modo Oscuro
    if (config.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Actualizar toggles en el modal
    const toggleDarkTheme = document.getElementById('toggle-dark-theme');
    const toggleNotifications = document.getElementById('toggle-notifications');
    const toggleSalesNotifications = document.getElementById('toggle-sales-notifications');
    const toggleInventoryAlerts = document.getElementById('toggle-inventory-alerts');
    const toggleSounds = document.getElementById('toggle-sounds');
    const selectVolume = document.getElementById('select-volume');
    const toggleAutosave = document.getElementById('toggle-autosave');
    const toggleTutorial = document.getElementById('toggle-tutorial');

    if (toggleDarkTheme) toggleDarkTheme.checked = config.darkMode;
    if (toggleNotifications) toggleNotifications.checked = config.notifications;
    if (toggleSalesNotifications) toggleSalesNotifications.checked = config.salesNotifications;
    if (toggleInventoryAlerts) toggleInventoryAlerts.checked = config.inventoryAlerts;
    if (toggleSounds) toggleSounds.checked = config.sounds;
    if (selectVolume) selectVolume.value = config.volume;
    if (toggleAutosave) toggleAutosave.checked = config.autosave;
    if (toggleTutorial) toggleTutorial.checked = config.tutorial;

    // Actualizar rol del usuario en el modal
    const user = getCurrentUser();
    const configUserRole = document.getElementById('config-user-role');
    if (configUserRole && user) {
        configUserRole.textContent = user.role === 'owner' ? 'Dueño' : 'Administrador';
    }

    // Mostrar tutorial si está activado
    if (config.tutorial) {
        showTutorial();
    }

    console.log('Configuración aplicada:', config);
}

/**
 * Muestra una notificación toast
 */
function showToast(message, type = 'info') {
    // Verificar si las notificaciones están activadas
    const config = getConfig();
    if (!config.notifications) {
        console.log('Notificaciones desactivadas');
        return;
    }

    // Crear elemento de notificación
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'bell'}"></i>
        <span>${message}</span>
    `;

    // Agregar al body
    document.body.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Reproducir sonido si está activado
    if (config.sounds) {
        playNotificationSound(config.volume);
    }

    // Remover después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Reproduce el sonido de notificación
 */
function playNotificationSound(volume = 'medium') {
    // Mapear volumen a ganancia
    const volumeLevels = {
        low: 0.3,
        medium: 0.5,
        high: 0.8
    };

    const gain = volumeLevels[volume] || 0.5;

    try {
        // Crear contexto de audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Crear oscilador para sonido "ding"
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configurar frecuencia (tono agradable: C5-E5-G5)
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);

        // Configurar ganancia (volumen con fade)
        gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

        // Reproducir
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
        console.warn('No se pudo reproducir el sonido:', error);
    }
}

/**
 * Muestra el tutorial de bienvenida
 */
function showTutorial() {
    const tutorialToast = document.createElement('div');
    tutorialToast.className = 'toast-notification toast-info';
    tutorialToast.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>¡Bienvenido al Dashboard de Anthony Chef! Explora las opciones del menú.</span>
    `;

    document.body.appendChild(tutorialToast);

    requestAnimationFrame(() => {
        tutorialToast.classList.add('show');
    });

    setTimeout(() => {
        tutorialToast.classList.remove('show');
        setTimeout(() => tutorialToast.remove(), 300);
    }, 5000);
}

/**
 * Limpia el cache (mantiene sesión)
 */
function clearCache() {
    // Guardar sesión actual
    const session = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    // Limpiar todo
    localStorage.clear();

    // Restaurar sesión
    if (session) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, session);
    }

    // Mostrar notificación de éxito
    showToast('Cache limpiado correctamente', 'success');
}

/**
 * Restaura configuración a valores por defecto
 */
function resetToDefaults() {
    // Guardar configuración por defecto
    saveConfigToLocalStorage(DEFAULT_CONFIG);

    // Aplicar configuración
    applyConfig(DEFAULT_CONFIG);

    // Mostrar notificación
    showToast('Valores restaurados por defecto', 'info');
}

/**
 * Obtiene la configuración desde los controles del modal
 */
function getConfigFromModal() {
    const toggleDarkTheme = document.getElementById('toggle-dark-theme');
    const toggleNotifications = document.getElementById('toggle-notifications');
    const toggleSalesNotifications = document.getElementById('toggle-sales-notifications');
    const toggleInventoryAlerts = document.getElementById('toggle-inventory-alerts');
    const toggleSounds = document.getElementById('toggle-sounds');
    const selectVolume = document.getElementById('select-volume');
    const toggleAutosave = document.getElementById('toggle-autosave');
    const toggleTutorial = document.getElementById('toggle-tutorial');

    return {
        darkMode: toggleDarkTheme?.checked || false,
        notifications: toggleNotifications?.checked || false,
        salesNotifications: toggleSalesNotifications?.checked || false,
        inventoryAlerts: toggleInventoryAlerts?.checked || false,
        sounds: toggleSounds?.checked || false,
        volume: selectVolume?.value || 'medium',
        autosave: toggleAutosave?.checked || false,
        tutorial: toggleTutorial?.checked || false
    };
}

/**
 * Valida la configuración antes de guardar
 */
function validateConfig(config) {
    // Validación básica: todos los campos requeridos deben existir
    const requiredFields = ['darkMode', 'notifications', 'sounds', 'volume'];

    for (const field of requiredFields) {
        if (!(field in config)) {
            return {
                isValid: false,
                message: `El campo ${field} es requerido`
            };
        }
    }

    // Validar volumen
    const validVolumes = ['low', 'medium', 'high'];
    if (!validVolumes.includes(config.volume)) {
        return {
            isValid: false,
            message: 'El volumen debe ser low, medium o high'
        };
    }

    return { isValid: true };
}

/**
 * Maneja el guardado de configuración
 */
function handleSaveConfig() {
    const btnSaveConfig = document.getElementById('btn-save-config');
    const originalText = btnSaveConfig.innerHTML;
    const originalDisabled = btnSaveConfig.disabled;

    // Obtener configuración desde el modal
    const config = getConfigFromModal();

    // Validar configuración
    const validation = validateConfig(config);
    if (!validation.isValid) {
        showToast(validation.message, 'error');
        return;
    }

    // Mostrar estado de carga
    btnSaveConfig.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    btnSaveConfig.disabled = true;

    // Simular delay de guardado
    setTimeout(() => {
        // Guardar configuración
        saveConfigToLocalStorage(config);

        // Aplicar configuración
        applyConfig(config);

        // Mostrar éxito
        showToast('Configuración guardada correctamente', 'success');

        // Restaurar botón
        btnSaveConfig.innerHTML = '<i class="fas fa-check"></i> ¡Guardado!';
        btnSaveConfig.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

        setTimeout(() => {
            btnSaveConfig.innerHTML = originalText;
            btnSaveConfig.style.background = '';
            btnSaveConfig.disabled = originalDisabled;

            // Cerrar modal
            closeModal(elements.modalConfiguracion);
        }, 1500);
    }, 800);
}

/**
 * Maneja el auto-guardado (sin cerrar modal)
 */
function handleAutosave() {
    const config = getConfigFromModal();
    saveConfigToLocalStorage(config);
    applyConfig(config);
    console.log('Auto-guardado realizado');
}

/**
 * Inicializa los listeners del modal de configuración
 */
function initConfigModalListeners() {
    // Botón Guardar Configuración
    const btnSaveConfig = document.getElementById('btn-save-config');
    if (btnSaveConfig) {
        btnSaveConfig.addEventListener('click', handleSaveConfig);
    }

    // Botón Limpiar Cache
    const btnClearCache = document.getElementById('btn-clear-cache');
    if (btnClearCache) {
        btnClearCache.addEventListener('click', () => {
            if (confirm('¿Estás seguro de limpiar el cache? Se borrarán todos los datos excepto tu sesión.')) {
                clearCache();
            }
        });
    }

    // Botón Reset
    const btnResetDefaults = document.getElementById('btn-reset-defaults');
    if (btnResetDefaults) {
        btnResetDefaults.addEventListener('click', () => {
            if (confirm('¿Estás seguro de restaurar los valores por defecto?')) {
                resetToDefaults();
            }
        });
    }

    // Listeners para auto-guardado en cambios
    const toggles = [
        'toggle-dark-theme',
        'toggle-notifications',
        'toggle-sales-notifications',
        'toggle-inventory-alerts',
        'toggle-sounds',
        'toggle-autosave',
        'toggle-tutorial'
    ];

    toggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', () => {
                const config = getConfig();
                if (config.autosave) {
                    handleAutosave();
                }
            });
        }
    });

    // Listener para select de volumen
    const selectVolume = document.getElementById('select-volume');
    if (selectVolume) {
        selectVolume.addEventListener('change', () => {
            const config = getConfig();
            if (config.autosave) {
                handleAutosave();
            }
        });
    }

    // Prevenir cierre si auto-guardado está desactivado
    const modalCloseButtons = document.querySelectorAll('#modal-configuracion [data-modal-close]');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const config = getConfigFromModal();

            if (config.autosave) {
                handleAutosave();
            }

            closeModal(elements.modalConfiguracion);
        });
    });
}

/**
 * Carga la configuración guardada al iniciar
 */
function loadSavedConfig() {
    const config = getConfig();
    applyConfig(config);
    console.log('Configuración cargada:', config);
}

// ========================================
// MODALES - PERFIL Y CONFIGURACIÓN
// ========================================

/**
 * Muestra error en el formulario de perfil
 */
function showProfileError(field, message) {
    const errorElement = document.getElementById(`error-${field}`);
    const inputElement = document.getElementById(`profile-${field}`);

    if (errorElement) {
        errorElement.textContent = message;
    }
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

/**
 * Limpia todos los errores del formulario de perfil
 */
function clearProfileErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    const inputElements = document.querySelectorAll('.form-input-compact');

    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => el.classList.remove('error'));
}

/**
 * Valida el formulario de perfil
 */
function validateProfileForm() {
    let isValid = true;

    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();

    // Validar nombre
    if (!name) {
        showProfileError('name', 'El nombre es requerido');
        isValid = false;
    } else if (name.length < 3) {
        showProfileError('name', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    }

    // Validar email
    if (!email) {
        showProfileError('email', 'El correo es requerido');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showProfileError('email', 'Ingresa un correo válido');
        isValid = false;
    }

    // Validar teléfono (opcional pero con formato)
    if (phone && !/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
        showProfileError('phone', 'Ingresa un teléfono válido (10 dígitos)');
        isValid = false;
    }

    return { isValid };
}

/**
 * Actualiza la UI del perfil con los nuevos datos
 */
function updateProfileUI(name, email, phone) {
    // Actualizar header del modal
    if (elements.profileNameDisplay) {
        elements.profileNameDisplay.textContent = name;
    }
    if (elements.profileRoleDisplay) {
        // Mantener el rol actual
    }

    // Actualizar nombre en el header (si existe)
    const userNameElements = document.querySelectorAll('#user-name, #user-name-header');
    userNameElements.forEach(el => {
        if (el) el.textContent = name;
    });

    console.log('UI actualizada:', { name, email, phone });
}

/**
 * Abre un modal por ID
 */
function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Cierra un modal por ID
 */
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Abre el modal de Perfil
 */
function openProfileModal() {
    const user = getCurrentUser();

    // Actualizar información del perfil
    if (elements.profileNameDisplay) {
        elements.profileNameDisplay.textContent = user?.name || 'Usuario';
    }
    if (elements.profileRoleDisplay) {
        elements.profileRoleDisplay.textContent = user?.role === 'owner' ? 'Dueño' : 'Administrador';
    }

    openModal(elements.modalPerfil);
}

/**
 * Abre el modal de Configuración
 */
function openConfigModal() {
    openModal(elements.modalConfiguracion);
}

/**
 * Abre el modal de Sucursales
 */
function openSucursalesModal() {
    openModal(elements.modalSucursales);
}

/**
 * Maneja la navegación de sucursales (abre vista)
 */
function handleSucursalesNavigation(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const module = link.dataset.module;

    // Verificar si el usuario tiene permiso para acceder a esta vista
    if (!isOwner() && (module === 'sucursales' || module === 'fabrica')) {
        showToast('No tienes permisos para acceder a esta sección', 'error');
        return;
    }

    // Remover clase active de todos los links
    elements.navLinks.forEach(navLink => {
        navLink.classList.remove('active');
    });
    link.classList.add('active');

    // Actualizar breadcrumb
    if (elements.currentModule) {
        elements.currentModule.textContent = module.charAt(0).toUpperCase() + module.slice(1);
    }

    // Ocultar todas las vistas
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('active');
    });

    // Mostrar la vista correspondiente
    const targetView = document.querySelector(`.view-container[data-view="${module}"]`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Cerrar sidebar en móvil
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
}

// ========================================
// MÓDULO DE GASTOS
// ========================================

/**
 * Datos mock de gastos iniciales
 */
const gastosMock = [
    {
        id: 'G001',
        fecha: '2026-03-01',
        categoria: 'proveedores',
        descripcion: 'Compra de insumos - Carne y pollo',
        sucursal: '1',
        metodo: 'transferencia',
        monto: 450000,
        proveedor: 'Cárnicos del Valle'
    },
    {
        id: 'G002',
        fecha: '2026-03-03',
        categoria: 'servicios',
        descripcion: 'Pago energía eléctrica marzo',
        sucursal: '1',
        metodo: 'transferencia',
        monto: 320000,
        proveedor: 'Enel'
    },
    {
        id: 'G003',
        fecha: '2026-03-05',
        categoria: 'nomina',
        descripcion: 'Pago nómina quincena 1',
        sucursal: '1',
        metodo: 'transferencia',
        monto: 1800000,
        proveedor: ''
    },
    {
        id: 'G004',
        fecha: '2026-03-08',
        categoria: 'mantenimiento',
        descripcion: 'Reparación nevera industrial',
        sucursal: '2',
        metodo: 'efectivo',
        monto: 280000,
        proveedor: 'Servitécnica'
    },
    {
        id: 'G005',
        fecha: '2026-03-10',
        categoria: 'transporte',
        descripcion: 'Combustible flota vehículos',
        sucursal: '1',
        metodo: 'tarjeta_credito',
        monto: 150000,
        proveedor: 'Terpel'
    },
    {
        id: 'G006',
        fecha: '2026-03-12',
        categoria: 'proveedores',
        descripcion: 'Compra verduras y vegetales',
        sucursal: '2',
        metodo: 'efectivo',
        monto: 180000,
        proveedor: 'La Huerta'
    },
    {
        id: 'G007',
        fecha: '2026-03-15',
        categoria: 'marketing',
        descripcion: 'Campaña redes sociales marzo',
        sucursal: '1',
        metodo: 'tarjeta_debito',
        monto: 250000,
        proveedor: 'Digital Ads'
    }
];

/**
 * Almacena los gastos en localStorage
 */
function saveGastosToStorage(gastos) {
    localStorage.setItem('anthony_chef_gastos', JSON.stringify(gastos));
}

/**
 * Obtiene los gastos desde localStorage o usa los mock
 */
function getGastos() {
    const stored = localStorage.getItem('anthony_chef_gastos');
    if (stored) {
        return JSON.parse(stored);
    }
    // Inicializar con datos mock
    saveGastosToStorage(gastosMock);
    return gastosMock;
}

/**
 * Formatea monto a pesos colombianos
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Obtiene el badge HTML para una categoría
 */
function getCategoriaBadge(categoria) {
    const categorias = {
        'proveedores': { label: 'Proveedores', class: 'badge-proveedores' },
        'nomina': { label: 'Nómina', class: 'badge-nomina' },
        'servicios': { label: 'Servicios', class: 'badge-servicios' },
        'arriendos': { label: 'Arriendos', class: 'badge-arriendos' },
        'mantenimiento': { label: 'Mantenimiento', class: 'badge-mantenimiento' },
        'marketing': { label: 'Marketing', class: 'badge-marketing' },
        'impuestos': { label: 'Impuestos', class: 'badge-impuestos' },
        'equipos': { label: 'Equipos', class: 'badge-equipos' },
        'transporte': { label: 'Transporte', class: 'badge-transporte' },
        'varios': { label: 'Varios', class: 'badge-varios' }
    };

    const cat = categorias[categoria] || categorias['varios'];
    return `<span class="badge-categoria ${cat.class}">${cat.label}</span>`;
}

/**
 * Obtiene el badge HTML para método de pago
 */
function getMetodoBadge(metodo) {
    const metodos = {
        'efectivo': { label: 'Efectivo', icon: 'fa-money-bill' },
        'transferencia': { label: 'Transferencia', icon: 'fa-university' },
        'tarjeta_credito': { label: 'T. Crédito', icon: 'fa-credit-card' },
        'tarjeta_debito': { label: 'T. Débito', icon: 'fa-credit-card' },
        'cheque': { label: 'Cheque', icon: 'fa-file-invoice' }
    };

    const met = metodos[metodo] || metodos['efectivo'];
    return `<span class="badge-metodo"><i class="fas ${met.icon}"></i> ${met.label}</span>`;
}

/**
 * Renderiza la tabla de gastos
 */
function renderTablaGastos(gastos) {
    const tbody = document.getElementById('tabla-gastos-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    gastos.forEach(gasto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${gasto.id}</strong></td>
            <td>${new Date(gasto.fecha).toLocaleDateString('es-CO')}</td>
            <td>${getCategoriaBadge(gasto.categoria)}</td>
            <td>${gasto.descripcion}</td>
            <td class="owner-only">${gasto.sucursal === '1' ? 'Centro' : 'Norte'}</td>
            <td>${getMetodoBadge(gasto.metodo)}</td>
            <td><strong>${formatCurrency(gasto.monto)}</strong></td>
            <td>
                <button class="btn-icon" title="Ver" onclick="verDetalleGasto('${gasto.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Eliminar" onclick="abrirModalConfirmarEliminar('gasto', '${gasto.id}', 'el gasto ${gasto.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Calcula y actualiza los KPIs de gastos
 */
function updateGastosKPIs(gastos) {
    const hoy = new Date().toISOString().split('T')[0];
    const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Total día
    const totalDia = gastos
        .filter(g => g.fecha === hoy)
        .reduce((sum, g) => sum + g.monto, 0);

    // Total mes
    const totalMes = gastos
        .filter(g => g.fecha >= primerDiaMes)
        .reduce((sum, g) => sum + g.monto, 0);

    // Promedio diario (días transcurridos del mes)
    const diasTranscurridos = new Date().getDate();
    const promedioDiario = totalMes / diasTranscurridos;

    // Variación vs mes anterior (simulado)
    const variacion = ((Math.random() * 20) - 10).toFixed(1);
    const esPositiva = variacion > 0;
    const esNegativa = variacion < 0;

    // Actualizar DOM
    const kpiTotalDia = document.getElementById('kpi-total-dia');
    const kpiTotalMes = document.getElementById('kpi-total-mes');
    const kpiPromedio = document.getElementById('kpi-promedio');
    const kpiVariacion = document.getElementById('kpi-variacion');
    const kpiVariacionIndicador = document.getElementById('kpi-variacion-indicador');

    if (kpiTotalDia) kpiTotalDia.textContent = formatCurrency(totalDia);
    if (kpiTotalMes) kpiTotalMes.textContent = formatCurrency(totalMes);
    if (kpiPromedio) kpiPromedio.textContent = formatCurrency(promedioDiario);
    if (kpiVariacion) kpiVariacion.textContent = `${Math.abs(variacion)}%`;

    if (kpiVariacionIndicador) {
        kpiVariacionIndicador.className = `kpi-change ${esPositiva ? 'positive' : esNegativa ? 'negative' : 'neutral'}`;
        kpiVariacionIndicador.innerHTML = `
            <i class="fas fa-${esPositiva ? 'arrow-up' : esNegativa ? 'arrow-down' : 'minus'}"></i>
            ${esPositiva ? 'Aumentó' : esNegativa ? 'Disminuyó' : 'Sin cambios'}
        `;
    }
}

/**
 * Filtra gastos según los filtros aplicados
 */
function filtrarGastos() {
    const fechaInicio = document.getElementById('filtro-fecha-inicio')?.value;
    const fechaFin = document.getElementById('filtro-fecha-fin')?.value;
    const categoria = document.getElementById('filtro-categoria')?.value;
    const sucursal = document.getElementById('filtro-sucursal')?.value;
    const metodo = document.getElementById('filtro-metodo')?.value;
    const busqueda = document.getElementById('filtro-busqueda')?.value?.toLowerCase();

    let gastos = getGastos();

    // Aplicar filtros
    if (fechaInicio) {
        gastos = gastos.filter(g => g.fecha >= fechaInicio);
    }
    if (fechaFin) {
        gastos = gastos.filter(g => g.fecha <= fechaFin);
    }
    if (categoria && categoria !== 'all') {
        gastos = gastos.filter(g => g.categoria === categoria);
    }
    if (sucursal && sucursal !== 'all') {
        gastos = gastos.filter(g => g.sucursal === sucursal);
    }
    if (metodo && metodo !== 'all') {
        gastos = gastos.filter(g => g.metodo === metodo);
    }
    if (busqueda) {
        gastos = gastos.filter(g =>
            g.descripcion.toLowerCase().includes(busqueda) ||
            (g.proveedor && g.proveedor.toLowerCase().includes(busqueda))
        );
    }

    // Renderizar tabla y actualizar KPIs
    renderTablaGastos(gastos);
    updateGastosKPIs(gastos);
}

/**
 * Abre el modal de registro de gasto
 */
function abrirModalGasto() {
    const modal = document.getElementById('modal-gasto');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Establecer fecha actual por defecto
        const fechaInput = document.getElementById('gasto-fecha');
        if (fechaInput) {
            fechaInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

/**
 * Guarda un nuevo gasto
 */
function guardarGasto(event) {
    event.preventDefault();

    const user = getCurrentUser();

    const nuevoGasto = {
        id: 'G' + String(Date.now()).slice(-3),
        fecha: document.getElementById('gasto-fecha').value,
        categoria: document.getElementById('gasto-categoria').value,
        descripcion: document.getElementById('gasto-descripcion').value,
        monto: parseFloat(document.getElementById('gasto-monto').value),
        metodo: document.getElementById('gasto-metodo').value,
        proveedor: document.getElementById('gasto-proveedor').value || '',
        notas: document.getElementById('gasto-notas').value || '',
        sucursal: document.getElementById('gasto-sucursal')?.value || user?.branchId || '1'
    };

    // Validaciones adicionales
    if (nuevoGasto.monto <= 0) {
        showToast('El monto debe ser mayor a 0', 'error');
        return;
    }

    // Obtener gastos existentes y agregar nuevo
    const gastos = getGastos();
    gastos.unshift(nuevoGasto); // Agregar al inicio
    saveGastosToStorage(gastos);

    // Mostrar éxito
    showToast('Gasto registrado correctamente', 'success');

    // Cerrar modal
    const modal = document.getElementById('modal-gasto');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Resetear formulario
    document.getElementById('form-gasto')?.reset();

    // Recargar tabla y KPIs
    filtrarGastos();
}

/**
 * Inicializa los listeners del módulo de gastos
 */
function initGastosModule() {
    // Botón Nuevo Gasto
    const btnNuevoGasto = document.getElementById('btn-nuevo-gasto');
    if (btnNuevoGasto) {
        btnNuevoGasto.addEventListener('click', abrirModalGasto);
    }

    // Botón Guardar Gasto
    const formGasto = document.getElementById('form-gasto');
    if (formGasto) {
        formGasto.addEventListener('submit', guardarGasto);
    }

    // Botón Aplicar Filtros
    const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener('click', filtrarGastos);
    }

    // Botón Limpiar Filtros
    const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', () => {
            document.getElementById('filtro-fecha-inicio').value = '';
            document.getElementById('filtro-fecha-fin').value = '';
            document.getElementById('filtro-categoria').value = 'all';
            document.getElementById('filtro-sucursal').value = 'all';
            document.getElementById('filtro-metodo').value = 'all';
            document.getElementById('filtro-busqueda').value = '';
            filtrarGastos();
        });
    }

    // Botón Exportar
    const btnExportar = document.getElementById('btn-exportar-gastos');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            showToast('Función de exportación próximamente', 'info');
        });
    }

    // Modal Gasto - Close buttons
    const modalGasto = document.getElementById('modal-gasto');
    if (modalGasto) {
        const closeButtons = modalGasto.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modalGasto.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Click outside
        modalGasto.addEventListener('click', (event) => {
            if (event.target === modalGasto) {
                modalGasto.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Cargar datos iniciales
    filtrarGastos();
}

// Funciones globales para los botones de la tabla
window.verGasto = function (id) {
    showToast(`Ver detalle del gasto ${id} - Próximamente`, 'info');
};

window.editarGasto = function (id) {
    showToast(`Editar gasto ${id} - Próximamente`, 'info');
};

// ========================================
// MÓDULO DE INVENTARIO
// ========================================

/**
 * Datos mock de productos
 */
const productosMock = [
    { id: 'P001', codigo: 'BEB-001', nombre: 'Gaseosa 1.5L', categoria: 'bebidas', unidad: 'unidad', stock: 45, stockMinimo: 20, costo: 2500, venta: 4000, ubicacion: 'Nevera 1', sucursal: '1', proveedor: 'Bebidas SAS' },
    { id: 'P002', codigo: 'BEB-002', nombre: 'Jugo Natural 500ml', categoria: 'bebidas', unidad: 'unidad', stock: 12, stockMinimo: 15, costo: 1800, venta: 3000, ubicacion: 'Nevera 1', sucursal: '1', proveedor: 'Jugos del Valle' },
    { id: 'P003', codigo: 'ALI-001', nombre: 'Carne Res kg', categoria: 'alimentos', unidad: 'kilogramo', stock: 8, stockMinimo: 10, costo: 18000, venta: 28000, ubicacion: 'Congelador', sucursal: '1', proveedor: 'Cárnicos del Valle' },
    { id: 'P004', codigo: 'ALI-002', nombre: 'Pollo Entero', categoria: 'alimentos', unidad: 'unidad', stock: 25, stockMinimo: 15, costo: 12000, venta: 18000, ubicacion: 'Congelador', sucursal: '1', proveedor: 'Cárnicos del Valle' },
    { id: 'P005', codigo: 'INS-001', nombre: 'Aceite Vegetal 1L', categoria: 'insumos', unidad: 'litro', stock: 6, stockMinimo: 8, costo: 8000, venta: 12000, ubicacion: 'Despensa', sucursal: '1', proveedor: 'Distribuidora Central' },
    { id: 'P006', codigo: 'EMP-001', nombre: 'Caja Hamburguesa', categoria: 'empaques', unidad: 'caja', stock: 50, stockMinimo: 20, costo: 15000, venta: 0, ubicacion: 'Almacén', sucursal: '1', proveedor: 'Empaques Express' },
    { id: 'P007', codigo: 'LIM-001', nombre: 'Detergente 5L', categoria: 'limpieza', unidad: 'litro', stock: 3, stockMinimo: 5, costo: 22000, venta: 0, ubicacion: 'Cuarto Limpieza', sucursal: '1', proveedor: 'Limpiezas YA' },
    { id: 'P008', codigo: 'PAP-001', nombre: 'Rollos Ticket', categoria: 'papeleria', unidad: 'unidad', stock: 30, stockMinimo: 10, costo: 3500, venta: 0, ubicacion: 'Caja', sucursal: '1', proveedor: 'Papelería Central' },
    { id: 'P009', codigo: 'BEB-003', nombre: 'Cerveza 330ml', categoria: 'bebidas', unidad: 'unidad', stock: 120, stockMinimo: 50, costo: 2200, venta: 4000, ubicacion: 'Nevera 2', sucursal: '2', proveedor: 'Bebidas SAS' },
    { id: 'P010', codigo: 'ALI-003', nombre: 'Pan Hamburguesa', categoria: 'alimentos', unidad: 'unidad', stock: 18, stockMinimo: 25, costo: 800, venta: 1500, ubicacion: 'Refrigerador', sucursal: '2', proveedor: 'Panadería El Trigo' }
];

/**
 * Datos mock de movimientos
 */
const movimientosMock = [
    { id: 'M001', fecha: '2026-03-25', tipo: 'entrada', producto: 'Gaseosa 1.5L', cantidad: 50, motivo: 'compra', usuario: 'Admin', sucursal: '1' },
    { id: 'M002', fecha: '2026-03-26', tipo: 'salida', producto: 'Carne Res kg', cantidad: 5, motivo: 'venta', usuario: 'Admin', sucursal: '1' },
    { id: 'M003', fecha: '2026-03-26', tipo: 'entrada', producto: 'Pollo Entero', cantidad: 30, motivo: 'compra', usuario: 'Admin', sucursal: '1' },
    { id: 'M004', fecha: '2026-03-27', tipo: 'salida', producto: 'Aceite Vegetal 1L', cantidad: 2, motivo: 'merma', usuario: 'Admin', sucursal: '1' },
    { id: 'M005', fecha: '2026-03-27', tipo: 'entrada', producto: 'Caja Hamburguesa', cantidad: 20, motivo: 'compra', usuario: 'Admin', sucursal: '1' },
    { id: 'M006', fecha: '2026-03-28', tipo: 'salida', producto: 'Gaseosa 1.5L', cantidad: 10, motivo: 'venta', usuario: 'Admin', sucursal: '1' },
    { id: 'M007', fecha: '2026-03-28', tipo: 'entrada', producto: 'Detergente 5L', cantidad: 4, motivo: 'compra', usuario: 'Admin', sucursal: '1' }
];

/**
 * Datos mock de proveedores
 */
const proveedoresMock = [
    { id: 'PR001', nombre: 'Bebidas SAS', contacto: 'Juan Pérez', telefono: '300 111 2222', email: 'ventas@bebidas.com', productos: 'Gaseosas, Jugos', tiempoEntrega: '1dia', calificacion: 5 },
    { id: 'PR002', nombre: 'Cárnicos del Valle', contacto: 'María Gómez', telefono: '300 333 4444', email: 'pedidos@caricos.com', productos: 'Carnes, Pollos', tiempoEntrega: 'inmediato', calificacion: 5 },
    { id: 'PR003', nombre: 'Distribuidora Central', contacto: 'Carlos López', telefono: '300 555 6666', email: 'ventas@districentral.com', productos: 'Insumos varios', tiempoEntrega: '2-3dias', calificacion: 4 },
    { id: 'PR004', nombre: 'Empaques Express', contacto: 'Ana Rodríguez', telefono: '300 777 8888', email: 'ventas@empaques.com', productos: 'Empaques, Desechables', tiempoEntrega: '1dia', calificacion: 4 },
    { id: 'PR005', nombre: 'Panadería El Trigo', contacto: 'Pedro Sánchez', telefono: '300 999 0000', email: 'pedidos@eltrigo.com', productos: 'Pan, Masas', tiempoEntrega: 'inmediato', calificacion: 5 }
];

/**
 * Obtiene productos desde localStorage
 */
function getProductos() {
    const stored = localStorage.getItem('anthony_chef_productos');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_productos', JSON.stringify(productosMock));
    return productosMock;
}

/**
 * Guarda productos en localStorage
 */
function saveProductosToStorage(productos) {
    localStorage.setItem('anthony_chef_productos', JSON.stringify(productos));
}

/**
 * Obtiene movimientos desde localStorage
 */
function getMovimientos() {
    const stored = localStorage.getItem('anthony_chef_movimientos');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_movimientos', JSON.stringify(movimientosMock));
    return movimientosMock;
}

/**
 * Obtiene proveedores desde localStorage
 */
function getProveedores() {
    const stored = localStorage.getItem('anthony_chef_proveedores');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_proveedores', JSON.stringify(proveedoresMock));
    return proveedoresMock;
}

/**
 * Obtiene estado del stock
 */
function getStockStatus(stock, stockMinimo) {
    if (stock <= 0) return 'critico';
    if (stock <= stockMinimo) return 'bajo';
    return 'optimo';
}

/**
 * Obtiene badge de estado de stock
 */
function getStockBadge(stock, stockMinimo) {
    const status = getStockStatus(stock, stockMinimo);
    const labels = {
        'critico': 'Crítico',
        'bajo': 'Bajo',
        'optimo': 'Óptimo'
    };
    return `<span class="badge-categoria badge-stock-${status}">${labels[status]}</span>`;
}

/**
 * Renderiza tabla de productos
 */
function renderTablaProductos(productos) {
    const tbody = document.getElementById('tabla-productos-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    productos.forEach(prod => {
        const tr = document.createElement('tr');
        const stockClass = getStockStatus(prod.stock, prod.stockMinimo);
        if (stockClass === 'critico') {
            tr.style.background = 'rgba(239, 68, 68, 0.05)';
        }

        tr.innerHTML = `
            <td><strong>${prod.codigo}</strong></td>
            <td>${prod.nombre}</td>
            <td>${getCategoriaBadge(prod.categoria)}</td>
            <td><strong>${prod.stock}</strong> ${prod.unidad}</td>
            <td>${prod.stockMinimo}</td>
            <td>${getStockBadge(prod.stock, prod.stockMinimo)}</td>
            <td>${formatCurrency(prod.costo)}</td>
            <td>${formatCurrency(prod.venta)}</td>
            <td class="owner-only">${prod.sucursal === '1' ? 'Centro' : 'Norte'}</td>
            <td>
                <button class="btn-icon" title="Ver" onclick="verDetalleProducto('${prod.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Editar" onclick="editarProducto('${prod.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Eliminar" onclick="abrirModalConfirmarEliminar('producto', '${prod.id}', 'el producto ${prod.nombre}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza tabla de movimientos
 */
function renderTablaMovimientos(movimientos) {
    const tbody = document.getElementById('tabla-movimientos-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    movimientos.forEach(mov => {
        const tr = document.createElement('tr');
        const tipoClass = mov.tipo === 'entrada' ? 'text-success' : 'text-danger';
        const tipoIcon = mov.tipo === 'entrada' ? 'fa-arrow-down' : 'fa-arrow-up';

        tr.innerHTML = `
            <td><strong>${mov.id}</strong></td>
            <td>${new Date(mov.fecha).toLocaleDateString('es-CO')}</td>
            <td><span class="${tipoClass}"><i class="fas ${tipoIcon}"></i> ${mov.tipo.toUpperCase()}</span></td>
            <td>${mov.producto}</td>
            <td><strong>${mov.cantidad}</strong></td>
            <td>${mov.motivo}</td>
            <td>${mov.usuario}</td>
            <td class="owner-only">${mov.sucursal === '1' ? 'Centro' : 'Norte'}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza tabla de proveedores
 */
function renderTablaProveedores(proveedores) {
    const tbody = document.getElementById('tabla-proveedores-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    proveedores.forEach(prov => {
        const tr = document.createElement('tr');
        const stars = '★'.repeat(prov.calificacion) + '☆'.repeat(5 - prov.calificacion);

        tr.innerHTML = `
            <td><strong>${prov.nombre}</strong></td>
            <td>${prov.contacto}</td>
            <td>${prov.telefono}</td>
            <td>${prov.email}</td>
            <td>${prov.productos}</td>
            <td>${prov.tiempoEntrega}</td>
            <td style="color: #f59e0b;">${stars}</td>
            <td>
                <button class="btn-icon" title="Ver" onclick="verDetalleProveedor('${prov.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Editar" onclick="editarProveedor('${prov.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Eliminar" onclick="abrirModalConfirmarEliminar('proveedor', '${prov.id}', 'el proveedor ${prov.nombre}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza alertas de stock
 */
function renderAlertas(productos) {
    const container = document.getElementById('alertas-inventario');
    const alertasCount = document.getElementById('alertas-count');
    if (!container) return;

    container.innerHTML = '';

    const alertas = productos.filter(p => p.stock <= p.stockMinimo);

    if (alertasCount) {
        alertasCount.textContent = alertas.length;
    }

    if (alertas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle empty-icon" style="color: var(--success-500);"></i>
                <h3>¡Todo en orden!</h3>
                <p>No hay productos con stock crítico o bajo</p>
            </div>
        `;
        return;
    }

    alertas.forEach(prod => {
        const status = getStockStatus(prod.stock, prod.stockMinimo);
        const alertaClass = status === 'critico' ? '' : 'alert-warning';
        const icon = status === 'critico' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';

        const div = document.createElement('div');
        div.className = `alerta-item ${alertaClass}`;
        div.innerHTML = `
            <div class="alerta-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="alerta-content">
                <h4 class="alerta-title">${prod.nombre} (${prod.codigo})</h4>
                <p class="alerta-text">
                    Stock actual: <strong>${prod.stock}</strong> | 
                    Stock mínimo: <strong>${prod.stockMinimo}</strong> | 
                    Faltan: <strong>${prod.stockMinimo - prod.stock}</strong> unidades
                </p>
            </div>
            <div class="alerta-actions">
                <button class="btn btn-sm btn-primary" onclick="solicitarReposicion('${prod.id}')">
                    <i class="fas fa-shopping-cart"></i>
                    Solicitar
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Actualiza KPIs de inventario
 */
function updateInventarioKPIs(productos) {
    const totalProductos = productos.length;
    const stockBajo = productos.filter(p => p.stock <= p.stockMinimo).length;
    const stockOptimo = productos.filter(p => p.stock > p.stockMinimo).length;
    const valorInventario = productos.reduce((sum, p) => sum + (p.stock * p.costo), 0);

    const kpiTotal = document.getElementById('kpi-total-productos');
    const kpiBajo = document.getElementById('kpi-stock-bajo');
    const kpiOptimo = document.getElementById('kpi-stock-optimo');
    const kpiValor = document.getElementById('kpi-valor-inventario');

    if (kpiTotal) kpiTotal.textContent = totalProductos;
    if (kpiBajo) kpiBajo.textContent = stockBajo;
    if (kpiOptimo) kpiOptimo.textContent = stockOptimo;
    if (kpiValor) kpiValor.textContent = formatCurrency(valorInventario);
}

/**
 * Filtra productos
 */
function filtrarProductos() {
    const busqueda = document.getElementById('filtro-busqueda-producto')?.value?.toLowerCase();
    const categoria = document.getElementById('filtro-categoria-inventario')?.value;
    const estado = document.getElementById('filtro-estado-stock')?.value;
    const sucursal = document.getElementById('filtro-sucursal-inventario')?.value;

    let productos = getProductos();

    if (busqueda) {
        productos = productos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda) ||
            p.codigo.toLowerCase().includes(busqueda)
        );
    }
    if (categoria && categoria !== 'all') {
        productos = productos.filter(p => p.categoria === categoria);
    }
    if (estado && estado !== 'all') {
        productos = productos.filter(p => getStockStatus(p.stock, p.stockMinimo) === estado);
    }
    if (sucursal && sucursal !== 'all') {
        productos = productos.filter(p => p.sucursal === sucursal);
    }

    renderTablaProductos(productos);
    updateInventarioKPIs(productos);
    renderAlertas(productos);
}

/**
 * Abre modal de nuevo producto
 */
function abrirModalProducto() {
    const modal = document.getElementById('modal-producto');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Guarda nuevo producto
 */
function guardarProducto(event) {
    event.preventDefault();

    const user = getCurrentUser();

    const nuevoProducto = {
        id: 'P' + String(Date.now()).slice(-3),
        codigo: document.getElementById('producto-codigo').value || 'P' + String(Date.now()).slice(-3),
        nombre: document.getElementById('producto-nombre').value,
        categoria: document.getElementById('producto-categoria').value,
        unidad: document.getElementById('producto-unidad').value,
        stock: parseInt(document.getElementById('producto-stock-inicial').value),
        stockMinimo: parseInt(document.getElementById('producto-stock-minimo').value),
        costo: parseFloat(document.getElementById('producto-costo').value),
        venta: parseFloat(document.getElementById('producto-venta').value),
        ubicacion: document.getElementById('producto-ubicacion').value || '',
        proveedor: document.getElementById('producto-proveedor').value || '',
        sucursal: document.getElementById('producto-sucursal')?.value || user?.branchId || '1'
    };

    // Validaciones
    if (nuevoProducto.stock < nuevoProducto.stockMinimo) {
        showToast('El stock inicial debe ser mayor o igual al stock mínimo', 'warning');
    }

    const productos = getProductos();
    productos.push(nuevoProducto);
    saveProductosToStorage(productos);

    showToast('Producto registrado correctamente', 'success');

    const modal = document.getElementById('modal-producto');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-producto')?.reset();
    filtrarProductos();
}

/**
 * Abre modal de movimiento
 */
function abrirModalMovimiento() {
    const modal = document.getElementById('modal-movimiento');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Cargar productos en el select
        const productos = getProductos();
        const select = document.getElementById('movimiento-producto');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar producto...</option>';
            productos.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = `${p.nombre} (Stock: ${p.stock})`;
                select.appendChild(option);
            });
        }
    }
}

/**
 * Guarda movimiento de stock
 */
function guardarMovimiento(event) {
    event.preventDefault();

    const user = getCurrentUser();
    const tipo = document.querySelector('input[name="movimiento-tipo"]:checked')?.value;
    const productoId = document.getElementById('movimiento-producto')?.value;
    const cantidad = parseInt(document.getElementById('movimiento-cantidad')?.value);
    const motivo = document.getElementById('movimiento-motivo')?.value;

    if (!productoId || !cantidad || !motivo) {
        showToast('Complete todos los campos requeridos', 'error');
        return;
    }

    const productos = getProductos();
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        showToast('Producto no encontrado', 'error');
        return;
    }

    // Validar stock suficiente para salidas
    if (tipo === 'salida' && producto.stock < cantidad) {
        showToast('Stock insuficiente para realizar esta salida', 'error');
        return;
    }

    // Actualizar stock
    if (tipo === 'entrada') {
        producto.stock += cantidad;
    } else {
        producto.stock -= cantidad;
    }

    saveProductosToStorage(productos);

    // Registrar movimiento
    const movimientos = getMovimientos();
    const nuevoMovimiento = {
        id: 'M' + String(Date.now()).slice(-3),
        fecha: new Date().toISOString().split('T')[0],
        tipo: tipo,
        producto: producto.nombre,
        cantidad: cantidad,
        motivo: motivo,
        usuario: user?.name || 'Admin',
        sucursal: producto.sucursal
    };
    movimientos.unshift(nuevoMovimiento);
    localStorage.setItem('anthony_chef_movimientos', JSON.stringify(movimientos));

    const tipoTexto = tipo === 'entrada' ? 'Entrada' : 'Salida';
    showToast(`${tipoTexto} de ${cantidad} unidades registrada`, 'success');

    const modal = document.getElementById('modal-movimiento');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-movimiento')?.reset();
    filtrarProductos();
}

/**
 * Abre modal de nuevo proveedor
 */
function abrirModalProveedor() {
    const modal = document.getElementById('modal-proveedor');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Guarda nuevo proveedor
 */
function guardarProveedor(event) {
    event.preventDefault();

    const nuevoProveedor = {
        id: 'PR' + String(Date.now()).slice(-3),
        nombre: document.getElementById('proveedor-nombre').value,
        contacto: document.getElementById('proveedor-contacto').value || '',
        telefono: document.getElementById('proveedor-telefono').value,
        email: document.getElementById('proveedor-email').value || '',
        direccion: document.getElementById('proveedor-direccion').value || '',
        productos: document.getElementById('proveedor-productos').value || '',
        tiempoEntrega: document.getElementById('proveedor-tiempo').value || '',
        calificacion: parseInt(document.getElementById('proveedor-calificacion').value),
        notas: document.getElementById('proveedor-notas').value || ''
    };

    const proveedores = getProveedores();
    proveedores.push(nuevoProveedor);
    localStorage.setItem('anthony_chef_proveedores', JSON.stringify(proveedores));

    showToast('Proveedor registrado correctamente', 'success');

    const modal = document.getElementById('modal-proveedor');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-proveedor')?.reset();
    renderTablaProveedores(getProveedores());
}

/**
 * Inicializa tabs del módulo
 */
function initInventarioTabs() {
    const tabBtns = document.querySelectorAll('.module-tabs .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Activar actual
            btn.classList.add('active');
            document.querySelector(`.tab-content[data-content="${tab}"]`)?.classList.add('active');
        });
    });
}

/**
 * Inicializa listeners del módulo de inventario
 */
function initInventarioModule() {
    // Inicializar tabs
    initInventarioTabs();

    // Botón Nuevo Producto
    const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
    if (btnNuevoProducto) {
        btnNuevoProducto.addEventListener('click', abrirModalProducto);
    }

    // Botón Movimiento Stock
    const btnMovimiento = document.getElementById('btn-movimiento-stock');
    if (btnMovimiento) {
        btnMovimiento.addEventListener('click', abrirModalMovimiento);
    }

    // Botón Nuevo Proveedor
    const btnNuevoProveedor = document.getElementById('btn-nuevo-proveedor');
    if (btnNuevoProveedor) {
        btnNuevoProveedor.addEventListener('click', abrirModalProveedor);
    }

    // Form Producto
    const formProducto = document.getElementById('form-producto');
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProducto);
    }

    // Form Movimiento
    const formMovimiento = document.getElementById('form-movimiento');
    if (formMovimiento) {
        formMovimiento.addEventListener('submit', guardarMovimiento);
    }

    // Form Proveedor
    const formProveedor = document.getElementById('form-proveedor');
    if (formProveedor) {
        formProveedor.addEventListener('submit', guardarProveedor);
    }

    // Filtros
    const btnFiltrar = document.getElementById('btn-aplicar-filtros-inventario');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarProductos);
    }

    // Botón Exportar
    const btnExportar = document.getElementById('btn-exportar-inventario');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            showToast('Función de exportación próximamente', 'info');
        });
    }

    // Solicitar Reposición
    const btnReposicion = document.getElementById('btn-solicitar-reposicion');
    if (btnReposicion) {
        btnReposicion.addEventListener('click', () => {
            showToast('Función de reposición próximamente', 'info');
        });
    }

    // Modales - Close
    ['modal-producto', 'modal-movimiento', 'modal-proveedor'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const closeButtons = modal.querySelectorAll('[data-modal-close]');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Cargar datos iniciales
    filtrarProductos();
    renderTablaMovimientos(getMovimientos());
    renderTablaProveedores(getProveedores());
}

// Funciones globales para la tabla
window.editarProducto = function (id) {
    showToast(`Editar producto ${id} - Próximamente`, 'info');
};

window.verMovimientosProducto = function (id) {
    showToast(`Ver movimientos de producto ${id} - Próximamente`, 'info');
};

window.editarProveedor = function (id) {
    showToast(`Editar proveedor ${id} - Próximamente`, 'info');
};

window.contactarProveedor = function (id) {
    showToast(`Contactar proveedor ${id} - Próximamente`, 'info');
};

window.solicitarReposicion = function (id) {
    showToast(`Solicitud de reposición para producto ${id} enviada`, 'success');
};

// ========================================
// MÓDULO DE EMPLEADOS
// ========================================

/**
 * Datos mock de empleados
 */
const empleadosMock = [
    { id: 'E001', nombre: 'Juan Pérez', tipoDocumento: 'cc', documento: '1234567890', cargo: 'gerente', telefono: '300 111 2222', email: 'juan@anthonychef.com', fechaIngreso: '2024-01-15', salario: 2500000, estado: 'activo', sucursal: '1', fechaNacimiento: '1985-05-20' },
    { id: 'E002', nombre: 'María Gómez', tipoDocumento: 'cc', documento: '9876543210', cargo: 'jefe_cocina', telefono: '300 333 4444', email: 'maria@anthonychef.com', fechaIngreso: '2024-02-01', salario: 2000000, estado: 'activo', sucursal: '1', fechaNacimiento: '1990-08-15' },
    { id: 'E003', nombre: 'Carlos López', tipoDocumento: 'cc', documento: '1122334455', cargo: 'cocinero', telefono: '300 555 6666', email: 'carlos@anthonychef.com', fechaIngreso: '2024-03-10', salario: 1500000, estado: 'activo', sucursal: '1', fechaNacimiento: '1995-03-22' },
    { id: 'E004', nombre: 'Ana Rodríguez', tipoDocumento: 'cc', documento: '5544332211', cargo: 'mesero', telefono: '300 777 8888', email: 'ana@anthonychef.com', fechaIngreso: '2024-04-05', salario: 1200000, estado: 'vacaciones', sucursal: '1', fechaNacimiento: '1998-11-30' },
    { id: 'E005', nombre: 'Pedro Sánchez', tipoDocumento: 'cc', documento: '6677889900', cargo: 'cajero', telefono: '300 999 0000', email: 'pedro@anthonychef.com', fechaIngreso: '2024-05-20', salario: 1200000, estado: 'activo', sucursal: '1', fechaNacimiento: '2000-01-10' },
    { id: 'E006', nombre: 'Laura Martínez', tipoDocumento: 'cc', documento: '9988776655', cargo: 'barman', telefono: '301 111 2222', email: 'laura@anthonychef.com', fechaIngreso: '2024-06-15', salario: 1300000, estado: 'activo', sucursal: '2', fechaNacimiento: '1997-07-25' },
    { id: 'E007', nombre: 'Diego Hernández', tipoDocumento: 'cc', documento: '4433221100', cargo: 'ayudante', telefono: '301 333 4444', email: 'diego@anthonychef.com', fechaIngreso: '2024-07-01', salario: 1100000, estado: 'activo', sucursal: '2', fechaNacimiento: '1999-12-05' },
    { id: 'E008', nombre: 'Sofía Torres', tipoDocumento: 'cc', documento: '2211009988', cargo: 'limpieza', telefono: '301 555 6666', email: 'sofia@anthonychef.com', fechaIngreso: '2024-08-10', salario: 1100000, estado: 'permiso', sucursal: '2', fechaNacimiento: '1988-04-18' },
    { id: 'E009', nombre: 'Miguel Ángel Díaz', tipoDocumento: 'cc', documento: '7766554433', cargo: 'repartidor', telefono: '301 777 8888', email: 'miguel@anthonychef.com', fechaIngreso: '2024-09-01', salario: 1200000, estado: 'activo', sucursal: '1', fechaNacimiento: '1993-09-28' },
    { id: 'E010', nombre: 'Carmen Ruiz', tipoDocumento: 'cc', documento: '3344556677', cargo: 'administrativo', telefono: '301 999 0000', email: 'carmen@anthonychef.com', fechaIngreso: '2024-10-15', salario: 1400000, estado: 'activo', sucursal: '1', fechaNacimiento: '1991-06-12' }
];

/**
 * Datos mock de asistencia
 */
const asistenciaMock = [
    { id: 'A001', fecha: '2026-03-25', empleadoId: 'E001', empleado: 'Juan Pérez', entrada: '07:55', salida: '17:05', tipo: 'normal', observaciones: '', sucursal: '1' },
    { id: 'A002', fecha: '2026-03-25', empleadoId: 'E002', empleado: 'María Gómez', entrada: '08:00', salida: '17:00', tipo: 'normal', observaciones: '', sucursal: '1' },
    { id: 'A003', fecha: '2026-03-25', empleadoId: 'E003', empleado: 'Carlos López', entrada: '08:15', salida: '17:15', tipo: 'retardo', observaciones: 'Tráfico', sucursal: '1' },
    { id: 'A004', fecha: '2026-03-26', empleadoId: 'E001', empleado: 'Juan Pérez', entrada: '07:50', salida: '17:10', tipo: 'normal', observaciones: '', sucursal: '1' },
    { id: 'A005', fecha: '2026-03-26', empleadoId: 'E004', empleado: 'Ana Rodríguez', entrada: '', salida: '', tipo: 'ausencia', observaciones: 'Vacaciones', sucursal: '1' },
    { id: 'A006', fecha: '2026-03-27', empleadoId: 'E005', empleado: 'Pedro Sánchez', entrada: '07:58', salida: '17:02', tipo: 'normal', observaciones: '', sucursal: '1' },
    { id: 'A007', fecha: '2026-03-27', empleadoId: 'E006', empleado: 'Laura Martínez', entrada: '08:05', salida: '17:05', tipo: 'normal', observaciones: '', sucursal: '2' },
    { id: 'A008', fecha: '2026-03-28', empleadoId: 'E007', empleado: 'Diego Hernández', entrada: '08:00', salida: '17:00', tipo: 'normal', observaciones: '', sucursal: '2' },
    { id: 'A009', fecha: '2026-03-28', empleadoId: 'E008', empleado: 'Sofía Torres', entrada: '', salida: '', tipo: 'permiso', observaciones: 'Cita médica', sucursal: '2' }
];

/**
 * Datos mock de horarios
 */
const horariosMock = [
    { id: 'H001', empleadoId: 'E001', empleado: 'Juan Pérez', cargo: 'gerente', tipo: 'fijo', dias: [1, 2, 3, 4, 5], entrada: '08:00', salida: '17:00', almuerzoInicio: '12:00', almuerzoFin: '13:00', sucursal: '1' },
    { id: 'H002', empleadoId: 'E002', empleado: 'María Gómez', cargo: 'jefe_cocina', tipo: 'fijo', dias: [1, 2, 3, 4, 5, 6], entrada: '07:00', salida: '16:00', almuerzoInicio: '11:00', almuerzoFin: '12:00', sucursal: '1' },
    { id: 'H003', empleadoId: 'E003', empleado: 'Carlos López', cargo: 'cocinero', tipo: 'rotativo', dias: [1, 2, 3, 4, 5, 6, 0], entrada: '14:00', salida: '23:00', almuerzoInicio: '', almuerzoFin: '', sucursal: '1' },
    { id: 'H004', empleadoId: 'E006', empleado: 'Laura Martínez', cargo: 'barman', tipo: 'fijo', dias: [2, 3, 4, 5, 6], entrada: '15:00', salida: '00:00', almuerzoInicio: '', almuerzoFin: '', sucursal: '2' }
];

/**
 * Datos mock de nómina
 */
const nominaMock = [];

/**
 * Nombres de cargos
 */
const nombresCargos = {
    'administrador': 'Administrador',
    'gerente': 'Gerente de Restaurante',
    'jefe_cocina': 'Jefe de Cocina',
    'cocinero': 'Cocinero',
    'ayudante': 'Ayudante de Cocina',
    'mesero': 'Mesero',
    'cajero': 'Cajero',
    'barman': 'Barman',
    'limpieza': 'Auxiliar de Limpieza',
    'repartidor': 'Repartidor',
    'administrativo': 'Administrativo'
};

/**
 * Nombres de días
 */
const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Obtiene empleados desde localStorage
 */
function getEmpleados() {
    const stored = localStorage.getItem('anthony_chef_empleados');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_empleados', JSON.stringify(empleadosMock));
    return empleadosMock;
}

/**
 * Guarda empleados en localStorage
 */
function saveEmpleadosToStorage(empleados) {
    localStorage.setItem('anthony_chef_empleados', JSON.stringify(empleados));
}

/**
 * Obtiene asistencia desde localStorage
 */
function getAsistencia() {
    const stored = localStorage.getItem('anthony_chef_asistencia');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_asistencia', JSON.stringify(asistenciaMock));
    return asistenciaMock;
}

/**
 * Obtiene horarios desde localStorage
 */
function getHorarios() {
    const stored = localStorage.getItem('anthony_chef_horarios');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_horarios', JSON.stringify(horariosMock));
    return horariosMock;
}

/**
 * Obtiene estado badge del empleado
 */
function getEstadoBadge(estado) {
    const estados = {
        'activo': { label: 'Activo', class: 'badge-activo' },
        'inactivo': { label: 'Inactivo', class: 'badge-inactivo' },
        'vacaciones': { label: 'Vacaciones', class: 'badge-vacaciones' },
        'permiso': { label: 'Permiso', class: 'badge-permiso' },
        'licencia': { label: 'Licencia', class: 'badge-licencia' }
    };
    const est = estados[estado] || estados['activo'];
    return `<span class="badge-categoria ${est.class}">${est.label}</span>`;
}

/**
 * Renderiza tabla de empleados
 */
function renderTablaEmpleados(empleados) {
    const tbody = document.getElementById('tabla-empleados-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    empleados.forEach(emp => {
        const tr = document.createElement('tr');
        const iniciales = emp.nombre.split(' ').map(n => n[0]).join('').substring(0, 2);

        tr.innerHTML = `
            <td>
                <div class="empleado-info">
                    <div class="empleado-avatar">${iniciales}</div>
                    <div>
                        <div class="empleado-nombre">${emp.nombre}</div>
                        <div class="empleado-cargo">${nombresCargos[emp.cargo] || emp.cargo}</div>
                    </div>
                </div>
            </td>
            <td>${emp.documento}</td>
            <td>${getCategoriaBadge(emp.cargo)}</td>
            <td>${emp.telefono}</td>
            <td>${new Date(emp.fechaIngreso).toLocaleDateString('es-CO')}</td>
            <td>${getEstadoBadge(emp.estado)}</td>
            <td class="owner-only">${emp.sucursal === '1' ? 'Centro' : 'Norte'}</td>
            <td>
                <button class="btn-icon" title="Ver" onclick="verDetalleEmpleado('${emp.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Editar" onclick="editarEmpleado('${emp.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Eliminar" onclick="abrirModalConfirmarEliminar('empleado', '${emp.id}', 'el empleado ${emp.nombre}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza tabla de asistencia
 */
function renderTablaAsistencia(asistencia) {
    const tbody = document.getElementById('tabla-asistencia-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    asistencia.forEach(reg => {
        const tr = document.createElement('tr');
        const tipoClass = reg.tipo === 'normal' ? 'text-success' : reg.tipo === 'ausencia' ? 'text-danger' : 'text-warning';

        tr.innerHTML = `
            <td>${new Date(reg.fecha).toLocaleDateString('es-CO')}</td>
            <td>${reg.empleado}</td>
            <td>${reg.entrada || '--:--'}</td>
            <td>${reg.salida || '--:--'}</td>
            <td><span class="${tipoClass}">${reg.tipo.toUpperCase()}</span></td>
            <td>${reg.observaciones || '-'}</td>
            <td class="owner-only">${reg.sucursal === '1' ? 'Centro' : 'Norte'}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza horarios
 */
function renderHorarios(horarios) {
    const container = document.getElementById('horarios-empleados');
    if (!container) return;

    container.innerHTML = '';

    if (horarios.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times empty-icon"></i>
                <h3>No hay horarios configurados</h3>
                <p>Configura los horarios del equipo</p>
            </div>
        `;
        return;
    }

    horarios.forEach(hor => {
        const div = document.createElement('div');
        div.className = 'horario-card';

        const diasHTML = hor.dias.map(d =>
            `<span class="horario-dia ${hor.dias.includes(d) ? 'activo' : ''}">${nombresDias[d]}</span>`
        ).join('');

        div.innerHTML = `
            <div class="horario-header">
                <div class="empleado-avatar">${hor.empleado.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
                <div>
                    <div class="horario-empleado">${hor.empleado}</div>
                    <div class="horario-cargo">${nombresCargos[hor.cargo] || hor.cargo}</div>
                </div>
            </div>
            <div class="horario-body">
                <div class="horario-row">
                    <span class="horario-label">Tipo:</span>
                    <span class="horario-value">${hor.tipo.toUpperCase()}</span>
                </div>
                <div class="horario-row">
                    <span class="horario-label">Días:</span>
                    <div class="horario-dias">${diasHTML}</div>
                </div>
                <div class="horario-row">
                    <span class="horario-label">Entrada:</span>
                    <span class="horario-value">${hor.entrada || '--:--'}</span>
                </div>
                <div class="horario-row">
                    <span class="horario-label">Salida:</span>
                    <span class="horario-value">${hor.salida || '--:--'}</span>
                </div>
                ${hor.almuerzoInicio ? `
                <div class="horario-row">
                    <span class="horario-label">Almuerzo:</span>
                    <span class="horario-value">${hor.almuerzoInicio} - ${hor.almuerzoFin}</span>
                </div>
                ` : ''}
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Actualiza KPIs de empleados
 */
function updateEmpleadosKPIs(empleados, asistencia) {
    const activos = empleados.filter(e => e.estado === 'activo').length;
    const vacaciones = empleados.filter(e => e.estado === 'vacaciones' || e.estado === 'permiso').length;

    const hoy = new Date().toISOString().split('T')[0];
    const asistenciaHoy = asistencia.filter(a => a.fecha === hoy && a.tipo !== 'ausencia').length;

    const mesActual = new Date().getMonth();
    const cumpleanos = empleados.filter(e => new Date(e.fechaNacimiento).getMonth() === mesActual).length;

    const kpiActivos = document.getElementById('kpi-empleados-activos');
    const kpiAsistencia = document.getElementById('kpi-asistencia-hoy');
    const kpiVacaciones = document.getElementById('kpi-vacaciones');
    const kpiCumpleanos = document.getElementById('kpi-cumpleanos');

    if (kpiActivos) kpiActivos.textContent = activos;
    if (kpiAsistencia) kpiAsistencia.textContent = asistenciaHoy;
    if (kpiVacaciones) kpiVacaciones.textContent = vacaciones;
    if (kpiCumpleanos) kpiCumpleanos.textContent = cumpleanos;
}

/**
 * Filtra empleados
 */
function filtrarEmpleados() {
    const busqueda = document.getElementById('filtro-busqueda-empleado')?.value?.toLowerCase();
    const cargo = document.getElementById('filtro-cargo-empleado')?.value;
    const estado = document.getElementById('filtro-estado-empleado')?.value;
    const sucursal = document.getElementById('filtro-sucursal-empleado')?.value;

    let empleados = getEmpleados();

    if (busqueda) {
        empleados = empleados.filter(e =>
            e.nombre.toLowerCase().includes(busqueda) ||
            e.documento.toLowerCase().includes(busqueda) ||
            nombresCargos[e.cargo]?.toLowerCase().includes(busqueda)
        );
    }
    if (cargo && cargo !== 'all') {
        empleados = empleados.filter(e => e.cargo === cargo);
    }
    if (estado && estado !== 'all') {
        empleados = empleados.filter(e => e.estado === estado);
    }
    if (sucursal && sucursal !== 'all') {
        empleados = empleados.filter(e => e.sucursal === sucursal);
    }

    renderTablaEmpleados(empleados);
    updateEmpleadosKPIs(getEmpleados(), getAsistencia());
}

/**
 * Abre modal de nuevo empleado
 */
function abrirModalEmpleado() {
    const modal = document.getElementById('modal-empleado');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Establecer fecha de ingreso por defecto
        const fechaInput = document.getElementById('empleado-fecha-ingreso');
        if (fechaInput) {
            fechaInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

/**
 * Guarda nuevo empleado
 */
function guardarEmpleado(event) {
    event.preventDefault();

    const user = getCurrentUser();

    const nuevoEmpleado = {
        id: 'E' + String(Date.now()).slice(-3),
        nombre: document.getElementById('empleado-nombre').value,
        tipoDocumento: document.getElementById('empleado-tipo-documento').value,
        documento: document.getElementById('empleado-documento').value,
        fechaNacimiento: document.getElementById('empleado-fecha-nacimiento').value || '',
        genero: document.getElementById('empleado-genero').value || '',
        cargo: document.getElementById('empleado-cargo').value,
        fechaIngreso: document.getElementById('empleado-fecha-ingreso').value,
        salario: parseFloat(document.getElementById('empleado-salario').value),
        telefono: document.getElementById('empleado-telefono').value,
        email: document.getElementById('empleado-email').value || '',
        direccion: document.getElementById('empleado-direccion').value || '',
        emergencia: document.getElementById('empleado-emergencia').value || '',
        banco: document.getElementById('empleado-banco').value || '',
        cuenta: document.getElementById('empleado-cuenta').value || '',
        observaciones: document.getElementById('empleado-observaciones').value || '',
        estado: document.getElementById('empleado-estado').value,
        sucursal: document.getElementById('empleado-sucursal')?.value || user?.branchId || '1'
    };

    const empleados = getEmpleados();
    empleados.push(nuevoEmpleado);
    saveEmpleadosToStorage(empleados);

    showToast('Empleado registrado correctamente', 'success');

    const modal = document.getElementById('modal-empleado');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-empleado')?.reset();
    filtrarEmpleados();
}

/**
 * Abre modal de asistencia
 */
function abrirModalAsistencia() {
    const modal = document.getElementById('modal-asistencia');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Cargar empleados en el select
        const empleados = getEmpleados().filter(e => e.estado === 'activo');
        const select = document.getElementById('asistencia-empleado');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar empleado...</option>';
            empleados.forEach(e => {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = e.nombre;
                select.appendChild(option);
            });
        }

        // Establecer fecha y hora actual
        const fechaInput = document.getElementById('asistencia-fecha');
        const horaInput = document.getElementById('asistencia-hora');
        if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
        if (horaInput) {
            const now = new Date();
            horaInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }
}

/**
 * Guarda registro de asistencia
 */
function guardarAsistencia(event) {
    event.preventDefault();

    const user = getCurrentUser();
    const empleadoId = document.getElementById('asistencia-empleado')?.value;
    const fecha = document.getElementById('asistencia-fecha')?.value;
    const hora = document.getElementById('asistencia-hora')?.value;
    const tipo = document.querySelector('input[name="asistencia-tipo"]:checked')?.value;
    const observaciones = document.getElementById('asistencia-observaciones')?.value || '';

    if (!empleadoId || !fecha || !tipo) {
        showToast('Complete todos los campos requeridos', 'error');
        return;
    }

    const empleados = getEmpleados();
    const empleado = empleados.find(e => e.id === empleadoId);

    if (!empleado) {
        showToast('Empleado no encontrado', 'error');
        return;
    }

    const asistencia = getAsistencia();
    const nuevoRegistro = {
        id: 'A' + String(Date.now()).slice(-3),
        fecha: fecha,
        empleadoId: empleadoId,
        empleado: empleado.nombre,
        entrada: tipo === 'entrada' ? hora : '',
        salida: tipo === 'salida' ? hora : '',
        tipo: tipo === 'entrada' ? 'normal' : tipo,
        observaciones: observaciones,
        sucursal: empleado.sucursal
    };

    asistencia.unshift(nuevoRegistro);
    localStorage.setItem('anthony_chef_asistencia', JSON.stringify(asistencia));

    const tipoTexto = tipo === 'entrada' ? 'Entrada' : 'Salida';
    showToast(`${tipoTexto} de ${empleado.nombre} registrada`, 'success');

    const modal = document.getElementById('modal-asistencia');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-asistencia')?.reset();
    renderTablaAsistencia(asistencia);
    updateEmpleadosKPIs(empleados, asistencia);
}

/**
 * Abre modal de horario
 */
function abrirModalHorario() {
    const modal = document.getElementById('modal-horario');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Cargar empleados en el select
        const empleados = getEmpleados();
        const select = document.getElementById('horario-empleado');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar empleado...</option>';
            empleados.forEach(e => {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = `${e.nombre} (${nombresCargos[e.cargo]})`;
                select.appendChild(option);
            });
        }
    }
}

/**
 * Guarda horario
 */
function guardarHorario(event) {
    event.preventDefault();

    const empleadoId = document.getElementById('horario-empleado')?.value;
    const tipo = document.getElementById('horario-tipo')?.value;
    const entrada = document.getElementById('horario-entrada')?.value;
    const salida = document.getElementById('horario-salida')?.value;
    const almuerzoInicio = document.getElementById('horario-almuerzo-inicio')?.value;
    const almuerzoFin = document.getElementById('horario-almuerzo-fin')?.value;

    const diasCheckboxes = document.querySelectorAll('input[name="horario-dias"]:checked');
    const dias = Array.from(diasCheckboxes).map(cb => parseInt(cb.value));

    if (!empleadoId || dias.length === 0) {
        showToast('Seleccione empleado y al menos un día', 'error');
        return;
    }

    const empleados = getEmpleados();
    const empleado = empleados.find(e => e.id === empleadoId);

    if (!empleado) {
        showToast('Empleado no encontrado', 'error');
        return;
    }

    const horarios = getHorarios();

    // Verificar si ya existe horario para este empleado
    const existingIndex = horarios.findIndex(h => h.empleadoId === empleadoId);

    const nuevoHorario = {
        id: existingIndex >= 0 ? horarios[existingIndex].id : 'H' + String(Date.now()).slice(-3),
        empleadoId: empleadoId,
        empleado: empleado.nombre,
        cargo: empleado.cargo,
        tipo: tipo,
        dias: dias,
        entrada: entrada,
        salida: salida,
        almuerzoInicio: almuerzoInicio,
        almuerzoFin: almuerzoFin,
        sucursal: empleado.sucursal
    };

    if (existingIndex >= 0) {
        horarios[existingIndex] = nuevoHorario;
    } else {
        horarios.push(nuevoHorario);
    }

    localStorage.setItem('anthony_chef_horarios', JSON.stringify(horarios));

    showToast('Horario guardado correctamente', 'success');

    const modal = document.getElementById('modal-horario');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-horario')?.reset();
    renderHorarios(horarios);
}

/**
 * Inicializa tabs del módulo
 */
function initEmpleadosTabs() {
    const tabBtns = document.querySelectorAll('.module-tabs .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Activar actual
            btn.classList.add('active');
            document.querySelector(`.tab-content[data-content="${tab}"]`)?.classList.add('active');
        });
    });
}

/**
 * Inicializa listeners del módulo de empleados
 */
function initEmpleadosModule() {
    // Inicializar tabs
    initEmpleadosTabs();

    // Botón Nuevo Empleado
    const btnNuevoEmpleado = document.getElementById('btn-nuevo-empleado');
    if (btnNuevoEmpleado) {
        btnNuevoEmpleado.addEventListener('click', abrirModalEmpleado);
    }

    // Botón Registrar Asistencia
    const btnAsistencia = document.getElementById('btn-registrar-asistencia');
    if (btnAsistencia) {
        btnAsistencia.addEventListener('click', abrirModalAsistencia);
    }

    // Botón Configurar Horario
    const btnHorario = document.getElementById('btn-configurar-horario');
    if (btnHorario) {
        btnHorario.addEventListener('click', abrirModalHorario);
    }

    // Form Empleado
    const formEmpleado = document.getElementById('form-empleado');
    if (formEmpleado) {
        formEmpleado.addEventListener('submit', guardarEmpleado);
    }

    // Form Asistencia
    const formAsistencia = document.getElementById('form-asistencia');
    if (formAsistencia) {
        formAsistencia.addEventListener('submit', guardarAsistencia);
    }

    // Form Horario
    const formHorario = document.getElementById('form-horario');
    if (formHorario) {
        formHorario.addEventListener('submit', guardarHorario);
    }

    // Filtros
    const btnFiltrar = document.getElementById('btn-aplicar-filtros-empleado');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarEmpleados);
    }

    // Botón Exportar
    const btnExportar = document.getElementById('btn-exportar-empleados');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            showToast('Función de exportación próximamente', 'info');
        });
    }

    // Modales - Close
    ['modal-empleado', 'modal-asistencia', 'modal-horario'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const closeButtons = modal.querySelectorAll('[data-modal-close]');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Cargar datos iniciales
    filtrarEmpleados();
    renderTablaAsistencia(getAsistencia());
    renderHorarios(getHorarios());
    updateEmpleadosKPIs(getEmpleados(), getAsistencia());
}

// Funciones globales para la tabla
window.editarEmpleado = function (id) {
    showToast(`Editar empleado ${id} - Próximamente`, 'info');
};

window.verEmpleado = function (id) {
    showToast(`Ver detalle de empleado ${id} - Próximamente`, 'info');
};

// ========================================
// MÓDULO DE SUCURSALES
// ========================================

/**
 * Datos mock de sucursales
 */
const sucursalesMock = [
    { id: 'S001', nombre: 'Anthony Chef Centro', direccion: 'Calle 123 #45-67, Centro', ciudad: 'Bogotá', telefono: '300 111 2222', email: 'centro@anthonychef.com', estado: 'activo', gerente: 'Juan Pérez', fechaApertura: '2024-01-15', area: 150, capacidad: 80, mesas: 20, horarioApertura: '08:00', horarioCierre: '22:00', empleados: 12, ventasMes: 45000000, ventasAnio: 540000000, ticketPromedio: 35000, rentabilidad: 18, observaciones: '' },
    { id: 'S002', nombre: 'Anthony Chef Norte', direccion: 'Carrera 78 #90-12, Norte', ciudad: 'Bogotá', telefono: '300 333 4444', email: 'norte@anthonychef.com', estado: 'activo', gerente: 'María Gómez', fechaApertura: '2024-06-01', area: 200, capacidad: 120, mesas: 30, horarioApertura: '09:00', horarioCierre: '23:00', empleados: 18, ventasMes: 62000000, ventasAnio: 434000000, ticketPromedio: 42000, rentabilidad: 22, observaciones: '' },
    { id: 'S003', nombre: 'Anthony Chef Cali', direccion: 'Av. 6N #12-34, Granada', ciudad: 'Cali', telefono: '300 555 6666', email: 'cali@anthonychef.com', estado: 'activo', gerente: 'Carlos López', fechaApertura: '2025-02-15', area: 180, capacidad: 100, mesas: 25, horarioApertura: '08:00', horarioCierre: '22:00', empleados: 15, ventasMes: 38000000, ventasAnio: 76000000, ticketPromedio: 32000, rentabilidad: 15, observaciones: '' },
    { id: 'S004', nombre: 'Anthony Chef Medellín', direccion: 'Calle 10 #43B-70, El Poblado', ciudad: 'Medellín', telefono: '300 777 8888', email: 'medellin@anthonychef.com', estado: 'mantenimiento', gerente: 'Ana Rodríguez', fechaApertura: '2024-09-01', area: 220, capacidad: 140, mesas: 35, horarioApertura: '08:00', horarioCierre: '23:00', empleados: 20, ventasMes: 0, ventasAnio: 450000000, ticketPromedio: 40000, rentabilidad: 20, observaciones: 'Remodelación en proceso' },
    { id: 'S005', nombre: 'Anthony Chef Barranquilla', direccion: 'Calle 72 #53-120, Norte', ciudad: 'Barranquilla', telefono: '300 999 0000', email: 'barranquilla@anthonychef.com', estado: 'inactivo', gerente: '', fechaApertura: '', area: 0, capacidad: 0, mesas: 0, horarioApertura: '', horarioCierre: '', empleados: 0, ventasMes: 0, ventasAnio: 0, ticketPromedio: 0, rentabilidad: 0, observaciones: 'En espera de apertura' }
];

/**
 * Datos mock de transferencias
 */
const transferenciasMock = [
    { id: 'T001', fecha: '2026-03-25', producto: 'Gaseosa 1.5L', cantidad: 20, origen: 'S001', origenNombre: 'Centro', destino: 'S002', destinoNombre: 'Norte', motivo: 'reabastecimiento', estado: 'completada', usuario: 'Juan Pérez' },
    { id: 'T002', fecha: '2026-03-26', producto: 'Carne Res kg', cantidad: 15, origen: 'S002', origenNombre: 'Norte', destino: 'S001', destinoNombre: 'Centro', motivo: 'distribucion', estado: 'completada', usuario: 'María Gómez' },
    { id: 'T003', fecha: '2026-03-27', producto: 'Pollo Entero', cantidad: 25, origen: 'S001', origenNombre: 'Centro', destino: 'S003', destinoNombre: 'Cali', motivo: 'urgencia', estado: 'en_transito', usuario: 'Carlos López' },
    { id: 'T004', fecha: '2026-03-28', producto: 'Caja Hamburguesa', cantidad: 50, origen: 'S002', origenNombre: 'Norte', destino: 'S001', destinoNombre: 'Centro', motivo: 'reabastecimiento', estado: 'pendiente', usuario: 'Ana Rodríguez' },
    { id: 'T005', fecha: '2026-03-28', producto: 'Aceite Vegetal 1L', cantidad: 10, origen: 'S001', origenNombre: 'Centro', destino: 'S002', destinoNombre: 'Norte', motivo: 'ajuste', estado: 'pendiente', usuario: 'Juan Pérez' }
];

/**
 * Obtiene sucursales desde localStorage
 */
function getSucursales() {
    const stored = localStorage.getItem('anthony_chef_sucursales');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_sucursales', JSON.stringify(sucursalesMock));
    return sucursalesMock;
}

/**
 * Guarda sucursales en localStorage
 */
function saveSucursalesToStorage(sucursales) {
    localStorage.setItem('anthony_chef_sucursales', JSON.stringify(sucursales));
}

/**
 * Obtiene transferencias desde localStorage
 */
function getTransferencias() {
    const stored = localStorage.getItem('anthony_chef_transferencias');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('anthony_chef_transferencias', JSON.stringify(transferenciasMock));
    return transferenciasMock;
}

/**
 * Obtiene badge de estado de sucursal
 */
function getSucursalEstadoBadge(estado) {
    const estados = {
        'activo': { label: 'Activo', class: 'status-active' },
        'inactivo': { label: 'Inactivo', class: 'status-inactive' },
        'mantenimiento': { label: 'Mantenimiento', class: 'status-warning' }
    };
    const est = estados[estado] || estados['activo'];
    return `<span class="sucursal-estado-badge">${est.label}</span>`;
}

/**
 * Renderiza grid de sucursales
 */
function renderSucursalesGrid(sucursales) {
    const grid = document.getElementById('sucursales-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (sucursales.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-store empty-icon"></i>
                <h3>No hay sucursales registradas</h3>
                <p>Crea tu primera sucursal para comenzar</p>
            </div>
        `;
        return;
    }

    // Encontrar la sucursal con mejor desempeño
    const activaSucursales = sucursales.filter(s => s.estado === 'activo');
    const mejorSucursal = activaSucursales.reduce((prev, current) => (prev.ventasMes > current.ventasMes) ? prev : current, activaSucursales[0]);

    sucursales.forEach(suc => {
        const div = document.createElement('div');
        div.className = 'sucursal-card';

        // Destacar la mejor sucursal
        if (mejorSucursal && suc.id === mejorSucursal.id) {
            div.classList.add('sucursal-destacada');
        }

        const headerClass = suc.estado === 'activo' ? '' : suc.estado;

        div.innerHTML = `
            <div class="sucursal-card-header ${headerClass}">
                <div class="sucursal-card-titulo">
                    <h3 class="sucursal-nombre">${suc.nombre}</h3>
                    ${getSucursalEstadoBadge(suc.estado)}
                </div>
                <div style="font-size: 0.8125rem; opacity: 0.9;">
                    <i class="fas fa-map-marker-alt"></i> ${suc.ciudad}
                </div>
            </div>
            <div class="sucursal-card-body">
                <div class="sucursal-info">
                    <div class="sucursal-info-row">
                        <i class="fas fa-map"></i>
                        <div>
                            <span class="sucursal-info-label">Dirección: </span>
                            <span class="sucursal-info-value">${suc.direccion}</span>
                        </div>
                    </div>
                    <div class="sucursal-info-row">
                        <i class="fas fa-phone"></i>
                        <div>
                            <span class="sucursal-info-label">Teléfono: </span>
                            <span class="sucursal-info-value">${suc.telefono}</span>
                        </div>
                    </div>
                    ${suc.gerente ? `
                    <div class="sucursal-info-row">
                        <i class="fas fa-user-tie"></i>
                        <div>
                            <span class="sucursal-info-label">Gerente: </span>
                            <span class="sucursal-info-value">${suc.gerente}</span>
                        </div>
                    </div>
                    ` : ''}
                    ${suc.estado === 'activo' ? `
                    <div class="sucursal-info-row">
                        <i class="fas fa-clock"></i>
                        <div>
                            <span class="sucursal-info-label">Horario: </span>
                            <span class="sucursal-info-value">${suc.horarioApertura} - ${suc.horarioCierre}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                ${suc.estado === 'activo' ? `
                <div class="sucursal-metricas">
                    <div class="sucursal-metrica">
                        <div class="sucursal-metrica-label">Ventas Mes</div>
                        <div class="sucursal-metrica-value">${formatCurrency(suc.ventasMes)}</div>
                    </div>
                    <div class="sucursal-metrica">
                        <div class="sucursal-metrica-label">Empleados</div>
                        <div class="sucursal-metrica-value">${suc.empleados}</div>
                    </div>
                </div>
                ` : ''}
                
                <div class="sucursal-card-footer">
                    <button class="btn btn-sm btn-outline" onclick="verDetalleSucursal('${suc.id}')">
                        <i class="fas fa-eye"></i>
                        Ver
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editarSucursal('${suc.id}')">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirModalConfirmarEliminar('sucursal', '${suc.id}', 'la sucursal ${suc.nombre}')">
                        <i class="fas fa-trash-alt"></i>
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

/**
 * Renderiza tabla de transferencias
 */
function renderTablaTransferencias(transferencias) {
    const tbody = document.getElementById('tabla-transferencias-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Actualizar badge de pendientes
    const pendientes = transferencias.filter(t => t.estado === 'pendiente').length;
    const badgeCount = document.getElementById('transferencias-pendientes-count');
    if (badgeCount) {
        badgeCount.textContent = pendientes;
        badgeCount.style.display = pendientes > 0 ? 'inline' : 'none';
    }

    transferencias.forEach(trans => {
        const tr = document.createElement('tr');
        const estadoClass = trans.estado === 'completada' ? 'badge-success' : trans.estado === 'pendiente' ? 'badge-warning' : trans.estado === 'en_transito' ? 'badge-info' : 'badge-danger';
        const estadoLabel = trans.estado === 'completada' ? 'Completada' : trans.estado === 'pendiente' ? 'Pendiente' : trans.estado === 'en_transito' ? 'En Tránsito' : 'Cancelada';

        tr.innerHTML = `
            <td><strong>${trans.id}</strong></td>
            <td>${new Date(trans.fecha).toLocaleDateString('es-CO')}</td>
            <td>${trans.producto}</td>
            <td><strong>${trans.cantidad}</strong></td>
            <td>${trans.origenNombre}</td>
            <td>${trans.destinoNombre}</td>
            <td><span class="badge-categoria ${estadoClass}">${estadoLabel}</span></td>
            <td>
                <button class="btn-icon" title="Ver" onclick="verDetalleTransferencia('${trans.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${trans.estado === 'pendiente' ? `
                <button class="btn-icon" title="Eliminar" onclick="abrirModalConfirmarEliminar('transferencia', '${trans.id}', 'la transferencia ${trans.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renderiza tabla consolidada
 */
function renderTablaConsolidado(sucursales) {
    const tbody = document.getElementById('tabla-consolidado-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const activas = sucursales.filter(s => s.estado === 'activo');

    activas.forEach(suc => {
        const tr = document.createElement('tr');
        const crecimientoClass = suc.ventasMes > 0 ? 'text-success' : 'text-danger';
        const crecimientoIcon = suc.ventasMes > 0 ? 'fa-arrow-up' : 'fa-arrow-down';

        tr.innerHTML = `
            <td><strong>${suc.nombre}</strong></td>
            <td>${formatCurrency(suc.ventasMes)}</td>
            <td>${formatCurrency(suc.ventasAnio)}</td>
            <td class="${crecimientoClass}"><i class="fas ${crecimientoIcon}"></i> ${suc.rentabilidad}%</td>
            <td>${suc.empleados}</td>
            <td>${formatCurrency(suc.ticketPromedio)}</td>
            <td>${suc.rentabilidad}%</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Actualiza KPIs de sucursales
 */
function updateSucursalesKPIs(sucursales) {
    const activas = sucursales.filter(s => s.estado === 'activo').length;
    const ventasTotales = sucursales.reduce((sum, s) => sum + s.ventasMes, 0);

    // Encontrar mejor sucursal
    const activaSucursales = sucursales.filter(s => s.estado === 'activo');
    const mejorSucursal = activaSucursales.reduce((prev, current) => (prev.ventasMes > current.ventasMes) ? prev : current, activaSucursales[0]);

    // Calcular crecimiento promedio (simulado)
    const crecimientoPromedio = activaSucursales.length > 0
        ? (activaSucursales.reduce((sum, s) => sum + s.rentabilidad, 0) / activaSucursales.length).toFixed(1)
        : 0;

    const kpiActivas = document.getElementById('kpi-sucursales-activas');
    const kpiVentas = document.getElementById('kpi-ventas-cadena');
    const kpiCrecimiento = document.getElementById('kpi-crecimiento');
    const kpiMejor = document.getElementById('kpi-mejor-sucursal');

    if (kpiActivas) kpiActivas.textContent = activas;
    if (kpiVentas) kpiVentas.textContent = formatCurrency(ventasTotales);
    if (kpiCrecimiento) kpiCrecimiento.textContent = `${crecimientoPromedio}%`;
    if (kpiMejor) kpiMejor.textContent = mejorSucursal ? mejorSucursal.nombre.split(' ')[2] || mejorSucursal.nombre : '-';
}

/**
 * Filtra sucursales
 */
function filtrarSucursales() {
    const busqueda = document.getElementById('filtro-busqueda-sucursal')?.value?.toLowerCase();
    const estado = document.getElementById('filtro-estado-sucursal')?.value;
    const ciudad = document.getElementById('filtro-ciudad-sucursal')?.value;

    let sucursales = getSucursales();

    if (busqueda) {
        sucursales = sucursales.filter(s =>
            s.nombre.toLowerCase().includes(busqueda) ||
            s.ciudad.toLowerCase().includes(busqueda)
        );
    }
    if (estado && estado !== 'all') {
        sucursales = sucursales.filter(s => s.estado === estado);
    }
    if (ciudad && ciudad !== 'all') {
        sucursales = sucursales.filter(s => s.ciudad === ciudad);
    }

    renderSucursalesGrid(sucursales);
    updateSucursalesKPIs(getSucursales());
}

/**
 * Abre modal de nueva sucursal
 */
function abrirModalSucursal() {
    const modal = document.getElementById('modal-sucursal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Resetear formulario
        document.getElementById('form-sucursal')?.reset();
        document.getElementById('modal-sucursal-titulo').textContent = 'Registrar Nueva Sucursal';
        document.getElementById('btn-sucursal-texto').textContent = 'Crear Sucursal';
    }
}

/**
 * Guarda nueva sucursal
 */
function guardarSucursal(event) {
    event.preventDefault();

    const nuevaSucursal = {
        id: 'S' + String(Date.now()).slice(-3),
        nombre: document.getElementById('sucursal-nombre').value,
        direccion: document.getElementById('sucursal-direccion').value,
        ciudad: document.getElementById('sucursal-ciudad').value,
        telefono: document.getElementById('sucursal-telefono').value,
        email: document.getElementById('sucursal-email').value || '',
        estado: document.getElementById('sucursal-estado').value,
        gerente: document.getElementById('sucursal-gerente').value || '',
        fechaApertura: new Date().toISOString().split('T')[0],
        area: parseInt(document.getElementById('sucursal-area').value) || 0,
        capacidad: parseInt(document.getElementById('sucursal-capacidad').value) || 0,
        mesas: parseInt(document.getElementById('sucursal-mesas').value) || 0,
        horarioApertura: document.getElementById('sucursal-apertura').value || '',
        horarioCierre: document.getElementById('sucursal-cierre').value || '',
        observaciones: document.getElementById('sucursal-observaciones').value || '',
        empleados: 0,
        ventasMes: 0,
        ventasAnio: 0,
        ticketPromedio: 0,
        rentabilidad: 0
    };

    const sucursales = getSucursales();
    sucursales.push(nuevaSucursal);
    saveSucursalesToStorage(sucursales);

    showToast('Sucursal creada correctamente', 'success');

    const modal = document.getElementById('modal-sucursal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-sucursal')?.reset();
    filtrarSucursales();
}

/**
 * Abre modal de transferencia
 */
function abrirModalTransferencia() {
    const modal = document.getElementById('modal-transferencia');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Cargar sucursales en los selects
        const sucursales = getSucursales().filter(s => s.estado === 'activo');
        const selectOrigen = document.getElementById('transferencia-origen');
        const selectDestino = document.getElementById('transferencia-destino');

        if (selectOrigen) {
            selectOrigen.innerHTML = '<option value="">Seleccionar...</option>';
            sucursales.forEach(s => {
                const option = document.createElement('option');
                option.value = s.id;
                option.textContent = s.nombre;
                selectOrigen.appendChild(option);
            });
        }

        if (selectDestino) {
            selectDestino.innerHTML = '<option value="">Seleccionar...</option>';
            sucursales.forEach(s => {
                const option = document.createElement('option');
                option.value = s.id;
                option.textContent = s.nombre;
                selectDestino.appendChild(option);
            });
        }
    }
}

/**
 * Guarda transferencia
 */
function guardarTransferencia(event) {
    event.preventDefault();

    const producto = document.getElementById('transferencia-producto')?.value;
    const origen = document.getElementById('transferencia-origen')?.value;
    const destino = document.getElementById('transferencia-destino')?.value;
    const cantidad = parseInt(document.getElementById('transferencia-cantidad')?.value);
    const motivo = document.getElementById('transferencia-motivo')?.value;
    const observaciones = document.getElementById('transferencia-observaciones')?.value || '';

    if (!producto || !origen || !destino || !cantidad || !motivo) {
        showToast('Complete todos los campos requeridos', 'error');
        return;
    }

    if (origen === destino) {
        showToast('Origen y destino deben ser diferentes', 'error');
        return;
    }

    const sucursales = getSucursales();
    const origenSuc = sucursales.find(s => s.id === origen);
    const destinoSuc = sucursales.find(s => s.id === destino);

    const transferencias = getTransferencias();
    const nuevaTransferencia = {
        id: 'T' + String(Date.now()).slice(-3),
        fecha: new Date().toISOString().split('T')[0],
        producto: producto,
        cantidad: cantidad,
        origen: origen,
        origenNombre: origenSuc?.nombre || '',
        destino: destino,
        destinoNombre: destinoSuc?.nombre || '',
        motivo: motivo,
        estado: 'pendiente',
        observaciones: observaciones,
        usuario: getCurrentUser()?.name || 'Owner'
    };

    transferencias.unshift(nuevaTransferencia);
    localStorage.setItem('anthony_chef_transferencias', JSON.stringify(transferencias));

    showToast('Transferencia creada exitosamente', 'success');

    const modal = document.getElementById('modal-transferencia');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('form-transferencia')?.reset();
    renderTablaTransferencias(transferencias);
}

/**
 * Inicializa tabs del módulo
 */
function initSucursalesTabs() {
    const tabBtns = document.querySelectorAll('.view-sucursales .module-tabs .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.view-sucursales .tab-content').forEach(c => c.classList.remove('active'));

            // Activar actual
            btn.classList.add('active');
            document.querySelector(`.view-sucursales .tab-content[data-content="${tab}"]`)?.classList.add('active');
        });
    });
}

/**
 * Inicializa listeners del módulo de sucursales
 */
function initSucursalesModule() {
    // Inicializar tabs
    initSucursalesTabs();

    // Botón Nueva Sucursal
    const btnNuevaSucursal = document.getElementById('btn-nueva-sucursal');
    if (btnNuevaSucursal) {
        btnNuevaSucursal.addEventListener('click', abrirModalSucursal);
    }

    // Botón Transferir Stock
    const btnTransferir = document.getElementById('btn-transferir-stock');
    if (btnTransferir) {
        btnTransferir.addEventListener('click', abrirModalTransferencia);
    }

    // Botón Nueva Transferencia
    const btnNuevaTransferencia = document.getElementById('btn-nueva-transferencia');
    if (btnNuevaTransferencia) {
        btnNuevaTransferencia.addEventListener('click', abrirModalTransferencia);
    }

    // Form Sucursal
    const formSucursal = document.getElementById('form-sucursal');
    if (formSucursal) {
        formSucursal.addEventListener('submit', guardarSucursal);
    }

    // Form Transferencia
    const formTransferencia = document.getElementById('form-transferencia');
    if (formTransferencia) {
        formTransferencia.addEventListener('submit', guardarTransferencia);
    }

    // Filtros
    const btnFiltrar = document.getElementById('btn-aplicar-filtros-sucursal');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarSucursales);
    }

    // Modales - Close
    ['modal-sucursal', 'modal-transferencia', 'modal-dashboard-sucursal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            const closeButtons = modal.querySelectorAll('[data-modal-close]');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Cargar datos iniciales
    filtrarSucursales();
    renderTablaTransferencias(getTransferencias());
    renderTablaConsolidado(getSucursales());
    updateSucursalesKPIs(getSucursales());
}

// Funciones globales para sucursales
window.editarSucursal = function (id) {
    showToast(`Editar sucursal ${id} - Próximamente`, 'info');
};

window.verDashboardSucursal = function (id) {
    showToast(`Ver dashboard de sucursal ${id} - Próximamente`, 'info');
};

window.verInventarioSucursal = function (id) {
    showToast(`Ver inventario de sucursal ${id} - Próximamente`, 'info');
};

window.aprobarTransferencia = function (id) {
    showToast(`Transferencia ${id} aprobada`, 'success');
};

window.cancelarTransferencia = function (id) {
    showToast(`Transferencia ${id} cancelada`, 'info');
};

window.verTransferencia = function (id) {
    showToast(`Ver transferencia ${id} - Próximamente`, 'info');
};

/**
 * Inicializa los event listeners de los modales
 */
function initModalListeners() {
    // Close buttons
    elements.modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(elements.modalPerfil);
            closeModal(elements.modalConfiguracion);
            closeModal(elements.modalSucursales);
        });
    });

    // Click outside modal
    if (elements.modalPerfil) {
        elements.modalPerfil.addEventListener('click', (event) => {
            if (event.target === elements.modalPerfil) {
                closeModal(elements.modalPerfil);
            }
        });
    }

    if (elements.modalConfiguracion) {
        elements.modalConfiguracion.addEventListener('click', (event) => {
            if (event.target === elements.modalConfiguracion) {
                closeModal(elements.modalConfiguracion);
            }
        });
    }

    if (elements.modalSucursales) {
        elements.modalSucursales.addEventListener('click', (event) => {
            if (event.target === elements.modalSucursales) {
                closeModal(elements.modalSucursales);
            }
        });
    }

    // Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal(elements.modalPerfil);
            closeModal(elements.modalConfiguracion);
            closeModal(elements.modalSucursales);
        }
    });

    // Profile form submit
    const profileForm = document.getElementById('profile-form');
    const btnSaveProfile = document.getElementById('btn-save-profile');

    if (profileForm && btnSaveProfile) {
        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Limpiar errores previos
            clearProfileErrors();

            // Validar campos
            const validation = validateProfileForm();

            if (!validation.isValid) {
                return;
            }

            // Obtener valores del formulario
            const name = document.getElementById('profile-name').value.trim();
            const email = document.getElementById('profile-email').value.trim();
            const phone = document.getElementById('profile-phone').value.trim();
            const newPassword = document.getElementById('profile-new-password').value;
            const confirmPassword = document.getElementById('profile-confirm-password').value;

            // Validar contraseñas
            if (newPassword && confirmPassword) {
                if (newPassword.length < 6) {
                    showProfileError('password', 'La contraseña debe tener al menos 6 caracteres');
                    return;
                }
                if (newPassword !== confirmPassword) {
                    showProfileError('password', 'Las contraseñas no coinciden');
                    return;
                }
            }

            // Simular guardado con feedback visual
            const originalText = btnSaveProfile.innerHTML;
            const originalDisabled = btnSaveProfile.disabled;

            btnSaveProfile.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            btnSaveProfile.disabled = true;

            setTimeout(() => {
                // Actualizar la UI con los nuevos datos
                updateProfileUI(name, email, phone);

                // Feedback de éxito
                btnSaveProfile.innerHTML = '<i class="fas fa-check"></i> ¡Guardado!';
                btnSaveProfile.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                setTimeout(() => {
                    btnSaveProfile.innerHTML = originalText;
                    btnSaveProfile.style.background = '';
                    btnSaveProfile.disabled = originalDisabled;

                    // Limpiar campos de contraseña
                    document.getElementById('profile-current-password').value = '';
                    document.getElementById('profile-new-password').value = '';
                    document.getElementById('profile-confirm-password').value = '';

                    closeModal(elements.modalPerfil);
                }, 1500);
            }, 800);

            console.log('Perfil actualizado:', { name, email, phone });
        });
    }

    // Inicializar listeners del modal de configuración
    initConfigModalListeners();
}

// ========================================
// ACCIONES UNIFICADAS (VER / ELIMINAR)
// ========================================

/**
 * Elemento pendiente de eliminación
 */
let elementoAEliminar = null;

/**
 * Abre modal de confirmación de eliminación
 */
function abrirModalConfirmarEliminar(tipo, id, nombre) {
    const modal = document.getElementById('modal-confirmar-eliminar');
    const mensaje = document.getElementById('confirmar-mensaje');

    if (modal && mensaje) {
        elementoAEliminar = { tipo, id, nombre };
        mensaje.textContent = `¿Estás seguro de eliminar ${nombre}? Esta acción no se puede deshacer.`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Confirma la eliminación
 */
function confirmarEliminar() {
    if (!elementoAEliminar) return;

    const { tipo, id, nombre } = elementoAEliminar;

    // Simular eliminación
    setTimeout(() => {
        // Cerrar modal
        const modal = document.getElementById('modal-confirmar-eliminar');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Mostrar toast de éxito
        showToast(`${nombre} eliminado correctamente`, 'success');

        elementoAEliminar = null;
    }, 300);
}

/**
 * Ver detalle de venta
 */
function verDetalleVenta(id) {
    const modal = document.getElementById('modal-detalle-venta');
    if (!modal) return;

    // Datos mock para ejemplo
    const venta = {
        id: id,
        fecha: '28/03/2026 10:30',
        estado: 'Completado',
        cliente: 'Juan Pérez',
        metodo: 'Tarjeta de Crédito',
        productos: [
            { nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 25000, subtotal: 50000 },
            { nombre: 'Gaseosa 1.5L', cantidad: 2, precio: 4000, subtotal: 8000 },
            { nombre: 'Papas Fritas', cantidad: 1, precio: 12000, subtotal: 12000 }
        ],
        subtotal: 70000,
        impuestos: 13300,
        total: 83300,
        observaciones: 'Cliente frecuente'
    };

    // Llenar datos
    document.getElementById('venta-id').textContent = `#${venta.id}`;
    document.getElementById('venta-fecha').textContent = venta.fecha;
    document.getElementById('venta-estado').textContent = venta.estado;
    document.getElementById('venta-estado').className = `detalle-badge badge-${venta.estado.toLowerCase() === 'completado' ? 'success' : 'warning'}`;
    document.getElementById('venta-cliente').textContent = venta.cliente;
    document.getElementById('venta-metodo').textContent = venta.metodo;
    document.getElementById('venta-subtotal').textContent = formatCurrency(venta.subtotal);
    document.getElementById('venta-impuestos').textContent = formatCurrency(venta.impuestos);
    document.getElementById('venta-total').innerHTML = `<strong>${formatCurrency(venta.total)}</strong>`;
    document.getElementById('venta-observaciones').textContent = venta.observaciones;

    // Llenar tabla de productos
    const tbody = document.getElementById('venta-productos-body');
    if (tbody) {
        tbody.innerHTML = venta.productos.map(p => `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>${formatCurrency(p.precio)}</td>
                <td>${formatCurrency(p.subtotal)}</td>
            </tr>
        `).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ver detalle de gasto
 */
function verDetalleGasto(id) {
    const modal = document.getElementById('modal-detalle-gasto');
    if (!modal) return;

    const gasto = {
        id: id,
        fecha: '28/03/2026',
        categoria: 'Proveedores',
        descripcion: 'Compra de insumos - Carne y pollo',
        monto: 450000,
        metodo: 'Transferencia Bancaria',
        proveedor: 'Cárnicos del Valle'
    };

    document.getElementById('gasto-id').textContent = `#${gasto.id}`;
    document.getElementById('gasto-fecha').textContent = gasto.fecha;
    document.getElementById('gasto-categoria').textContent = gasto.categoria;
    document.getElementById('gasto-categoria').className = `detalle-badge badge-${gasto.categoria.toLowerCase()}`;
    document.getElementById('gasto-descripcion').textContent = gasto.descripcion;
    document.getElementById('gasto-monto').textContent = formatCurrency(gasto.monto);
    document.getElementById('gasto-metodo').textContent = gasto.metodo;
    document.getElementById('gasto-proveedor').textContent = gasto.proveedor;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ver detalle de producto
 */
function verDetalleProducto(id) {
    const modal = document.getElementById('modal-detalle-producto');
    if (!modal) return;

    const productos = getProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    const estado = producto.stock <= producto.stockMinimo ? 'Crítico' : producto.stock <= producto.stockMinimo * 1.5 ? 'Bajo' : 'Óptimo';
    const estadoClass = producto.stock <= producto.stockMinimo ? 'badge-danger' : producto.stock <= producto.stockMinimo * 1.5 ? 'badge-warning' : 'badge-success';

    document.getElementById('producto-codigo').textContent = producto.codigo;
    document.getElementById('producto-categoria').textContent = producto.categoria;
    document.getElementById('producto-categoria').className = `detalle-badge badge-${producto.categoria}`;
    document.getElementById('producto-estado').textContent = estado;
    document.getElementById('producto-estado').className = `detalle-badge ${estadoClass}`;
    document.getElementById('producto-nombre').textContent = producto.nombre;
    document.getElementById('producto-unidad').textContent = producto.unidad;
    document.getElementById('producto-ubicacion').textContent = producto.ubicacion;
    document.getElementById('producto-stock').textContent = producto.stock;
    document.getElementById('producto-stock-minimo').textContent = producto.stockMinimo;
    document.getElementById('producto-costo').textContent = formatCurrency(producto.costo);
    document.getElementById('producto-venta').textContent = formatCurrency(producto.venta);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ver detalle de proveedor
 */
function verDetalleProveedor(id) {
    const modal = document.getElementById('modal-detalle-proveedor');
    if (!modal) return;

    const proveedor = {
        id: id,
        nombre: 'Cárnicos del Valle',
        contacto: 'María Gómez',
        telefono: '300 333 4444',
        email: 'ventas@caricos.com',
        direccion: 'Calle 45 #23-67, Bogotá',
        productos: 'Carnes, Pollos, Embutidos',
        tiempo: 'inmediato',
        calificacion: 5
    };

    document.getElementById('proveedor-id').textContent = `#${proveedor.id}`;
    document.getElementById('proveedor-nombre').textContent = proveedor.nombre;
    document.getElementById('proveedor-contacto').textContent = proveedor.contacto;
    document.getElementById('proveedor-telefono').textContent = proveedor.telefono;
    document.getElementById('proveedor-email').textContent = proveedor.email;
    document.getElementById('proveedor-direccion').textContent = proveedor.direccion;
    document.getElementById('proveedor-productos').textContent = proveedor.productos;
    document.getElementById('proveedor-tiempo').textContent = proveedor.tiempo;
    document.getElementById('proveedor-calificacion').textContent = '★'.repeat(proveedor.calificacion) + '☆'.repeat(5 - proveedor.calificacion);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ver detalle de empleado
 */
function verDetalleEmpleado(id) {
    const modal = document.getElementById('modal-detalle-empleado');
    if (!modal) return;

    const empleados = getEmpleados();
    const empleado = empleados.find(e => e.id === id);

    if (!empleado) return;

    document.getElementById('empleado-documento').textContent = empleado.documento;
    document.getElementById('empleado-cargo').textContent = nombresCargos[empleado.cargo] || empleado.cargo;
    document.getElementById('empleado-cargo').className = `detalle-badge badge-${empleado.cargo}`;
    document.getElementById('empleado-estado').textContent = empleado.estado;
    document.getElementById('empleado-estado').className = `detalle-badge badge-${empleado.estado}`;
    document.getElementById('empleado-nombre').textContent = empleado.nombre;
    document.getElementById('empleado-nacimiento').textContent = empleado.fechaNacimiento || '-';
    document.getElementById('empleado-genero').textContent = empleado.genero || '-';
    document.getElementById('empleado-ingreso').textContent = empleado.fechaIngreso;
    document.getElementById('empleado-salario').textContent = formatCurrency(empleado.salario);
    document.getElementById('empleado-sucursal').textContent = empleado.sucursal === '1' ? 'Centro' : 'Norte';
    document.getElementById('empleado-telefono').textContent = empleado.telefono;
    document.getElementById('empleado-email').textContent = empleado.email || '-';
    document.getElementById('empleado-direccion').textContent = empleado.direccion || '-';
    document.getElementById('empleado-emergencia').textContent = empleado.emergencia || '-';
    document.getElementById('empleado-banco').textContent = empleado.banco || '-';
    document.getElementById('empleado-cuenta').textContent = empleado.cuenta || '-';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ver detalle de sucursal
 */
function verDetalleSucursal(id) {
    const modal = document.getElementById('modal-detalle-sucursal');
    if (!modal) return;

    const sucursales = getSucursales();
    const sucursal = sucursales.find(s => s.id === id);

    if (!sucursal) return;

    document.getElementById('sucursal-ciudad').textContent = sucursal.ciudad;
    document.getElementById('sucursal-estado').textContent = sucursal.estado;
    document.getElementById('sucursal-estado').className = `detalle-badge status-${sucursal.estado}`;
    document.getElementById('sucursal-nombre').textContent = sucursal.nombre;
    document.getElementById('sucursal-direccion').textContent = sucursal.direccion;
    document.getElementById('sucursal-gerente').textContent = sucursal.gerente || 'No asignado';
    document.getElementById('sucursal-apertura').textContent = sucursal.fechaApertura ? new Date(sucursal.fechaApertura).toLocaleDateString('es-CO') : '-';
    document.getElementById('sucursal-telefono').textContent = sucursal.telefono;
    document.getElementById('sucursal-email').textContent = sucursal.email || '-';
    document.getElementById('sucursal-horario').textContent = `${sucursal.horarioApertura || '--:--'} - ${sucursal.horarioCierre || '--:--'}`;
    document.getElementById('sucursal-empleados').textContent = sucursal.empleados;
    document.getElementById('sucursal-capacidad').textContent = sucursal.capacidad;
    document.getElementById('sucursal-area').textContent = `${sucursal.area} m²`;
    document.getElementById('sucursal-mesas').textContent = sucursal.mesas;
    document.getElementById('sucursal-observaciones').textContent = sucursal.observaciones || 'Sin observaciones';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Ver detalle de transferencia
 */
function verDetalleTransferencia(id) {
    const modal = document.getElementById('modal-detalle-transferencia');
    if (!modal) return;

    const transferencias = getTransferencias();
    const transferencia = transferencias.find(t => t.id === id);

    if (!transferencia) return;

    const estadoClass = transferencia.estado === 'completada' ? 'badge-success' : transferencia.estado === 'pendiente' ? 'badge-warning' : transferencia.estado === 'en_transito' ? 'badge-info' : 'badge-danger';
    const estadoLabel = transferencia.estado === 'completada' ? 'Completada' : transferencia.estado === 'pendiente' ? 'Pendiente' : transferencia.estado === 'en_transito' ? 'En Tránsito' : 'Cancelada';

    document.getElementById('transferencia-id').textContent = `#${transferencia.id}`;
    document.getElementById('transferencia-fecha').textContent = new Date(transferencia.fecha).toLocaleDateString('es-CO');
    document.getElementById('transferencia-estado').textContent = estadoLabel;
    document.getElementById('transferencia-estado').className = `detalle-badge ${estadoClass}`;
    document.getElementById('transferencia-producto').textContent = transferencia.producto;
    document.getElementById('transferencia-cantidad').textContent = transferencia.cantidad;
    document.getElementById('transferencia-origen').textContent = transferencia.origenNombre;
    document.getElementById('transferencia-destino').textContent = transferencia.destinoNombre;
    document.getElementById('transferencia-motivo').textContent = transferencia.motivo;
    document.getElementById('transferencia-usuario').textContent = transferencia.usuario;
    document.getElementById('transferencia-observaciones').textContent = transferencia.observaciones || '-';

    // Mostrar/ocultar botones según estado
    const btnAprobar = document.getElementById('btn-aprobar-transferencia-detalle');
    const btnCancelar = document.getElementById('btn-cancelar-transferencia-detalle');

    if (btnAprobar && btnCancelar) {
        if (transferencia.estado === 'pendiente') {
            btnAprobar.style.display = 'inline-flex';
            btnCancelar.style.display = 'inline-flex';
        } else {
            btnAprobar.style.display = 'none';
            btnCancelar.style.display = 'none';
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Funciones placeholder para acciones desde detalle
 */
window.imprimirVenta = function () {
    showToast('Función de impresión próximamente', 'info');
};

window.editarProductoDesdeDetalle = function () {
    showToast('Editar producto próximamente', 'info');
};

window.contactarProveedorDesdeDetalle = function () {
    showToast('Contactar proveedor próximamente', 'info');
};

window.editarProveedorDesdeDetalle = function () {
    showToast('Editar proveedor próximamente', 'info');
};

window.editarEmpleadoDesdeDetalle = function () {
    showToast('Editar empleado próximamente', 'info');
};

window.verDashboardSucursalDesdeDetalle = function () {
    showToast('Ver dashboard próximamente', 'info');
};

window.editarSucursalDesdeDetalle = function () {
    showToast('Editar sucursal próximamente', 'info');
};

/**
 * Inicializa listeners de modales de detalle y eliminación
 */
function initAccionesUnificadas() {
    // Listener para confirmar eliminación
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', confirmarEliminar);
    }

    // Listeners para modales de detalle - close buttons
    ['modal-detalle-venta', 'modal-detalle-gasto', 'modal-detalle-producto',
        'modal-detalle-proveedor', 'modal-detalle-empleado', 'modal-detalle-sucursal',
        'modal-detalle-transferencia', 'modal-confirmar-eliminar'].forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                const closeButtons = modal.querySelectorAll('[data-modal-close]');
                closeButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });

                modal.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        });

    // Escape key para cerrar modales
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            ['modal-detalle-venta', 'modal-detalle-gasto', 'modal-detalle-producto',
                'modal-detalle-proveedor', 'modal-detalle-empleado', 'modal-detalle-sucursal',
                'modal-detalle-transferencia', 'modal-confirmar-eliminar'].forEach(modalId => {
                    const modal = document.getElementById(modalId);
                    if (modal && modal.classList.contains('active')) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
        }
    });
}

// Inicializar acciones unificadas cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccionesUnificadas);
} else {
    initAccionesUnificadas();
}

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicializa el dashboard
 */
function init() {
    console.log('Inicializando dashboard...');

    // Verificar sesión
    if (!checkSession()) {
        return;
    }

    // Cargar configuración guardada
    loadSavedConfig();

    // Actualizar UI de usuario
    updateUserUI();

    // Actualizar UI según rol
    updateUIByRole();

    // Inicializar listeners
    initSidebarListeners();
    initUserDropdownListeners();
    initLogoutListeners();
    initNavigationListeners();
    initBranchSelectorListeners();
    initModalListeners();

    // Inicializar módulo de gastos
    initGastosModule();

    // Inicializar módulo de inventario
    initInventarioModule();

    // Inicializar módulo de empleados
    initEmpleadosModule();

    // Inicializar módulo de sucursales
    initSucursalesModule();

    console.log('Dashboard inicializado correctamente');
    console.log('Usuario:', getCurrentUser());
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
