# Health First Server

A comprehensive Spring Boot application for healthcare provider management with secure authentication and comprehensive API documentation.

## Features

- **Provider Registration**: Complete provider registration with validation
- **Provider Authentication**: JWT-based authentication with login/logout
- **Provider Management**: CRUD operations with search, pagination, and filtering
- **Security**: BCrypt password hashing, JWT tokens, and role-based access
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Database**: PostgreSQL support with JPA/Hibernate
- **Testing**: Unit and integration tests

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.1
- **Spring Security**: JWT authentication
- **Spring Data JPA**: Database operations
- **PostgreSQL**: Database
- **Maven**: Build tool
- **Swagger/OpenAPI**: API documentation

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL database

### Database Setup

1. Create a PostgreSQL database
2. Update `application.yaml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/your_database
    username: your_username
    password: your_password
```

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

### Swagger UI

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

### API Endpoints

#### Provider Registration
- `POST /api/v1/provider/register` - Register a new provider

#### Provider Authentication
- `POST /api/v1/provider/login` - Provider login
- `POST /api/v1/provider/logout` - Provider logout (requires authentication)
- `GET /api/v1/provider/me` - Get current provider info (requires authentication)
- `POST /api/v1/provider/validate-token` - Validate JWT token (requires authentication)

#### Provider Management
- `GET /api/v1/provider/{uuid}` - Get provider by UUID
- `PUT /api/v1/provider/{uuid}` - Update provider by UUID
- `DELETE /api/v1/provider/{uuid}` - Delete provider by UUID
- `GET /api/v1/provider/all` - Get all providers with pagination
- `GET /api/v1/provider/search` - Search providers with filters
- `GET /api/v1/provider/active` - Get active providers
- `GET /api/v1/provider/list` - Get all providers as list
- `GET /api/v1/provider/stats` - Get provider statistics

## Security

- **Password Hashing**: BCrypt with 12 salt rounds
- **JWT Tokens**: 1-hour expiration
- **Input Validation**: Comprehensive validation for all inputs
- **CORS**: Configured for cross-origin requests

## Testing

Run the test suite:

```bash
mvn test
```

The project includes:
- Unit tests for services
- Integration tests for controllers
- Authentication and authorization tests

## Configuration

Key configuration options in `application.yaml`:

```yaml
# JWT Configuration
jwt:
  secret: your-super-secret-jwt-key-for-health-first-server-2025
  expiration: 3600
  issuer: health-first-server

# Swagger Configuration
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
```

## Database Schema

The application uses a `providers` table with the following structure:

- `id` (Long, Primary Key)
- `uuid` (UUID, Unique)
- `first_name` (String, Required)
- `last_name` (String, Required)
- `email` (String, Unique, Required)
- `phone_number` (String, Unique, Required)
- `password_hash` (String, Required)
- `specialization` (String, Required)
- `license_number` (String, Unique, Required)
- `years_of_experience` (Integer)
- `clinic_address` (Embedded Object)
- `verification_status` (Enum: PENDING/VERIFIED/REJECTED)
- `is_active` (Boolean, Default: true)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License. 