.PHONY: help up down logs

# The default goal is help
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start the application in detached mode (background)
	docker compose up -d

down: ## Stop and remove the application containers
	docker compose down

logs: ## View the application logs in real-time
	docker compose logs -f
