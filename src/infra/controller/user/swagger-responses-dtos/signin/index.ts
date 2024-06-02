import { Signin200DTO } from './signin-200.dto';
import { Signin400DTO } from './signin-400.dto';
import { Signin404DTO } from './signin-404.dto';

export const SigninResponsesSwagger = {
  200: Signin200DTO,
  400: Signin400DTO,
  404: Signin404DTO,
};
