# Proyectos de la Plataforma de Ofertas

## 1. Proyecto Empresa (Administración Central) https://rodrigovidalg.github.io/fase_1_proyecto_administrativo/

**Qué hace:**
- Control total del sistema.
- Gestión de supermercados (crear, editar, eliminar).
- Gestión de usuarios y roles (crear invitaciones, asignar roles).
- Supervisión general y reportes.

**Quién lo usa:**
- Personal de la empresa que administra la plataforma.

**Tecnología:**
- Panel administrativo con acceso completo y funciones avanzadas.

## 2. Proyecto Supermercado (Panel de Gerentes/Encargados) https://rodrigovidalg.github.io/fase_2_proyecto_supermercado/

**Qué hace:**
- Permite a los gerentes de supermercados agregar, editar y eliminar sus ofertas.
- Acceso controlado mediante autenticación y roles (editor).
- Solo puede gestionar las ofertas de su supermercado (filtrado por `supermercadoId`).

**Quién lo usa:**
- Gerentes o encargados del supermercado.

**Tecnología:**
- Panel web privado con autenticación y permisos limitados.

---

## 3. Proyecto Usuario Final https://rodrigovidalg.github.io/fase_3_proyecto_usuario_final/

**Qué hace:**
- Muestra el carrusel, ofertas activas, búsqueda, carrito, perfil, etc.
- Solo lectura de datos (ofertas, supermercados, banners).

**Quién lo usa:**
- Clientes/consumidores finales que buscan ofertas.

**Tecnología:**
- Frontend web o app móvil conectada a Firestore (solo lectura).

---

