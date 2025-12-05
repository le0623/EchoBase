# PostgreSQL Dockerfile
FROM postgres:16-alpine

# Set environment variables
ENV POSTGRES_DB=enduroshieldhub
ENV POSTGRES_USER=enduroshieldhub
ENV POSTGRES_PASSWORD=secret_leonel
ENV POSTGRES_HOST_AUTH_METHOD=trust

# Create directory for backups
RUN mkdir -p /backups

# Expose PostgreSQL port
EXPOSE 5433

# Set default command
CMD ["postgres"]
