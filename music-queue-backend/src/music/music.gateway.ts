import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MusicService } from './music.service';

@WebSocketGateway()
export class MusicGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    constructor(private musicService: MusicService) { }

    // Hàm này sẽ được gọi sau khi Gateway khởi tạo
    afterInit() {
        // Truyền server WebSocket vào MusicService
        this.musicService.setSocketServer(this.server);
    }
}
