import 'dotenv/config';
import ossClient from './oss';
import fs from 'fs';

async function testOSS() {
  const localFile = './test.txt';
  if (!fs.existsSync(localFile)) {
    fs.writeFileSync(localFile, 'OSS自动化测试文件');
  }
  try {
    const result = await ossClient.put('test-oss.txt', localFile);
    console.log('上传成功，文件URL:', result.url);
    process.exit(0);
  } catch (e) {
    console.error('OSS上传失败:', e);
    process.exit(1);
  }
}

testOSS(); 