import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { TestModule } from "./test/test.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { HeartPressModule } from './heart-press/heart-press.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ 
    TestModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }), 
      inject: [ConfigService],
    }),
    UserModule,
    HeartPressModule,
    ChatModule,
  ],
})
export class AppModule {}
