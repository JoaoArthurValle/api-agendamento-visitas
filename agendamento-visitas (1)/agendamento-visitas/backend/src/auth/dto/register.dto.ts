import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(160)
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
