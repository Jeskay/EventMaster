declare namespace NodeJS {
  export interface ProcessEnv {
    TOKEN: string | undefined;
    PREFIX: string | undefined;
    DB_URL: string | undefined;
    DB_NAME?: string | undefined;
    PRODUCTION: 'dev' | 'prod' | undefined;
  }
}