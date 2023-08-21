import * as dotenv from 'dotenv';
dotenv.config();

interface Configuration {
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    pass: string;
    type: string;
    logging: boolean;
  };
  api: {
    port: number;
    accessJwtSecretKey: string;
    accessTokenExpireInSec: number;
    refreshTokenExpireInSec: number;
  };


}

export default (): Configuration => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'youtube',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || 'kien123',
    type: process.env.DB_TYPE || 'mysql',
    logging: process.env.DB_LOGGING === 'false',
  },
  api: {
    port: parseInt(process.env.API_PORT, 10) || 5000,
    accessJwtSecretKey: process.env.ACCESS_JWT_SECRET_KEY || '',
    accessTokenExpireInSec: parseInt(
      process.env.ACCESS_TOKEN_EXPIRE_IN_SEC,
      10,
    ),
    refreshTokenExpireInSec: parseInt(
      process.env.REFRESH_TOKEN_EXPIRE_IN_SEC,
      10,
    ),
  }

});
