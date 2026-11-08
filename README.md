# Kanjealo V5 — Pase turístico de beneficios (Versión JavaScript / Live Server)

Kanjealo es un pase turístico de beneficios para disfrutar Uruguay.
Esta versión ha sido migrada a **HTML5, CSS y JavaScript Vanilla**, permitiendo ejecutar la aplicación directamente en **Live Server (`http://127.0.0.1:5500/`)** o mediante **Node.js**, sin requerir la ejecución de Python.

---

## 🚀 Cómo ejecutar el proyecto

### Opción 1: Con la extensión Live Server de VS Code (Recomendado)
1. Abrí esta carpeta (`kanjealo_v5`) en **Visual Studio Code**.
2. Hacé clic derecho sobre el archivo [`index.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/index.html) y seleccioná **"Open with Live Server"** (o hacé clic en "Go Live" en la barra inferior).
3. Tu navegador se abrirá automáticamente en:
   **`http://127.0.0.1:5500/`** (o `http://127.0.0.1:5500/index.html`).

### Opción 2: Con Node.js
Si deseás levantarlo con un servidor local de Node.js:
```bash
npm start
```
Se iniciará en `http://127.0.0.1:5500/`.

---

## 🔑 Panel de Administración
- Acceso: [`admin-login.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/admin-login.html) o enlace **"Comercios / Admin"** en el pie de página.
- **Usuario:** `admin`
- **Contraseña inicial:** `admin123`

---

## ⚙️ Arquitectura Técnica en JavaScript Vanilla

1. **Estado y persistencia (`static/kanjealo.js`)**:
   - Administra el almacenamiento local (`localStorage`) para cupones, pases turísticos activos, canjes y credenciales de administración.
   - Siembra datos demo iniciales automáticamente en la primera carga (La Trattoria, Cambios del Sur, Rentacar Colonia).
   - Control de expiración en tiempo real (pases de 24h y 48h).
2. **Generación de códigos QR (`static/qrcode.js`)**:
   - Generación dinámica de QR en formato SVG vectorial sin dependencias externas ni llamadas a CDNs.
   - Enlace automático al escáner de validación (`canje.html?token=KC-XXXX`).
3. **Páginas del sistema**:
   - [`index.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/index.html): Portada con catálogo de cupones filtrables por categoría y cálculo de ahorro.
   - [`comprar.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/comprar.html): Selección y activación de planes 24h (US$3) y 48h (US$5).
   - [`pase.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/pase.html): Ticket del pase activo con código y fecha de vigencia.
   - [`cupon.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/cupon.html): Ficha de detalle del comercio, condiciones, WhatsApp, mapa y generación de canje.
   - [`canje-generado.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/canje-generado.html): Ticket con código único y código QR dinámico para presentar en el establecimiento.
   - [`mi-kanjealo.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/mi-kanjealo.html): Gestión del pase activo del turista e historial de canjes emitidos y utilizados.
   - [`canje.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/canje.html): Validación pública para lectura de QR por el comercio.
   - [`admin.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/admin.html): Dashboard con métricas clave y tabla de administración de beneficios.
   - [`admin-cupon.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/admin-cupon.html): Formulario completo para crear y editar beneficios.
   - [`admin-validar.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/admin-validar.html): Módulo para validar códigos de canje en el local comercial.
   - [`admin-clave.html`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/admin-clave.html): Cambio de clave de administración.

---

## 📌 Estado de `app.py`
El archivo [`app.py`](file:///d:/Programacion/Dise%C3%B1oWeb/Kanjealo/kanjealo_v5/app.py) ha sido desactivado temporalmente según solicitado. Toda la lógica comercial, validación, almacenamiento y flujo de usuario ahora corren fluidamente en JavaScript Vanilla.
