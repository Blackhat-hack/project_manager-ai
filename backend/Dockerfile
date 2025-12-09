FROM php:8.3-fpm-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    postgresql-dev \
    zip \
    unzip \
    git \
    nginx \
    supervisor

RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application files
COPY . .

# Run post-install scripts
RUN composer run-script post-install-cmd --no-interaction

# Create necessary directories
RUN mkdir -p var/cache var/log && \
    chmod -R 777 var/

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
