# Modelo Híbrido: Scrum + Espiral + Kanban  
### Proyecto: Chat-Bot

Este documento describe el modelo híbrido elegido para el desarrollo del proyecto **Chat-Bot**, combinando las metodologías **Scrum**, **Espiral** y **Kanban**. Se explica la justificación, aportaciones de cada metodología, aplicación dentro del proyecto y su integración con el flujo de trabajo del repositorio GitHub.

---

## 1. Justificación del Modelo Híbrido

Las metodologías estudiadas en clase fueron: **Scrum, Espiral, XP, PMBOK, Cascada y Kanban**.  
Para este proyecto se eligió un modelo híbrido compuesto por **Scrum + Espiral + Kanban** debido a:

### ✔ Por qué Scrum
- Permite organizar el desarrollo en **Sprints** cortos y manejables.
- Ofrece un proceso ágil para construir funcionalidades incrementales.
- Favorece la adaptación continua y retroalimentación.

### ✔ Por qué Espiral
- Es útil para proyectos con **riesgos técnicos** elevados:
  - Integración con modelos de IA
  - Uso de contenedores (Docker)
  - Pruebas con API externa
  - Arquitectura cliente-servidor
- Obliga a realizar análisis de riesgos en cada ciclo.
- Asegura prototipos validados antes de avanzar.

### ✔ Por qué Kanban
- Permite controlar el **flujo visual de trabajo**, ideal para GitHub Projects.
- Se integra naturalmente con Issues y Pull Requests.
- Complementa Scrum mostrando el progreso en tiempo real.
- Ayuda a identificar cuellos de botella durante los ciclos del Espiral.
- No requiere ceremonias adicionales, útil para un desarrollador individual.

---

## 2. Aportaciones de cada metodología al modelo híbrido

### 🎯 Aporte de Scrum
- Organización del trabajo mediante:
  - Product Backlog
  - Sprint Backlog
  - Sprints y revisiones
- Entregables incrementales del proyecto.
- Estructura clara para planificación y desarrollo.

### 🌀 Aporte del modelo Espiral
- Identificación y evaluación de riesgos técnicos.
- Prototipos antes del desarrollo final.
- Validación técnica constante.
- Ciclos iterativos basados en riesgo, validación y planificación.

### 📊 Aporte de Kanban
- Flujo visual de trabajo: **To Do → In Progress → Review → Done**
- Control de Work In Progress (WIP).
- Seguimiento claro de tareas por columna.
- Integración directa con GitHub Projects:
  - Issues = tarjetas
  - PRs = fase de revisión
  - Merge = completado

---

## 3. Aplicación de Scrum dentro del proyecto

### 📌 Roles
- **Product Owner:** Director (desarrollador principal)
- **Scrum Master:** Maestros
- **Development Team:** Estudiante

### 📌 Artefactos
- **Product Backlog:** Administrado en GitHub Projects.
- **Sprint Backlog:** Issues dentro del sprint.
- **Incrementos del proyecto:**  
  - API básica  
  - Integración con modelo  
  - Frontend  
  - Documentación final  

### 📌 Eventos
- Sprint Planning: definición de objetivos del sprint.  
- Daily Scrum (simplificado): notas en Issues o commits.  
- Sprint Review: revisión de Pull Requests.  
- Sprint Retrospective: notas en Issues/Milestones.

---

## 4. Aplicación del modelo Espiral dentro del proyecto

Cada iteración del Espiral sigue estas cuatro fases:

### **1. Identificación de objetivos**
Ejemplos:
- Implementar API REST.
- Integrar modelo LLM.
- Construir frontend.
- Pruebas de endpoints.

### **2. Análisis de riesgos**
Ejemplos:
- Fallos del modelo IA.
- Problemas de red con Docker.
- Errores CORS.
- Tiempo de respuesta lento.
- Dependencias incorrectas.

### **3. Desarrollo y validación**
- Creación de prototipos.
- Pruebas en Postman.
- Debugging.
- Ajustes según resultados.

### **4. Planificación de la siguiente iteración**
- Crear nuevas Issues.
- Repriorizar tareas.
- Actualizar milestones.
- Documentar resultados.

---

## 5. Aplicación de Kanban dentro del proyecto

Kanban se usará como capa visual del flujo de trabajo:

### 🗂 Columnas recomendadas del tablero GitHub Projects
- **To Do:** Issues recién creadas.  
- **In Progress:** Tareas activas dentro del sprint.  
- **Review:** Tareas con Pull Request abierto.  
- **Done:** Tareas fusionadas en `main`.  

### 🔄 Integración con el modelo híbrido
- Scrum define “qué y cuándo”.
- Espiral define “cómo y con qué riesgos”.
- Kanban muestra “en qué estado está cada tarea”.

### Ejemplo de flujo:
1. Crear Issue → aparece en **To Do**  
2. Iniciar tarea → mover a **In Progress**  
3. Abrir Pull Request → pasa a **Review**  
4. Merge → se mueve automáticamente a **Done**  

---

## 6. Flujo de trabajo híbrido en GitHub

### 🔄 Ciclo completo
1. Crear Issue → agregar al backlog.  
2. Registrar riesgo (Espiral).  
3. Mover Issue en Kanban a **To Do**.  
4. Crear rama para la tarea:  
   ```bash
   git switch -c feature/nombre-de-la-tarea
