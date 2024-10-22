import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MusicModule } from './music/music.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://trungkhang223:khangle15@musicqueue.iv37r.mongodb.net/?retryWrites=true&w=majority&appName=MusicQueue'),
    MusicModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
