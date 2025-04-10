import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleValidateGuard extends AuthGuard("googleValidate") {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies["access_token"];
    console.log(accessToken);

    if (!accessToken) {
      throw new UnauthorizedException("Access token is missing in cookies");
    }

    // Lưu token vào request để strategy có thể lấy
    request.token = accessToken;

    // Gọi super.canActivate để tiếp tục đến GoogleValidateStrategy
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // Xử lý kết quả từ GoogleValidateStrategy
    if (err || !user) {
      throw err || new UnauthorizedException("Authentication failed");
    }
    return user;
  }
}
