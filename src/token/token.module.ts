import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./schemas/token.schema";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  providers: [TokenService, JwtService]
})
export class TokenModule {
}
