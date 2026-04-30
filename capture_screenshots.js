const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'screenshots');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({ defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  
  // 1. Home Page
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(dir, 'home.png') });
  console.log('Saved home.png');

  // 2. Select Career
  await page.goto('http://localhost:3000/select-career', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(dir, 'select_career.png') });
  console.log('Saved select_career.png');

  // 3. Roadmap (Data Science)
  await page.goto('http://localhost:3000/roadmap?career=data-science', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(dir, 'roadmap.png') });
  console.log('Saved roadmap.png');

  // 4. Resume Analyzer
  await page.goto('http://localhost:3000/resume-analyzer', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(dir, 'resume_analyzer.png') });
  console.log('Saved resume_analyzer.png');

  await browser.close();
})();
