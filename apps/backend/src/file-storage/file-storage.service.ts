import {
    AbortMultipartUploadCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ENVALID } from 'nestjs-envalid';

import { Config } from '../config';

@Injectable()
export class FileStorageService {
    private s3Client: S3Client;
    private readonly logger = new Logger(FileStorageService.name);

    constructor(@Inject(ENVALID) private readonly env: Config) {
        this.s3Client = new S3Client({
            region: this.env.S3_REGION,
            endpoint: this.env.S3_ENDPOINT,
            logger: console,
            credentials: {
                accessKeyId: this.env.S3_ACCESS_KEY_ID,
                secretAccessKey: this.env.S3_SECRET_ACCESS_KEY,
            },
        });
    }

    async upload(key: string, uploadId: string) {
        const params = {
            Bucket: this.env.S3_BUCKET,
            Key: key,
            UploadId: uploadId,
        };
        const command = new AbortMultipartUploadCommand(params);
        this.logger.log('Uploading', params);
        return this.s3Client.send(command);
    }

    async getSignedUrlToUpload(key: string, expiresIn = 3600) {
        return getSignedUrl(
            this.s3Client,
            new PutObjectCommand({ Bucket: this.env.S3_BUCKET, Key: key }),
            { expiresIn }
        );
    }

    async getSignedUrlToDownload(key: string, expiresIn = 3600) {
        return getSignedUrl(
            this.s3Client,
            new GetObjectCommand({ Bucket: this.env.S3_BUCKET, Key: key }),
            {
                expiresIn,
            }
        );
    }

    destroy() {
        this.logger.log('Closing S3 client');
        return this.s3Client.destroy();
    }
}
