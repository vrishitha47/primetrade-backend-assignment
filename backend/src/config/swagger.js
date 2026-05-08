const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Task Management REST API',
    version: '1.0.0',
    description: 'JWT-authenticated task management API with user and admin roles.'
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local development'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          owner: { $ref: '#/components/schemas/User' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'object' } }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Registered successfully' },
          400: { description: 'Validation error or duplicate email' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'jane@example.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile' },
          401: { description: 'Missing or invalid token' }
        }
      }
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks. Users see their own tasks; admins see all tasks.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Task list' },
          401: { description: 'Missing or invalid token' }
        }
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a task for the authenticated user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Prepare assignment' },
                  description: { type: 'string', example: 'Finish API and frontend' },
                  status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                  priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                  dueDate: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Task created' },
          400: { description: 'Validation error' }
        }
      }
    },
    '/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get one task by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task detail' },
          403: { description: 'Not allowed to access this task' },
          404: { description: 'Task not found' }
        }
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Update one task by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task updated' },
          403: { description: 'Not allowed to update this task' },
          404: { description: 'Task not found' }
        }
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete one task by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task deleted' },
          403: { description: 'Not allowed to delete this task' },
          404: { description: 'Task not found' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
