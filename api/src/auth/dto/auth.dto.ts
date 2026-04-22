import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  password: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  name: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}
