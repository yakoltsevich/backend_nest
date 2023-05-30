import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @ApiProperty({ example: "user@mail.ru", description: "Mail" })
  @IsString({ message: "Should be a string" })
  @IsEmail({}, { message: "wrong email" })
  readonly email: string;
  @ApiProperty({ example: "12345", description: "password" })
  @IsString({ message: "Should be a string" })
  @Length(4, 16, { message: "from 4 to 16 symbols" })
  readonly password: string;
}