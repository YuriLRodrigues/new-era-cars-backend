import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  file: {
    fileName: string;
    fileType: string;
    fileSize: number;
    body: Buffer;
  };
}
