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
  handleWebcamFrame(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received webcam frame from ${client.id}`);
    // return;
    // Create request object for gRPC service
    const request: CuffDetectionRequest = {
      base64Image: data,
      threshold: 0.5, // You can adjust this threshold as needed
    };

    // Call detectCuffPosition with the request
    this.aiService.detectCuffPosition(request).subscribe({
      next: (response) => {
        console.log(`Received detection response: ${JSON.stringify(response)}`);
        client.emit("cuff-detection-result", response);
      },
      error: (error) => {  
        console.error("gRPC Error:", error.message);
        client.emit("cuff-detection-error", { error: error.message });
      },
      complete: () => { 
        console.log("gRPC call completed.");
      },
    });
  }
}
