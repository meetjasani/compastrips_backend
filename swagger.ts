const swaggerUi = require('swagger-ui-express');
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'test api',
      version: '1.0.0'
    },
    basePath: '/api/v1',
    schemes: [
      "http",
      "https"
    ],
    tags: [
      {
        name: "User",
        description: "Operations about User"
      },
      {
        name: "Admin",
        description: "Operations about Admin"
      },
      {
        name: "General",
        description: "Operations in General"
      },
      {
        name: "Itinerary",
        description: "Operations about Itinerary"
      },
      {
        name: "Hosting",
        description: "Operations about Hosting"
      }
    ],
    securityDefinitions: {
      Token: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      }
    }
  },
  apis: [
    './src/api/routes/user.ts',
    './src/api/routes/general.ts',
    './src/api/routes/admin.ts',
    './src/api/routes/itinerary.ts',
    './src/api/routes/hosting.ts'
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
};
