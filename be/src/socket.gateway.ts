import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody, OnGatewayInit
} from "@nestjs/websockets";

  import { Server, Socket  } from "socket.io";
  import { WebsocketService } from "./websocket/websocket.service";
  import { Injectable } from "@nestjs/common";


  @WebSocketGateway({

    cors: {
      origin: '*'
    }
  })
@Injectable()

export class SocketGateway  implements OnGatewayInit,    OnGatewayConnection, OnGatewayDisconnect{
    constructor(private websocketService: WebsocketService) {}

    @WebSocketServer()
    server: Server;

    afterInit() {
      console.log("Socket server initialized:", this.server);
      this.websocketService.setSocketServer(this.server);
    }

    @SubscribeMessage('videoShared')
    handleVideoSharedEvent(@MessageBody() data: any): void {
      this.server.emit('videoShared', data);
    }

    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
      this.websocketService.setSocketServer(this.server);
    }

    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
    }
}