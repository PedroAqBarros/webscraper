const axios = require('axios'); // Vamos remover axios depois, mas deixe por enquanto
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://edge.skybox.gg/u/demos/personal'; // URL do site

async function scrapeData() {
    try {
        const browser = await puppeteer.launch(); // Abre um navegador Chromium
        const page = await browser.newPage(); // Abre uma nova página no navegador
        await page.goto(url); // Navega até a URL da página de demos (que redireciona para login)

        // **Login Steps - Adicionado agora!**
        await page.waitForSelector('#email'); // Espera o campo de email aparecer
        await page.type('#email', 'pkzinfps@gmail.com'); // Digita seu email

        await page.waitForSelector('#password'); // Espera o campo de senha aparecer
        await page.type('#password', 'R26WK!2rZKNBqtG'); // Digita sua senha

        await page.click('button[type="submit"]'); // Clica no botão "Login with Skybox ID"

        await page.waitForNavigation(); // **Espera a página recarregar/navegar após o login!**


        // Agora que estamos logados, espera a tabela de partidas carregar
        await page.waitForSelector('tbody tr.leading-8', { timeout: 60000 }); // Timeout aumentado para 60 segundos

        const content = await page.content(); // Obtém o HTML *renderizado* da página
        await browser.close(); // Fecha o navegador

        // Salva o HTML renderizado em um arquivo (para debug - pode remover depois)
        // await fs.writeFile('pagina_renderizada_pos_login.html', content);
        // console.log('HTML renderizado após login salvo em pagina_renderizada_pos_login.html');


        const $ = cheerio.load(content);
        const matches = [];

        const firstRow = $('tbody tr.leading-8').first(); // Seleciona a primeira linha da tabela

        if (firstRow.length) { // Verifica se a primeira linha existe (tabela não vazia)
            const map = firstRow.find('td:nth-child(1) span.font-brand span span').text();
            const date = firstRow.find('td:nth-child(2) div').text();

            matches.push({
                map: map,
                date: date,
            });
        }

        console.log('Partida mais recente encontrada:', matches);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

scrapeData();