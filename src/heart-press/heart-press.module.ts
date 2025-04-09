import { Module } from '@nestjs/common';
import { HeartPressService } from './heart-press.service';
import { HeartPressController } from './heart-press.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HeartPress, HeartPressSchema } from './heart-press.schema';
import { UserModule } from 'src/user/user.module';
@Module({
  controllers: [HeartPressController],
  providers: [HeartPressService,
  ],
  imports:[
    MongooseModule.forFeature([{ name: HeartPress.name, schema: HeartPressSchema }]),
    UserModule
  ],
  exports: [HeartPressService],
})
export class HeartPressModule {}
