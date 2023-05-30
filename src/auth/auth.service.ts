import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import * as uuid from "uuid";
import { Response } from "express";
import { ApiError } from "../exceptions/api-error";
import { TokenService } from "../token/token.service";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../users/schemas/user.schema";
import { Model } from "mongoose";
import { LoginUserDto } from "../users/dto/login-user.dto";

const MONTH = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              @InjectModel(User.name) private userModel: Model<UserDocument>,
              private tokenService: TokenService) {
  }

  async login(userDto: LoginUserDto, response: Response) {
    const user = await this.validateUser(userDto);
    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user._id, tokens.refreshToken);
    response.cookie("refreshToken", tokens.refreshToken, { maxAge: MONTH, httpOnly: true });
    return { ...tokens, user };
  }

  async registration(userDto: CreateUserDto, response: Response) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException("User with this email already exist", HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const activationLink = uuid.v4();
    const user = await this.userService.createUser({ ...userDto, password: hashPassword, activationLink });
    const tokens = await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user._id, tokens.refreshToken);
    response.cookie("refreshToken", tokens.refreshToken, { maxAge: MONTH, httpOnly: true });
    return { ...tokens, user };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await this.userModel.findById(userData._doc._id);
    const tokens = await this.tokenService.generateTokens(user);
    return { ...tokens, user };
  }

  async logout(refreshToken, response: Response) {
    const token = await this.tokenService.removeToken(refreshToken);
    response.clearCookie("refreshToken");
    return token;
  }

  private async validateUser(userDto: CreateUserDto | LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: "Wrong email or password" });
  }
}

