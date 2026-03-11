import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnippetsService } from './snippets/snippets.service';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [SnippetsModule],
  controllers: [AppController],
  providers: [AppService, SnippetsService],
})
export class AppModule {}
