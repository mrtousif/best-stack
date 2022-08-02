import { Static, makeValidators, port, str, url } from 'nestjs-envalid';

export const validators = makeValidators({
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
    NESTJS_EVENT_WEBHOOK_SHARED_SECRET: str(),
    HASURA_GRAPHQL_API_ENDPOINT: str(),
    S3_REGION: str(),
    S3_ENDPOINT: url(),
    S3_BUCKET: str(),
    PORT: port({ default: 3000 }),
    S3_ACCESS_KEY_ID: str(),
    S3_SECRET_ACCESS_KEY: str(),
});

export type Config = Static<typeof validators>;
