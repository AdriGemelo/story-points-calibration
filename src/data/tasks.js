export const baselineTasks = [
  {
    id: 1,
    title: "Campo 'nickname' en PaymentMethod",
    description: "Agregar nuevo campo opcional 'nickname' a la entidad PaymentMethod existente",
    criteria: ["Añadir campo en entity JPA", "Actualizar DTO", "Agregar validación opcional"],
    stack: "Backend (Java + Spring)",
    expectedPoints: 1
  },
  {
    id: 2,
    title: "Endpoint GET payment methods",
    description: "Crear endpoint GET para listar payment methods de un usuario",
    criteria: ["Endpoint REST con paginación", "Filtros básicos por tipo", "Tests unitarios", "Documentación OpenAPI"],
    stack: "Backend (Java + Spring)",
    expectedPoints: 2
  },
  {
    id: 3,
    title: "Componente selección payment method",
    description: "Implementar componente de selección de payment method en frontend",
    criteria: ["Componente reutilizable en Angular", "Integración con API backend", "Validación de selección", "Responsive design básico"],
    stack: "Frontend (Angular) + API",
    expectedPoints: 3
  },
  {
    id: 4,
    title: "Sistema completo reglas de negocio",
    description: "Sistema completo de aplicación de reglas de negocio por tipo de usuario",
    criteria: ["Múltiples capas", "Reglas complejas", "Frontend y backend", "Múltiples integraciones"],
    stack: "Full Stack",
    expectedPoints: 5,
    splitRequired: true
  }
];

export const practicalTasks = [
  {
    id: 5,
    title: "Validación tarjeta en tiempo real",
    description: "Implementar validación de tarjeta de crédito en tiempo real con API externa",
    criteria: ["Integración API externa", "Validación en frontend", "Manejo de errores", "Cache de resultados"]
  },
  {
    id: 6,
    title: "Dashboard payment methods",
    description: "Dashboard de payment methods por usuario con métricas",
    criteria: ["Componente dashboard", "Gráficos interactivos", "Filtros avanzados", "Export a PDF"]
  },
  {
    id: 7,
    title: "Regla usuarios premium",
    description: "Regla: usuarios premium pueden tener 5+ métodos de pago",
    criteria: ["Validación backend", "UI condicional", "Tests de regla", "Migración de datos"]
  },
  {
    id: 8,
    title: "API webhooks",
    description: "API de webhooks para cambios de estado de payment",
    criteria: ["Endpoint webhooks", "Sistema de eventos", "Retry mechanism", "Documentación API"]
  },
  {
    id: 9,
    title: "Formulario creación payment",
    description: "Componente de formulario de creación de payment method",
    criteria: ["Formulario multi-step", "Validación avanzada", "Integración API", "UX optimizada"]
  },
  {
    id: 10,
    title: "Cache reglas con Redis",
    description: "Cache de reglas de negocio con Redis",
    criteria: ["Implementación Redis", "Estrategia cache", "Invalidación automática", "Monitoreo performance"]
  },
  {
    id: 11,
    title: "Tests e2e flujo pago",
    description: "Tests de integración end-to-end para flujo de pago",
    criteria: ["Scenarios completos", "Data setup", "Cucumber features", "CI/CD integration"]
  }
];

export const estimationCriteria = {
  1: {
    title: "Cambio Trivial",
    time: "2-4 horas",
    characteristics: ["Una sola capa", "Cambio menor", "Sin integraciones"],
    example: "Nuevo campo simple",
    color: "green"
  },
  2: {
    title: "Tarea Simple",
    time: "4-8 horas",
    characteristics: ["Una capa principal", "Funcionalidad directa", "Integración conocida"],
    example: "CRUD básico",
    color: "blue"
  },
  3: {
    title: "Tarea Moderada",
    time: "1-2 días",
    characteristics: ["Múltiples capas", "Lógica de negocio", "Investigación menor"],
    example: "Feature completa",
    color: "yellow"
  },
  5: {
    title: "SPLIT OBLIGATORIO",
    time: "> 2-3 días",
    characteristics: ["Alta complejidad", "Muchas incertidumbres", "Investigación significativa"],
    example: "Dividir en tareas menores",
    color: "red"
  }
};

export const stackAdjustments = {
  backend: {
    title: "Backend (Java + Spring)",
    adjustment: "+0 puntos",
    description: "Área de fortaleza del equipo",
    rules: [
      "+0 puntos - Estimación base sin ajustes",
      "+1 punto solo si tecnología completamente nueva"
    ]
  },
  frontend: {
    title: "Frontend (Angular/React)",
    adjustment: "+1 punto (condicional)",
    description: "Área de crecimiento del equipo",
    rules: [
      "+1 punto si componentes complejos nuevos",
      "+0 puntos si modificación de componente existente",
      "+1 punto si nueva librería/integración"
    ]
  }
};