import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { WebsocketService } from '../websocket/websocket.service';
import { WebsocketModule } from '../websocket/websocke.module';

@Module({
    imports: [WebsocketModule],
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class SocketModule {}
