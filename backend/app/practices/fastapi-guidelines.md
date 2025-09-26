# FastAPI Development Guidelines

## API Design

Follow RESTful principles for API endpoints. Use appropriate HTTP status codes and methods (GET, POST, PUT, DELETE).

## Request/Response Models

Always use Pydantic models for request and response validation. This ensures type safety and automatic documentation generation.

## Error Handling

Implement proper error handling with HTTPException. Provide meaningful error messages and appropriate status codes.

## Authentication

Implement proper authentication and authorization. Use dependency injection for security checks.

## Documentation

FastAPI automatically generates OpenAPI documentation. Ensure your endpoints have proper descriptions and examples.

## Performance

Use async/await for I/O bound operations. Implement proper database connection pooling and caching where appropriate.