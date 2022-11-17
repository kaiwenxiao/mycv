import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 这里的中间件，应该放到对应的moudule下，不然比如service的e2e-test不能够自动读取
  // 移动到app.module.ts下
  setupApp(app);
  await app.listen(3000);
}
bootstrap();
