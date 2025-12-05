
## 🧪 Pruebas Completas del Sistema

### Prueba 1: Training Prompts
curl -X POST http://localhost:3000/chat -H \"Content-Type: application/json\" -d '{\"message\": \"¿A qué universidad perteneces?\", \"useTraining\": true}'

### Prueba 2: Agregar Nuevo Prompt
curl -X POST http://localhost:3000/training -H \"Content-Type: application/json\" -d '{\"question\": \"¿Cuánto cuesta?\", \"variations\": [\"¿Precio?\"], \"answer\": \" MXN\", \"category\": \"costos\"}'

### Prueba 3: RAG + Training
curl -X POST http://localhost:3000/chat -H \"Content-Type: application/json\" -d '{\"message\": \"requisitos\", \"useTraining\": true, \"useRAG\": true}'

