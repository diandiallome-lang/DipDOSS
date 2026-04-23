import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfilesModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
