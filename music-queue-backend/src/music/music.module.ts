import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MusicSchema } from './entities/music.schema';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Music', schema: MusicSchema }])],

  providers: [MusicService],
  controllers: [MusicController]
})
export class MusicModule { }
