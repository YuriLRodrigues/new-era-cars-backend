import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Uploader, UploadImageParams, UploadReturn } from '@root/domain/application/repositories/uploader.repository';
import { randomUUID } from 'crypto';

export class MinioStorage implements Uploader {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      endpoint: `${process.env.CLOUDFLARE_ACCOUNT_ID}`,
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

  // async deleteManyImages(imageKeys: string[]): Promise<void> {
  //   const command = new DeleteObjectCommand({
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: imageKeys,
  //   });

  //   try {
  //     await this.client.send(command);
  //   } catch (error) {
  //     const _error = error as Error;
  //     Logger.error(`Failed to delete image with key "${imageKey}":`, _error);
  //     throw new Error(`Error deleting image: ${_error.message}`);
  //   }
  // }
}
