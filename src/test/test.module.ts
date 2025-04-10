import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { TestGateway } from "./test.gateway";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CUFF_DETECTION_SERVICE_NAME } from "proto/service";
import { join } from "path";

@Module({
  providers: [TestGateway],
  imports: [
    ClientsModule.register([
      {
        name: CUFF_DETECTION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: "cuff_detection",
          protoPath: join(__dirname, "../../../proto/service.proto"), // Đường dẫn đúng
          url: "localhost:50051", // Quan trọng: Listen trên tất cả interfaces
        },
      },
    ]),
  ],
})
export class TestModule {}
