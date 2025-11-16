FROM ollama/ollama:latest

# Descargar modelo automáticamente
RUN ollama pull llama3.1

EXPOSE 11434

CMD ["ollama", "serve"]
