import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

enum UserRole {
  Seller = 'Seller',
  Customer = 'Customer',
}

export class RegisterUserDTO {
  @ApiProperty({
    example: 'https://avatar-test.googleapis.com/',
    description: 'O avatar do usuário',
    type: String,
  })
  @IsString({
    message: 'Este campo deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O campo avatar é obrigatório',
  })
  avatar: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'O email do usuário',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'O campo email não é válido',
    },
  )
  @IsNotEmpty({
    message: 'Este campo não pode estar vazio',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'O nome do usuário',
    type: String,
  })
  @IsString({
    message: 'Este campo deve ser uma string',
  })
  @IsNotEmpty({
    message: 'Este campo não pode estar vazio',
  })
  name: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'A senha do usuário',
    type: String,
  })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({
    message: 'Este campo não pode estar vazio',
  })
  password: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'O nome de usuário',
    type: String,
  })
  @IsString({
    message: 'Este campo deve ser uma string',
  })
  @IsNotEmpty({
    message: 'Este campo não pode estar vazio',
  })
  username: string;

  @ApiProperty({
    example: 'Customer',
    description: 'O papel do usuário',
    type: String,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: 1710284684321,
    description: 'A data em que o usuário foi criado',
    type: Number,
  })
  @IsNumber(
    {},
    {
      message: 'O campo deve ser um número',
    },
  )
  @IsOptional()
  createdAt?: number;

  @ApiProperty({
    example: 2638915218363,
    description: 'A data em que o usuário foi atualizado',
    type: Number,
  })
  @IsNumber(
    {},
    {
      message: 'O campo deve ser um número',
    },
  )
  @IsOptional()
  updatedAt?: number;
}
