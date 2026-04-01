/**
 * ============================================================
 * ANTHONY CHEF — LOGIN MODULE (UNIFICADO)
 * Maneja autenticación para:
 *   1. Dueño / Administrador General  → admin/dashboard.html
 *   2. Encargado de Sucursal          → sucursal/pos.html
 * ============================================================
 */

// ── RUTAS DE DESTINO ────────────────────────────────────────
const REDIRECT_OWNER = 'admin/dashboard.html';
const REDIRECT_SUCURSAL = 'sucursal/pos.html';

// ── ESTADO ──────────────────────────────────────────────────
let activeTab = 'owner'; // 'owner' | 'sucursal'

// ── UTILIDADES ──────────────────────────────────────────────
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showMessage(text, type = 'info') {
    const el = document.getElementById('login-message');
    const iconMap = {
        info: 'fa-circle-notch fa-spin',
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle'
    };
    el.innerHTML = `
        <span class="message-icon"><i class="fas ${iconMap[type] || iconMap.info}"></i></span>
        <span class="message-text">${text}</span>`;
    el.className = `login-message show ${type}`;
}

function hideMessage() {
    document.getElementById('login-message').className = 'login-message';
}

function setFieldError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (err) err.textContent = msg;
}

function clearFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (err) err.textContent = '';
}

function clearAllErrors() {
    ['owner-phone', 'owner-password', 'suc-usuario', 'suc-password'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('error');
    });
    ['owner-phone-error', 'owner-password-error', 'suc-usuario-error', 'suc-password-error'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
}

function showLoadingOverlay(msg = 'Autenticando...') {
    const el = document.getElementById('loading-text');
    if (el) el.textContent = msg;
    document.getElementById('loading-overlay')?.classList.add('active');
}

// ── TABS ─────────────────────────────────────────────────────
function initTabs() {
    const tabOwner = document.getElementById('tab-owner');
    const tabSuc = document.getElementById('tab-sucursal');
    const formOwner = document.getElementById('owner-form');
    const formSuc = document.getElementById('sucursal-form');

    function activateTab(tab) {
        activeTab = tab;
        clearAllErrors();
        hideMessage();

        // Toggle tab buttons
        tabOwner.classList.toggle('active', tab === 'owner');
        tabSuc.classList.toggle('active', tab === 'sucursal');

        // Toggle forms
        formOwner.classList.toggle('active', tab === 'owner');
        formSuc.classList.toggle('active', tab === 'sucursal');

        // Focus first input
        const focusId = tab === 'owner' ? 'owner-phone' : 'suc-usuario';
        setTimeout(() => document.getElementById(focusId)?.focus(), 120);
    }

    tabOwner.addEventListener('click', () => activateTab('owner'));
    tabSuc.addEventListener('click', () => activateTab('sucursal'));

    // Check if already has a branch session → auto-switch
    if (SucursalAuth.isAuthenticated()) {
        window.location.href = REDIRECT_SUCURSAL;
    }
    // Check if already has an admin session → auto-switch
    if (AuthService.isAuthenticated()) {
        window.location.href = REDIRECT_OWNER;
    }
}

// ── PASSWORD TOGGLE ──────────────────────────────────────────
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            const icon = btn.querySelector('i');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
                btn.classList.add('active');
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
                btn.classList.remove('active');
            }
        });
    });
}

// ── LIVE INPUT CLEAR ERRORS ──────────────────────────────────
function initInputListeners() {
    const pairs = [
        ['owner-phone', 'owner-phone-error'],
        ['owner-password', 'owner-password-error'],
        ['suc-usuario', 'suc-usuario-error'],
        ['suc-password', 'suc-password-error']
    ];
    pairs.forEach(([inputId, errId]) => {
        document.getElementById(inputId)?.addEventListener('input', () => {
            clearFieldError(inputId, errId);
            hideMessage();
        });
    });
}

// ── AUTH: DUEÑO / ADMINISTRADOR GENERAL ─────────────────────
async function handleOwnerSubmit(e) {
    e.preventDefault();
    clearAllErrors();

    const celular = document.getElementById('owner-phone').value.trim();
    const password = document.getElementById('owner-password').value;
    let valid = true;

    if (!celular) {
        setFieldError('owner-phone', 'owner-phone-error', 'El número de celular es requerido');
        valid = false;
    } else if (celular.replace(/\D/g, '').length < 10) {
        setFieldError('owner-phone', 'owner-phone-error', 'El celular debe tener mínimo 10 dígitos');
        valid = false;
    }
    if (!password) {
        setFieldError('owner-password', 'owner-password-error', 'La contraseña es requerida');
        valid = false;
    }
    if (!valid) return;

    const btn = document.getElementById('owner-submit');
    btn.disabled = true;
    btn.classList.add('is-loading');
    showMessage('Verificando credenciales...', 'info');

    await delay(800);

    const usuario = AuthService.login(celular, password);

    if (!usuario || usuario.rol !== 'dueño') {
        showMessage('Credenciales incorrectas. Verifica tu celular y contraseña.', 'error');
        document.getElementById('owner-password').classList.add('error');
        btn.disabled = false;
        btn.classList.remove('is-loading');
        return;
    }

    AuthService.guardarSesion(usuario);
    await startSuccessAnimation('¡Acceso concedido! Bienvenido/a', 'Cargando panel ejecutivo...');
    window.location.href = REDIRECT_OWNER;
}

// ── AUTH: ENCARGADO DE SUCURSAL ──────────────────────────────
async function handleSucursalSubmit(e) {
    e.preventDefault();
    clearAllErrors();

    const usuario = document.getElementById('suc-usuario').value.trim();
    const password = document.getElementById('suc-password').value;
    let valid = true;

    if (!usuario) {
        setFieldError('suc-usuario', 'suc-usuario-error', 'El usuario de sucursal es requerido');
        valid = false;
    }
    if (!password) {
        setFieldError('suc-password', 'suc-password-error', 'La contraseña es requerida');
        valid = false;
    }
    if (!valid) return;

    const btn = document.getElementById('suc-submit');
    btn.disabled = true;
    btn.classList.add('is-loading');
    showMessage('Verificando credenciales...', 'info');

    await delay(800);

    const session = SucursalAuth.login(usuario, password);

    if (!session) {
        showMessage('Usuario o contraseña incorrectos. Verifica tus credenciales.', 'error');
        document.getElementById('suc-password').classList.add('error');
        btn.disabled = false;
        btn.classList.remove('is-loading');
        return;
    }

    await startSuccessAnimation(`¡Bienvenido/a! Accediendo a ${session.nombre}`, `Abriendo panel de ${session.nombre}...`);
    window.location.href = REDIRECT_SUCURSAL;
}

// ── ANIMATION SEQUENCES ──────────────────────────────────────
async function startSuccessAnimation(message, overlayMsg) {
    const wrapper = document.querySelector('.login-wrapper');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // 1. Show success message in form
    showMessage(message, 'success');
    
    // 2. Short wait to "digest" success
    await delay(500);
    
    // 3. Trigger cinematic hero transition
    wrapper.classList.add('auth-success');
    
    // 4. Wait for hero zoom to be noticeable
    await delay(1000);
    
    // 5. Fade in the final loading overlay
    showLoadingOverlay(overlayMsg);
    
    // 6. Final dramatic pause
    await delay(800);
    
    // 7. Last exit fade
    wrapper.classList.add('exit-page');
    await delay(400);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initPasswordToggles();
    initInputListeners();

    document.getElementById('owner-form').addEventListener('submit', handleOwnerSubmit);
    document.getElementById('sucursal-form').addEventListener('submit', handleSucursalSubmit);

    // Focus first input
    setTimeout(() => document.getElementById('owner-phone')?.focus(), 300);

    console.log('[AnthonyChef] Login unificado — v2.0');
});
