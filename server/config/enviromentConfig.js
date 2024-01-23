import dotenv from "dotenv";

dotenv.config();

/**
 * @description Module to hold enviroment settings
 * @type {{app: {clientUrl: *, appName: *, contactName: *, enableFileLog: *, companyName: *, enableSwaggerEndpoint: *, serverPort: *, privacyPolicyUrl: *, companyStreet: *, license: *, enableDbLog: *, contactUrl: *, confirmUrl: *, companyTown: *, enableConsoleLog: *}, database: {password: *, authSource: *, port: *, dbName: *, host: *, userName: *}, cors: {allowedOrigins: *}, rateLimiter: {allowdRequestsInTimespan: *, measureTimespan: *, enabled: string}, jwt: {accessTokenPrivateKey: *, refreshTokenPrivateKey: *}}}
 */
export const enviromentConfig = {
  app: {
    confirmUrl: process.env.SMTP_CONFIRM_CLIENTURL,
    appName: process.env.APPLICATION_SWAGGER_APPNAME,
    companyName: process.env.APPLICATION_COMPANYNAME,
    companyStreet: process.env.APPLICATION_COMPANYSTREET,
    companyTown: process.env.APPLICATION_COMPANYTOWN,
    privacyPolicyUrl: process.env.APPLICATION_PRIVACYPOLICY_URL,
    license: process.env.APPLICATION_SWAGGER_LICENSE,
    contactUrl: process.env.APPLICATION_SWAGGER_CONTACT_URL,
    contactName: process.env.APPLICATION_SWAGGER_CONTACT_NAME,
    clientUrl: process.env.APPLICATION_CLIENT_URL,
    serverPort: process.env.SERVER_PORT,
    enableConsoleLog: process.env.ENABLE_CONSOLE_LOG,
    enableFileLog: process.env.ENABLE_FILE_LOG,
    enableDbLog: process.env.ENABLE_DB_LOG,
    enableSwaggerEndpoint: process.env.ENABLE_SWAGGER_ENDPOINT,
  },
  jwt: {
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS,
  },
  rateLimiter: {
    enabled: process.env.ATELIMIT_ENABLED,
    measureTimespan: process.env.RATELIMIT_MEASURE_TIMESPAN_INMINUTES,
    allowedRequestsInTimespan: process.env.RATELIMIT_ALLOWED_REQUESTS_INTMEASURETIMESPAN,
  },
  database: {
    dbName: process.env.MONGO_DB_NAME,
    userName: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    authSource: process.env.MONGO_AUTHSOURCE,
  },
  // ... other configurations
};
