const QRCode = require('qrcode');
const fs = require('fs');

const campaignId = process.argv[2];
if (!campaignId) {
  console.error('请传入活动ID');
  process.exit(1);
}

const url = `http://47.111.31.29/campaign/${campaignId}`;
QRCode.toFile(`qrcode-${campaignId}.png`, url, function (err) {
  if (err) throw err;
  console.log('二维码已生成:', `qrcode-${campaignId}.png`);
}); 