export type UploadParams = {
  fileName: string;
  fileType: string;
  fileSize: number;
  body: Buffer;
};

export type UploadImageParams = {
  image: UploadParams;
};

export type UploadReturn = {
  url: string;
  size: number;
  name: string;
};

export abstract class Uploader {
  abstract uploadImage(params: UploadImageParams): Promise<UploadReturn>;
}
