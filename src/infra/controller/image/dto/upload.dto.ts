import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class File {
  @ApiProperty({
    description: 'O nome do arquivo',
    example: 'test-img',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'O tipo do arquivo',
    example: '.png',
  })
  @IsString()
  fileType: string;

  @ApiProperty({
    description: 'O tamanho do arquivo',
    example: 87126,
  })
  @IsNumber()
  fileSize: number;

  @ApiProperty({
    description: 'O buffer do arquivo',
    example: '817 72 6215 16 122',
  })
  @IsString()
  body: Buffer;
}

export class FileUploadDTO {
  @ApiProperty({ type: File, description: 'O arquivo recebido na requisição' })
  file: File;
}
