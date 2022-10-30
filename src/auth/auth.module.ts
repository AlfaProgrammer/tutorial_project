import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";

//in questo modulo utilizzo anche il modulo prisma, non lo vedi negli import xke quel modulo
// è disponibile globalmente. Questo mi permetti di usare il PrismaService anche in questo modulo.
@Module({
    imports:[JwtModule.register({/*ci andrebbe la secret*/})],
    controllers:[AuthController],
    providers: [AuthService, JwtStrategy],
    // imports: [PrismaModule]
})
export class AuthModule{};