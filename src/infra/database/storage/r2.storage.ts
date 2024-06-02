import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Uploader, UploadImageParams, UploadReturn } from '@root/domain/application/repositories/uploader.repository';
import { randomUUID } from 'crypto';

export class R2Storage implements Uploader {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImage({ image }: UploadImageParams): Promise<UploadReturn> {
    const uploadId = randomUUID();
    const uniqueName = `${uploadId}-${image.fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueName,
      Body: image.body,
      ContentType: image.fileType,
    });

    await this.client.send(command);

    return {
      url: uniqueName,
      name: image.fileName,
      size: image.fileSize,
    };
  }
}
