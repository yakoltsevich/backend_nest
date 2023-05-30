import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./token/token.module";

const cloudDB = 'mongodb+srv://admin:admin@cluster0.rbfxu4v.mongodb.net/?retryWrites=true&w=majority'
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL || cloudDB),
    TasksModule,
    UsersModule,
    AuthModule,
    TokenModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
