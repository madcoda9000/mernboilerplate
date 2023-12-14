import express from "express";
import dbConnect from "./utils/dbConnect.js";
import authRoutes from "./routes/auth.js";
import refreshTokenRoutes from "./routes/refreshToken.js";
import userRoutes from "./routes/users.js";
import roleRoutes from "./routes/roles.js";
import logsRoutes from "./routes/logs.js";
import settingsRoutes from "./routes/settings.js";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./services/logger.service.js";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
import expressJSDocSwagger from "express-jsdoc-swagger";
import SeedUsers from "./seeders/usersSeeder.js";
import SeedRoles from "./seeders/rolesSeeder.js";
import SeedSettings from "./seeders/settingsSeeder.js";

const app = express();

// load enviroment variables
dotenv.config();

// connect to database
dbConnect();

// seed initial data
await SeedUsers();
await SeedRoles();
await SeedSettings();


// set cors options
const originWhiteList = process.env.ALLOWED_ORIGINS.split(",");
var corsOptions = {    
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    origin: (origin, callback) => {
        if (originWhiteList.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error())
        }
      }
}
logger.info("SERVER | Activated cors. Allowed origins: " + process.env.ALLOWED_ORIGINS);

// Set CSP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
    noSniff: true, // X-Content-Type-Options-Header setzen
  })
);
logger.info("SERVER | Activated content security policy: script-src:self");

// load express
app.use(express.json());

// Set up rate limiter if enabled in dotenv
if(process.env.RATELIMIT_ENABLED==="true") {
  let timespan = process.env.RATELIMIT_MEASURE_TIMESPAN_INMINUTES || 1;
  let allowedRequests = process.env.RATELIMIT_ALLOWED_REQUESTS_INTMEASURETIMESPAN || 30;
  const limiter = RateLimit({
    windowMs: timespan * 60 * 1000,
    limit: allowedRequests,
    message: "Rate limit exceeded. Please try again later.",
    legacyHeaders: true,
  });
  app.use(limiter);
  logger.info("SERVER | Ratelimiter enabled. Max. " +  allowedRequests + " requests in " + timespan + " minutes allowed.");
} else if(process.env.RATELIMIT_ENABLED==="false") {
  logger.info("SERVER | Ratelimiter disabled by dotenv.");
}

// publish documentation
if(process.env.ENABLE_SWAGGER_ENDPOINT==="true") {
  const swaggerOptions = {
    info: {
        version: '1.0.0',
        title: process.env.APPLICATION_SWAGGER_APPNAME + " API", 
        description: "Backend API for " + process.env.APPLICATION_SWAGGER_APPNAME + " frontend.",       
        license: {
          name: process.env.APPLICATION_SWAGGER_LICENSE,
        },
        contact: {
          name: process.env.APPLICATION_SWAGGER_CONTACT_NAME,
          url: process.env.APPLICATION_SWAGGER_CONTACT_URL,
          email: process.env.APPLICATION_SWAGGER_CONTACT_EMAIL
        },
      },
      baseDir: "./",
      // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
      filesPattern: ['./routes/*.js', './model/*.js'],
      // URL where SwaggerUI will be rendered. Default. /api-docs
      swaggerUIPath: '/v1/doc',
      // Expose OpenAPI UI
      exposeSwaggerUI: true,
      // Expose Open API JSON Docs documentation in `apiDocsPath` path.
      exposeApiDocs: true,
      // Open API JSON Docs endpoint.
      apiDocsPath: '/v1/api-docs',
      // Set non-required fields as nullable by default
      notRequiredAsNullable: false,
      // security options
      security: {
        "BearerAuth": {
          "type": "http",
          "scheme": "bearer"
        }
      },
      // You can customize your UI options.
      // you can extend swagger-ui-express config. You can checkout an example of this
      // in the `example/configuration/swaggerOptions.js`
      swaggerUiOptions: {},
      // multiple option in case you want more that one instance
      multiple: true,
      // hide schemas
      defaultModelsExpandDepth: -1,
  }
  expressJSDocSwagger(app)(swaggerOptions);
  logger.info("SERVER | Swagger published at /v1/doc");
} else if(process.env.ENABLE_SWAGGER_ENDPOINT==="true") {
  logger.info("SERVER | Swagger disabled by dotenv variable!");
}

// publish routes
app.use("/v1/auth", cors(corsOptions), authRoutes);
app.use("/v1/auth", cors(corsOptions), refreshTokenRoutes);
logger.info("SERVER | published auth routes..");
app.use("/v1/users", cors(corsOptions), userRoutes);
logger.info("SERVER | published users routes..");
app.use("/v1/roles", cors(corsOptions), roleRoutes);
logger.info("SERVER | published roles routes..");
app.use("/v1/logs", cors(corsOptions), logsRoutes);
logger.info("SERVER | published logs routes..");
app.use("/v1/settings", cors(corsOptions), settingsRoutes);
logger.info("SERVER | published settings routes..");

// start server
const port = process.env.SERVER_PORT || 8080;
app.listen(port, () => logger.info('SERVER | Listening on port ' + port));

