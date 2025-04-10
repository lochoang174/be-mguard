import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  path: "/socket.io/",
  transports: ["websocket", "polling"],
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() body: { id: string; message: string },

    @ConnectedSocket() client: Socket
  ) {
    console.log(`Received message from client ${client.id}: ${body.message}`);

    // Danh sách các câu trả lời giả
    const fakeResponses = [
      "Xin chào! Tôi có thể giúp gì cho bạn?",
      "Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ phản hồi sớm.",
      "Thật thú vị! Bạn có thể chia sẻ thêm chi tiết không?",
      "Tôi hiểu vấn đề của bạn. Đây là một số giải pháp có thể giúp bạn.",
      "Rất vui được trò chuyện với bạn hôm nay!"
    ];

    // Chờ 4 giây
    setTimeout(() => {
      // Chọn một câu trả lời ngẫu nhiên
      const randomIndex = Math.floor(Math.random() * fakeResponses.length);
      const response = fakeResponses[randomIndex];

      // Gửi câu trả lời về client
      client.emit('messageResponse', {
        id: body.id,
        text: response,
        timestamp: new Date(),
        fromServer: true
      });

      console.log(`Sent response to client ${client.id}: ${response}`);
    }, 1000);

    // Gửi thông báo nhận tin nhắn ngay lập tức
    return { received: true };
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
    return { joined: true, room };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
    return { left: true, room };
  }
}