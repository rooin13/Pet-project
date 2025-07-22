// const fs = require('fs');
// const path = require('path');
// const https = require('https');
// const sharp = require('sharp');
// const readline = require('readline');
// const { URL } = require('url');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const downloadDir = 'downloaded_images';
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const MIN_FILE_SIZE = 2000;
const MAX_SEQUENTIAL = 4;
const TIMEOUT = 10000; // 10 секунд таймаут

// Конфиг для HTTPS запросов
const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
  timeout: TIMEOUT
});

async function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      agent: httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.logitech.com/'
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function downloadAndConvert(url) {
  try {
    const fileName = path.basename(url).split('?')[0];
    const fileExt = path.extname(fileName).toLowerCase();
    const baseName = path.basename(fileName, fileExt);
    const pngPath = path.join(downloadDir, `${baseName}.png`);

    console.log(`Скачиваю: ${url}`);
    const imageBuffer = await downloadFile(url);

    if (imageBuffer.length < MIN_FILE_SIZE) {
      console.log(`Пропускаем: слишком маленький размер (${imageBuffer.length} байт)`);
      return false;
    }

    if (fileExt !== '.png') {
      console.log(`Конвертирую в PNG...`);
      await sharp(imageBuffer).toFile(pngPath);
    } else {
      fs.writeFileSync(pngPath, imageBuffer);
    }

    console.log(`Успешно: ${pngPath} (${imageBuffer.length} байт)`);
    return true;
  } catch (error) {
    console.error(`Ошибка: ${url} - ${error.message}`);
    return false;
  }
}

function findImageNumber(url) {
  // Ищем последнюю последовательность цифр перед расширением
  const matches = url.match(/(\d+)(?=[^/]*\.[a-z]+$)/i);
  if (!matches) return null;
  
  return {
    number: parseInt(matches[1]),
    prefix: url.substring(0, matches.index),
    suffix: url.substring(matches.index + matches[1].length)
  };
}

async function downloadSequentialImages(baseUrl) {
  const numberInfo = findImageNumber(baseUrl);
  if (!numberInfo) {
    console.log('Не найден номер, скачиваю только указанный файл');
    await downloadAndConvert(baseUrl);
    return;
  }

  let successCount = 0;
  
  for (let i = 0; i < MAX_SEQUENTIAL; i++) {
    const currentNumber = numberInfo.number + i;
    const nextUrl = `${numberInfo.prefix}${currentNumber}${numberInfo.suffix}`;
    
    const success = await downloadAndConvert(nextUrl);
    if (success) successCount++;
    
    // Прерываем если 2 неудачи подряд (кроме первого файла)
    if (!success && i > 0) {
      const nextSuccess = await downloadAndConvert(nextUrl); // Повторная попытка
      if (!nextSuccess) break;
      successCount++;
    }
  }

  console.log(`Скачано ${successCount} изображений`);
}

function askForLinks() {
  rl.question('Введите ссылки (разделяйте пробелом, "exit" для выхода):\n', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const urls = input.split(/\s+/).filter(url => url.trim() !== '');

    for (const url of urls) {
      await downloadSequentialImages(url);
    }

    askForLinks();
  });
}

console.log('Улучшенный скачиватель изображений');
console.log('--------------------------------');
console.log(`Минимальный размер: ${MIN_FILE_SIZE} байт`);
console.log(`Таймаут: ${TIMEOUT/1000} сек`);
askForLinks();

rl.on('close', () => {
  console.log('Готово');
  process.exit(0);
});