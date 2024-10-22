import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';

@Controller('music')
export class MusicController {
    constructor(private readonly musicService: MusicService) { }

    @Post('add')
    async addToQueue(@Body() createMusicDto: CreateMusicDto) {
        return this.musicService.addSong(createMusicDto);
    }

    @Get('queue')
    async getQueue() {
        return this.musicService.getQueue();
    }

    @Get('search')
    async searchMusic(@Query('q') query: string) {
        return this.musicService.searchMusic(query);
    }

    @Delete('delete/:videoId')
    async deleteSong(@Param('videoId') videoId: string) {
        return this.musicService.deleteSong(videoId);
    }

}
