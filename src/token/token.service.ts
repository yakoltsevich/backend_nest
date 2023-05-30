import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token, TokenDocument } from "./schemas/token.schema";

import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
              private jwtService: JwtService) {
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenModel.findOne({ userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokenModel.create({ userId, refreshToken });
    return token;
  }

  async findToken(refreshToken) {
    const tokenData = await this.tokenModel.findOne({ refreshToken: refreshToken });
    return tokenData;
  }

  async removeToken(refreshToken) {
    const tokenData = await this.tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      return userData;
    } catch (e) {
      return null;
    }
  }

  async generateTokens(user: CreateUserDto) {
    const payload = { email: user.email, ...user };
    return {
      accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: "20m" }),
      refreshToken: this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: "60d" })
    };
  }
}
