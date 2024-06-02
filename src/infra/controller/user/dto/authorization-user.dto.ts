import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthorizationUserDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'Field email is not valid',
    },
  )
  @IsNotEmpty({
    message: 'This field cannot be empty',
  })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The user password',
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
    message: 'This field cannot be empty',
  })
  password: string;
}
