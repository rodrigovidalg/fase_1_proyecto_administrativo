# Proyectos de la Plataforma de Ofertas

## 1. Proyecto Usuario Final

**Qué hace:**
- Muestra el carrusel, ofertas activas, búsqueda, carrito, perfil, etc.
- Solo lectura de datos (ofertas, supermercados, banners).

**Quién lo usa:**
- Clientes/consumidores finales que buscan ofertas.

**Tecnología:**
- Frontend web o app móvil conectada a Firestore (solo lectura).

---

## 2. Proyecto Supermercado (Panel de Gerentes/Encargados)

**Qué hace:**
- Permite a los gerentes de supermercados agregar, editar y eliminar sus ofertas.
- Acceso controlado mediante autenticación y roles (editor).
- Solo puede gestionar las ofertas de su supermercado (filtrado por `supermercadoId`).

**Quién lo usa:**
- Gerentes o encargados del supermercado.

**Tecnología:**
- Panel web privado con autenticación y permisos limitados.

---

## 3. Proyecto Empresa (Administración Central)

**Qué hace:**
- Control total del sistema.
- Gestión de supermercados (crear, editar, eliminar).
- Gestión de usuarios y roles (crear invitaciones, asignar roles).
- Supervisión general y reportes.

**Quién lo usa:**
- Personal de la empresa que administra la plataforma.

**Tecnología:**
- Panel administrativo con acceso completo y funciones avanzadas.
