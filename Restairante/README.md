# 📌 Proyecto: Anthony Chef - Sistema de Gestión Multi-Sucursal

## 📖 Descripción

Crear una aplicación con:
- Login (Dueño y Administradores)
- Dashboard para dueño (control total)
- Dashboard para administradores (por sucursal)
- Módulos: Ventas, Gastos, Inventario, Empleados
- Control multi-sucursal
- Sistema de roles y permisos

**Tecnologías:** HTML, CSS y JavaScript moderno (ES6+)  
**Arquitectura:** Modular, escalable, sin frameworks  
**Enfoque:** Simplicidad + Profesionalismo

---

## 🚀 Fase 1: Login

### 🎯 Objetivo
Implementar autenticación básica segura

### 📋 Qué se va a hacer
- `index.html` con formulario de login
- `auth.js` para validación de credenciales
- `storage.js` para persistencia de sesión
- Redirección según rol

### 📦 Entregables
- Login funcional con datos hardcodeados
- Sesión persiste en LocalStorage
- Redirección básica a dashboard.html

### 🚀 Estado
✅ **Completado**

### 🧠 Notas
- Ninguna dependencia (fase inicial)

---

## 🚀 Fase 2: Estructura Base del Dashboard

### 🎯 Objetivo
Crear layout principal reutilizable

### 📋 Qué se va a hacer
- `app.html` con sidebar y header
- CSS modular (sidebar, header, content area)
- Sistema de navegación entre módulos
- Componentes base (cards, tablas, botones)

### 📦 Entregables
- Layout responsive
- Navegación funcional
- Estilos consistentes

### 🚀 Estado
✅ **Completado**

### 🧠 Notas
- Depende de Fase 1 (login debe existir)
- Archivos creados: `app.html`, `dashboard.css`, `dashboard.js`

---

## 🚀 Fase 3: Sistema de Roles

### 🎯 Objetivo
Implementar lógica de permisos y roles

### 📋 Qué se va a hacer
- `User.js` modelo con roles
- `AuthService.js` con validación de permisos
- Middleware de protección de rutas
- UI condicional según rol

### 📦 Entregables
- Owner y Admin diferenciados
- Rutas protegidas
- Session validation

### 🚀 Estado
⏳ **Pendiente**

### 🧠 Notas
- Depende de Fases 1 y 2

---

## 🚀 Fase 4: Sucursales

### 🎯 Objetivo
Implementar gestión multi-sucursal

### 📋 Qué se va a hacer
- `Branch.js` modelo
- `BranchService.js` CRUD
- Selector de sucursales (Owner)
- `branch_id` en todas las entidades

### 📦 Entregables
- CRUD sucursales funcional
- Datos aislados por sucursal
- Owner puede cambiar entre sucursales

### 🚀 Estado
⏳ **Pendiente**

### 🧠 Notas
- Depende de Fases 1, 2 y 3

---

## 🚀 Fase 5: Administradores

### 🎯 Objetivo
Permitir creación y asignación de admins

### 📋 Qué se va a hacer
- CRUD de administradores
- Asignación de admin a sucursal
- Validación: 1 admin por sucursal (configurable)
- UI solo para Owner

### 📦 Entregables
- Owner crea admins
- Admin asignado a sucursal específica
- Admin solo ve su sucursal

### 🚀 Estado
⏳ **Pendiente**

### 🧠 Notas
- Depende de Fases 1, 2, 3 y 4

---

## 🚀 Fase 6: Dashboard Dueño

### 🎯 Objetivo
Vista consolidada para el dueño

### 📋 Qué se va a hacer
- KPIs de todas las sucursales
- Gráficos/resúmenes consolidados
- Selector de sucursal para drill-down
- Acceso completo a todos los módulos

### 📦 Entregables
- Vista multi-sucursal
- Reports consolidados
- Navegación completa

### 🚀 Estado
 **Pendiente**

### 🧠 Notas
- Depende de Fases 1-5

---

## 🚀 Fase 7: Dashboard Admin

### 🎯 Objetivo
Vista restringida para administrador

### 📋 Qué se va a hacer
- KPIs de sucursal asignada
- Datos filtrados por `branch_id`
- Acceso a módulos (solo su sucursal)
- UI simplificada

### 📦 Entregables
- Single-branch scope
- Mismos módulos, datos filtrados
- No acceso a configuración de sucursales/admins

### 🚀 Estado
⏳ **Pendiente**

### 🧠 Notas
- Depende de Fases 1-5

---

## 🚀 Fase 8: Módulos Funcionales

### 🎯 Objetivo
Implementar CRUD completo de cada módulo

### 📋 Qué se va a hacer
- **Ventas:** Registro, listado, reportes
- **Gastos:** Registro, categorías, reportes
- **Inventario:** Productos, stock, alertas
- **Empleados:** CRUD, roles, estados

### 📦 Entregables
- CRUD completo por módulo
- Datos persisten en LocalStorage
- Filtro por sucursal aplicado
- Validaciones y errores manejados

### 🚀 Estado
⏳ **Pendiente**

### 🧠 Notas
- Depende de Fases 1-7

---

## 📊 Control de Avance

| Fase | Nombre | Estado |
|------|--------|--------|
| 1 | Login | ✅ Completado |
| 2 | Estructura base del dashboard | ✅ Completado |
| 3 | Sistema de roles | ⏳ Pendiente |
| 4 | Sucursales | ⏳ Pendiente |
| 5 | Administradores | ⏳ Pendiente |
| 6 | Dashboard dueño | ⏳ Pendiente |
| 7 | Dashboard admin | ⏳ Pendiente |
| 8 | Módulos funcionales | ⏳ Pendiente |

---

## 📋 Orden Recomendado de Desarrollo

```
1. ✅ Fase 1: Login (foundation)
2. ✅ Fase 2: Dashboard structure (layout)
3. ⏳ Fase 3: Roles (security)
4. ⏳ Fase 4: Branches (multi-tenant core)
5. ⏳ Fase 5: Admins (user management)
6. ⏳ Fase 6: Owner Dashboard (primary view)
7. ⏳ Fase 7: Admin Dashboard (secondary view)
8. ⏳ Fase 8: Modules (business logic)
   - 8.1: Inventory (needed for sales)
   - 8.2: Sales (core business)
   - 8.3: Expenses (financial tracking)
   - 8.4: Employees (HR management)
```

---

## 🛠️ Convenciones del Proyecto

### Estructura de Carpetas
```
/
├── index.html
├── app.html
├── assets/
│   ├── css/
│   │   ├── login.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── login.js
│   │   └── dashboard.js
│   └── logo.png
```

### LocalStorage Keys
- `anthony_chef_current_user` - Sesión actual
- `anthony_chef_users` - Colección de usuarios
- `anthony_chef_branches` - Colección de sucursales
- `anthony_chef_sales` - Colección de ventas
- `anthony_chef_expenses` - Colección de gastos
- `anthony_chef_products` - Colección de productos
- `anthony_chef_employees` - Colección de empleados

---

👉 **¿Deseas que trabajemos en la Fase 2 (Estructura Base del Dashboard) o quieres ajustar algo del documento?**
