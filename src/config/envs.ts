import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  GOOGLE_CLIENT_ID: get('GOOGLE_CLIENT_ID').asString(),
  GOOGLE_SECRET: get('GOOGLE_SECRET').asString(),
}



