const puppeteer = require('puppeteer');
const dir = __dirname + '/userdata';

async function scrapeData() {
    try {
        const browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: null,
            userDataDir: dir, 
        });
        const page = await browser.newPage();
        await page.goto('https://edge.skybox.gg/u/demos/personal', { waitUntil: "networkidle2" });

        // Ajustar o zoom para 80%
        await page.evaluate(() => {
            document.body.style.zoom = '80%';
        });

        // **Login Direto com Steam**
        if (await page.$('#steam')) { // Verifica se o botão existe
            await page.waitForSelector('#steam', { timeout: 60000 });
            await page.click('#steam'); // Clica no botão "Sign in with Steam"
            console.log('⏳ Aguardando você fazer o login MANUALMENTE na janela do Steam...'); // Mensagem para o usuário
            
            await page.waitForSelector('#imageLogin', { timeout: 60000 });
            await page.click('#imageLogin'); // Clica no botão de login
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        await page.waitForSelector('.h-fit > tr:nth-of-type(1)', { timeout: 60000 }); // Aguarda a tabela carregar completamente
        console.log('🔓 Login efetuado com sucesso!');

        // Captura os dados da primeira linha corretamente
        const rowData = await page.evaluate(() => {
            const firstRow = document.querySelector('.h-fit > tr:nth-of-type(1)');
            if (!firstRow) return null;

            return firstRow.innerText.replace(/\s+/g, ' ').trim(); // Limpa os espaços extras
        });

        if (rowData) {
            console.log('✅ Dados extraídos:', rowData);
        } else {
            console.log('⚠️ Nenhuma informação encontrada na linha da tabela.');
        }

// Clicar no link de estatísticas
const statsButtonSelector = '#text "Stats"';

// Aguarda o botão estar visível na tela
await page.waitForSelector(statsButtonSelector, { timeout: 60000 });

// Role a página para o botão ficar visível
await page.evaluate((selector) => {
    const button = document.querySelector(selector);
    if (button) {
        button.scrollIntoView();
    }
}, statsButtonSelector);

// Tenta clicar no botão de estatísticas usando `page.evaluate()`
await page.evaluate((selector) => {
    const button = document.querySelector(selector);
    if (button) {
        button.click();
    }
}, statsButtonSelector);

console.log('📊 Navegando para a página de estatísticas...');

        
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

scrapeData();
