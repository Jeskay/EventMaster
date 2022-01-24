declare namespace NodeJS {
  export interface ProcessEnv {
    TOKEN: string | undefined;
    PREFIX: string | undefined;
    PRODUCTION: 'dev' | 'prod' | undefined;
  }
}