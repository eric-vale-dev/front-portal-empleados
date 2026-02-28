# 💻 Frontend Angular - Portal de Empleados

**Descripción del Proyecto**
Este repositorio contiene el Frontend de una Single Page Application (SPA) desarrollada con **Angular 19**. Forma parte de un sistema integral de gestión de empleados, diseñado para consumir una API RESTful construida en PHP y MySQL.

El proyecto destaca por utilizar las características más modernas del framework, prescindiendo de módulos tradicionales (`app.module.ts`) en favor de **Componentes Standalone**, manejo de estado reactivo con **Signals** y la nueva sintaxis de control de flujo (`@for`, `@if`).

## 🚀 Tecnologías Utilizadas

* **Framework:** Angular 19
* **Lenguaje:** TypeScript
* **Estilos:** Bootstrap 5 (CSS)
* **Gráficas:** Chart.js
* **Exportación de Datos:** SheetJS (`xlsx`) y jsPDF (`jspdf`, `jspdf-autotable`)
* **Arquitectura:** Componentes Standalone y Servicios Inyectables (`inject()`)

##  Características Principales

1. **Dashboard Interactivo:** Panel principal con KPIs (métricas clave) y una gráfica de pastel renderizada en tiempo real con Chart.js, alimentada por datos estadísticos del backend.
2. **Gestión de Empleados (CRUD):** Interfaz para listar, agregar, editar y dar de baja (lógica) a los empleados del sistema.
3. **Formularios Dinámicos:** Menús desplegables (`<select>`) alimentados directamente desde la base de datos (Catálogos de Departamentos y Puestos).
4. **Generación de Reportes:** Funcionalidad nativa en el navegador para exportar la tabla de empleados a formatos **Excel (.xlsx)** y **PDF** con un solo clic.
5. **Enrutamiento (Router):** Navegación fluida entre pantallas (Dashboard, Lista, Formulario) sin recargar la página.

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
* **Node.js** (v18 o superior recomendado)
* **Angular CLI** (`npm install -g @angular/cli`)

## Desarrollado por Eric Valera
