import { from, Observable } from "rxjs";
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CUFF_DETECTION_SERVICE_NAME, CuffDetectionServiceClient, CuffDetectionRequest } from "proto/service";
import { Inject } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  path: "/socket.io/",
  transports: ["websocket", "polling"],
})
export class TestGateway {
  @WebSocketServer()
  server: Server;
  private aiService: CuffDetectionServiceClient;
  
  @Inject(CUFF_DETECTION_SERVICE_NAME) 
  private client: ClientGrpc;

  onModuleInit() {
    this.aiService = this.client.getService<CuffDetectionServiceClient>(CUFF_DETECTION_SERVICE_NAME);
  }

  constructor() {}

  // Xử lý khi client kết nối
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Xử lý khi client ngắt kết nối
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Xử lý webcam streaming từ frontend
  @SubscribeMessage("webcam-frame")
  handleWebcamFrame(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`Received webcam frame from ${client.id}`);
    
    // Tạo một Observable stream từ dữ liệu ảnh gửi lên
    // console.log(data[0])
    // const request$: Observable<CuffDetectionRequest> = from([{ base64Image: data }]);

    // // Gọi detectCuffPosition với Observable stream
    // const responseStream = this.aiService.detectCuffPosition(request$);

    // // Lắng nghe dữ liệu trả về từ AI service
    // responseStream.subscribe({
    //   next: (response) => {
    //     console.log(`Received streaming response: ${JSON.stringify(response)}`);
    //     client.emit("cuff-detection-result", response); 
    //   }, 
    //   error: (error) => {  
    //     console.error("gRPC Error:", error.message);  
    //     client.emit("cuff-detection-error", { error: error.message });
    //   },
    //   complete: () => {
    //     console.log("gRPC streaming ended.");
    //     client.emit("cuff-detection-end", { message: "Streaming ended." });
    //   },
    // });

    return { event: "webcam-frame-received", data: { success: true } };
  }
}
