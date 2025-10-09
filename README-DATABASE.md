# Database Management for Echobase

This document explains how to manage the PostgreSQL database for the Echobase application using Docker and Prisma.

## Quick Start

1. **Setup the database:**
   ```bash
   make dev-setup
   ```

2. **Start the database:**
   ```bash
   make start
   ```

3. **Open Prisma Studio:**
   ```bash
   make studio
   ```

## Available Commands

### Docker Operations
- `make start` - Start PostgreSQL container
- `make stop` - Stop PostgreSQL container
- `make restart` - Restart PostgreSQL container
- `make status` - Show container status
- `make logs` - Show container logs

### Database Operations
- `make backup` - Create database backup
- `make restore BACKUP_FILE=path/to/backup.sql` - Restore from backup
- `make migrate` - Run Prisma migrations
- `make push` - Push schema changes to database
- `make studio` - Open Prisma Studio
- `make generate` - Generate Prisma client

### Development
- `make dev-setup` - Complete development setup
- `make reset` - Reset database (WARNING: deletes all data)
- `make seed` - Seed database with initial data

### Production
- `make migrate-deploy` - Deploy migrations to production
- `make prod-deploy` - Complete production deployment

### Utilities
- `make clean` - Clean up containers and volumes
- `make clean-backups` - Clean old backup files
- `make db-info` - Show database information

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   - `DATABASE_URL` - PostgreSQL connection string
   - `WORKOS_API_KEY` - Your WorkOS API key
   - `WORKOS_CLIENT_ID` - Your WorkOS client ID
   - Other configuration values

## Database Schema

The database uses Prisma with the following main models:
- `User` - User accounts with WorkOS integration
- `Tenant` - Multi-tenant organizations

## Backup and Restore

### Creating Backups
```bash
# Create a timestamped backup
make backup

# Backups are stored in ./backups/ directory
```

### Restoring Backups
```bash
# Restore from a specific backup file
make restore BACKUP_FILE=./backups/backup_20240101_120000.sql
```

## Development Workflow

1. **Start development:**
   ```bash
   make dev-setup
   npm run dev
   ```

2. **Make schema changes:**
   - Edit `prisma/schema.prisma`
   - Run `make migrate` to apply changes
   - Run `make generate` to update Prisma client

3. **View database:**
   ```bash
   make studio
   ```

## Production Deployment

1. **Deploy migrations:**
   ```bash
   make migrate-deploy
   ```

2. **Generate Prisma client:**
   ```bash
   make generate
   ```

## Troubleshooting

### Container Issues
- Check container status: `make status`
- View logs: `make logs`
- Restart container: `make restart`

### Database Issues
- Reset database: `make reset` (WARNING: deletes all data)
- Clean everything: `make clean`

### Connection Issues
- Verify DATABASE_URL in .env file
- Check if container is running: `make status`
- Ensure port 5432 is available
