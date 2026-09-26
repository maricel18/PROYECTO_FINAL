# EcoWash — Sistema de Gestión y Control de Recursos

Proyecto desarrollado para la materia **Programación Web II** (Facultad de Ingeniería, Universidad Privada Domingo Savio).

---

### Integrantes del Equipo
* Maricel Cespedes Rojas


**Docente:** Ing. Paul Mauricio Melgar Zabala  
**Fecha:** Septiembre de 2026  
**Ubicación:** Santa Cruz de la Sierra, Bolivia  

---

Este repositorio contiene la interfaz cliente (Frontend) para la administración y catalogación de maquinaria de la lavandería autoservicio. 

El objetivo principal es llevar un control riguroso de cada lavadora y secadora del local antes de habilitar los ciclos de lavado, registrando sus especificaciones técnicas de consumo para cruzar luego estos datos con las lecturas físicas de los medidores (SAGUAPAC y CRE) y detectar posibles fugas o sobrecostos.

### Funcionalidades implementadas:
* **Alta de Maquinaria:** Registro de lavadoras y secadoras con marca, modelo, capacidad en kg y código identificador de local (ej. `LAV-01`, `SEC-02`).
* **Ficha Técnica de Consumo Base:** Parámetros de gasto proyectado en litros de agua por ciclo y kilovatios-hora (kWh) según el tipo de equipo.
* **Control de Disponibilidad:** Cambio en tiempo real del estado de cada máquina (`Disponible`, `En Ciclo`, `En Mantenimiento` o `Fuera de Servicio`).
* **Validación de Identificador Único:** Control en el formulario que impide registrar códigos repetidos para evitar conflictos de asignación en caja.
* **Diseño Ejecutivo:** Interfaz limpia construida con Bootstrap 5 en paleta sobria (negro/gris), adaptable a computadoras de caja y pantallas móviles.

---

## Organización del código

```text
src/
|--components/
│   |-- Encabezado.jsx          # Título y subtítulo parametrizables por props
│   |-- FormularioMaquina.jsx   # Formulario controlado con validaciones y alertas
│   |-- Maquina.jsx             # Tarjeta de presentación técnica y selector de estado
|-- App.jsx                     # Manejo centralizado del estado del catálogo
|-- main.jsx                    # Configuración inicial e importación de Bootstrap