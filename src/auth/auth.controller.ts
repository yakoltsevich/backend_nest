import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { LoginUserDto } from "../users/dto/login-user.dto";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post("/login")
  login(@Body() userDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(userDto, response);
  }

  @Post("/registration")
  registration(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.registration(userDto, response);
  }

  @Get("/refresh")
  refresh(@Req() request: Request) {
    const { refreshToken } = request.cookies;
    return this.authService.refresh(refreshToken);
  }

  @Post("/logout")
  logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const { refreshToken } = request.cookies;
    return this.authService.logout(refreshToken, response);
  }
}