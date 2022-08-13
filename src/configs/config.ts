import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

const config = {
    db: {
        host: env.DB_HOST!,
        port: parseInt(env.DB_PORT!),
        database: env.DB_DATABASE!,
        username: env.DB_USERNAME!,
        password: env.DB_PASSWORD!
    },
    jwt: {
        accessSecret: env.JWT_ACCESS_SECRET!,
        refreshSecret: env.JWT_REFRESH_SECRET!,
        accessExpire: env.JWT_ACCESS_EXPIRE!,
        refreshExpire: env.JWT_REFRESH_EXPIRE!
    },
    hashRounds: 10,
    port: parseInt(env.PORT!),

    test: {
        db: {
            host: env.DB_HOST_TEST!,
            port: parseInt(env.DB_PORT_TEST!),
            database: env.DB_DATABASE_TEST!,
            username: env.DB_USERNAME_TEST!,
            password: env.DB_PASSWORD_TEST!
        }
    },
    isTest: (env.NODE_ENV === 'test')
};

export default config;