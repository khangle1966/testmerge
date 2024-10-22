import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMusicDto } from './dto/create-music.dto';
import { Music } from './interfaces/music.interface';
import axios from 'axios';
import { Server } from 'socket.io';

@Injectable()
export class MusicService {
  private server: Server;  // Lưu trữ WebSocket server

  constructor(@InjectModel('Music') private musicModel: Model<Music>) { }

  // Hàm này được gọi từ MusicGateway để thiết lập server
  setSocketServer(server: Server) {
    this.server = server;
  }

  // Thêm bài hát
  async addSong(createMusicDto: CreateMusicDto): Promise<Music> {
    // Lấy thông tin thumbnail từ YouTube API
    const apiKey = process.env.YOUTUBE_API_KEY;
    const videoId = createMusicDto.videoId;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: apiKey,
      },
    });

    // Lấy URL của thumbnail
    const thumbnail = response.data.items[0].snippet.thumbnails.default.url;

    // Tạo đối tượng bài hát mới với thumbnail
    const newSong = new this.musicModel({
      ...createMusicDto,
      thumbnail,  // Thêm thumbnail vào dữ liệu bài hát
    });

    const savedSong = await newSong.save();

    if (this.server) {
      this.server.emit('songAdded', savedSong);  // Phát sự kiện qua WebSocket
    }

    return savedSong;
  }

  // Lấy danh sách hàng chờ
  async getQueue(): Promise<Music[]> {
    return this.musicModel.find().exec();
  }

  // Xóa bài hát
  async deleteSong(videoId: string): Promise<any> {
    const deletedSong = await this.musicModel.findOneAndDelete({ videoId }).exec();  // Xóa bài hát dựa trên videoId
    if (this.server) {
      this.server.emit('songDeleted', deletedSong);  // Phát sự kiện khi bài hát bị xóa
    }
    return deletedSong;
  }

  // Tìm kiếm bài hát
  async searchMusic(query: string): Promise<any> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: apiKey,
        type: 'video',
        maxResults: 10,
      },
    });
    return response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
  }
}
