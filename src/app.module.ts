import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true //ora possiamo utilizzare il suo servizione nell'intera app
      //stessa cosa di aggiungere il decoratore. Solo che qui non si può con esso.
    }), 
    AuthModule, 
    UserModule, 
    PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
