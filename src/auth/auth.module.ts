import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { TokenService } from "../token/token.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "../token/schemas/token.schema";
import { User, UserSchema } from "../users/schemas/user.schema";

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    JwtModule.register({})
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {
}
