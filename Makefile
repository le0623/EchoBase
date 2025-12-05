# Database Management Makefile for EnduroShield Hub
# Prisma + PostgreSQL operations

# Variables
DB_NAME ?= enduroshieldhub
DB_USER ?= postgres
DB_PASSWORD ?= postgres
DB_HOST ?= localhost
DB_PORT ?= 5432
CONTAINER_NAME ?= enduroshieldhub-postgres
BACKUP_DIR ?= ./backups
TIMESTAMP := $(shell date +%Y%m%d_%H%M%S)
BACKUP_FILE ?= $(BACKUP_DIR)/backup_$(TIMESTAMP).sql

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help install start stop restart status logs backup restore clean

# Default target
help: ## Show this help message
	@echo "$(GREEN)EnduroShield Hub Database Management$(NC)"
	@echo "=================================="
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Docker operations
install: ## Install dependencies and setup database
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	npm install
	@echo "$(YELLOW)Setting up database...$(NC)"
	docker compose up -d
	@echo "$(GREEN)Waiting for database to be ready...$(NC)"
	@sleep 5
	@echo "$(GREEN)Database setup complete!$(NC)"

start: ## Start PostgreSQL container
	@echo "$(YELLOW)Starting PostgreSQL container...$(NC)"
	docker compose up -d
	@echo "$(GREEN)PostgreSQL container started!$(NC)"

stop: ## Stop PostgreSQL container
	@echo "$(YELLOW)Stopping PostgreSQL container...$(NC)"
	docker compose down
	@echo "$(GREEN)PostgreSQL container stopped!$(NC)"

restart: ## Restart PostgreSQL container
	@echo "$(YELLOW)Restarting PostgreSQL container...$(NC)"
	docker compose restart
	@echo "$(GREEN)PostgreSQL container restarted!$(NC)"

status: ## Show container status
	@echo "$(YELLOW)Container status:$(NC)"
	docker compose ps

logs: ## Show container logs
	@echo "$(YELLOW)Container logs:$(NC)"
	docker compose logs -f

# Database operations
backup: ## Create database backup
	@echo "$(YELLOW)Creating database backup...$(NC)"
	@mkdir -p $(BACKUP_DIR)
	docker exec $(CONTAINER_NAME) pg_dump -U $(DB_USER) -d $(DB_NAME) > $(BACKUP_FILE)
	@echo "$(GREEN)Backup created: $(BACKUP_FILE)$(NC)"

restore: ## Restore database from backup (usage: make restore BACKUP_FILE=path/to/backup.sql)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Error: Please specify BACKUP_FILE=path/to/backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring database from $(BACKUP_FILE)...$(NC)"
	docker exec -i $(CONTAINER_NAME) psql -U $(DB_USER) -d $(DB_NAME) < $(BACKUP_FILE)
	@echo "$(GREEN)Database restored successfully!$(NC)"

# Utility operations
clean: ## Clean up containers and volumes
	@echo "$(YELLOW)Cleaning up containers and volumes...$(NC)"
	docker compose down -v
	docker system prune -f
	@echo "$(GREEN)Cleanup complete!$(NC)"

clean-backups: ## Clean old backup files (older than 7 days)
	@echo "$(YELLOW)Cleaning old backup files...$(NC)"
	find $(BACKUP_DIR) -name "backup_*.sql" -mtime +7 -delete
	@echo "$(GREEN)Old backups cleaned!$(NC)"

# Development helpers
dev-setup: ## Complete development setup
	@echo "$(YELLOW)Setting up development environment...$(NC)"
	$(MAKE) install
	$(MAKE) migrate
	@echo "$(GREEN)Development setup complete!$(NC)"

# Production helpers
prod-deploy: ## Deploy to production
	@echo "$(YELLOW)Deploying to production...$(NC)"
	$(MAKE) migrate-deploy
	@echo "$(GREEN)Production deployment complete!$(NC)"

# Database info
db-info: ## Show database information
	@echo "$(YELLOW)Database Information:$(NC)"
	@echo "  Host: $(DB_HOST)"
	@echo "  Port: $(DB_PORT)"
	@echo "  Database: $(DB_NAME)"
	@echo "  User: $(DB_USER)"
	@echo "  Container: $(CONTAINER_NAME)"
	@echo "  Backup Directory: $(BACKUP_DIR)"

# Quick commands
up: start ## Alias for start
down: stop ## Alias for stop
