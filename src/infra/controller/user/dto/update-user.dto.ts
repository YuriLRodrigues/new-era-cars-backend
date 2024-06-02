import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';

enum UserRole {
  Seller = 'Seller',
  Customer = 'Customer',
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: '6f3a7fb7-60e5-4ae9-9e1e-6d0d3ccbd979',
  })
  id: string;

  @ApiProperty({
    description: 'Avatar do usuário',
    example: 'https://example.com/avatar.png',
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'johndoe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Customer',
    description: 'Permissão do usuário',
    type: String,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
