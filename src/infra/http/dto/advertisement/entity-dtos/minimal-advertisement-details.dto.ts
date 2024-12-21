import { ApiProperty } from '@nestjs/swagger';
import { Capacity, Doors, Fuel, GearBox } from '@root/domain/enterprise/entities/advertisement.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { IsInt, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class MinimalAdvertisementDetailsDto {
  @ApiProperty({
    description: 'URL da imagem da marca',
    type: String,
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: 'Nome da marca',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID único da marca',
    type: String,
  })
  @IsString()
  brandId: string;

  @ApiProperty({
    description: 'Kilometragem do veículo',
    type: Number,
  })
  @IsInt()
  km: number;

  @ApiProperty({
    description: 'Preço do veículo',
    type: Number,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Título do anúncio',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'ID único do anúncio',
    type: String,
  })
  @IsString()
  advertisementId: string;

  @ApiProperty({
    description: 'URL da miniatura do anúncio',
    type: String,
  })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({
    description: 'Capacidade do veículo',
    enum: Capacity,
  })
  @IsEnum(Capacity)
  capacity: Capacity;

  @ApiProperty({
    description: 'Número de portas do veículo',
    enum: Doors,
  })
  @IsEnum(Doors)
  doors: Doors;

  @ApiProperty({
    description: 'Tipo de combustível',
    enum: Fuel,
  })
  @IsEnum(Fuel)
  fuel: Fuel;

  @ApiProperty({
    description: 'Tipo de câmbio',
    enum: GearBox,
  })
  @IsEnum(GearBox)
  gearBox: GearBox;

  @ApiProperty({
    description: 'Curtidas no anúncio',
    type: [LikeEntity],
    required: false,
  })
  @IsOptional()
  likes?: LikeEntity[];
}
