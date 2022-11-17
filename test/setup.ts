import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (e) {}
});
// 删除sqlite需要关闭连接，未关闭则此时typeorm仍在维护这个连接，第二次执行生产test.sqlite文件会报错
global.afterEach(async () => {
  const conn = await getConnection();
  await conn.close();
});
