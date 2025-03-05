# Sonnet Backend

## Overview

This directory will contain the backend services for the Sonnet electronic health records (EHR) and practice management system. The backend will be built using Python and FastAPI, exposing both REST and GraphQL API endpoints.

## Planned Features

- **REST API**: Standard RESTful endpoints for CRUD operations on resources
- **GraphQL API**: Flexible query language for more complex data requirements
- **Authentication & Authorization**: Secure access to patient data and system resources
- **Data Validation**: Comprehensive validation of incoming data
- **Integration with Supabase**: Database operations and real-time capabilities

## Technology Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI
- **GraphQL**: Strawberry GraphQL for Python
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT-based authentication
- **Documentation**: OpenAPI (Swagger) and GraphiQL

## Project Structure (Planned)

```
backend/
├── app/                  # Main application package
│   ├── api/              # API endpoints
│   │   ├── rest/         # REST API routes
│   │   └── graphql/      # GraphQL schema and resolvers
│   ├── core/             # Core application components
│   │   ├── config.py     # Application configuration
│   │   ├── security.py   # Authentication and authorization
│   │   └── errors.py     # Error handling
│   ├── db/               # Database models and operations
│   │   ├── models/       # SQLAlchemy models
│   │   └── repositories/ # Data access layer
│   ├── schemas/          # Pydantic schemas for validation
│   └── services/         # Business logic
├── tests/                # Test suite
│   ├── api/              # API tests
│   ├── services/         # Service tests
│   └── conftest.py       # Test configuration
├── alembic/              # Database migrations
├── pyproject.toml        # Project dependencies and configuration
├── .env.example          # Example environment variables
└── README.md             # This file
```

## Development Setup (Coming Soon)

Instructions for setting up the development environment will be provided once the backend implementation begins.

## API Documentation (Coming Soon)

API documentation will be available via:
- OpenAPI/Swagger UI for REST endpoints
- GraphiQL for GraphQL queries
