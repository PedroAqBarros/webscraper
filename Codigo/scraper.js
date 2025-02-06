const axios = require('axios'); // Vamos remover axios depois, mas deixe por enquanto
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://edge.skybox.gg/u/demos/personal'; // URL do site

const fs = require('fs').promises; // Importe o módulo 'fs' para salvar o arquivo

async function scrapeData() {
    try {
        const browser = await puppeteer.launch({ headless: false }); // **headless: false - Abre navegador VISÍVEL!**
        const page = await browser.newPage(); // Abre uma nova página no navegador
        await page.goto(url); // Navega até a URL da página de demos (que redireciona para login)

        // **Login Direto com Steam**
        await page.waitForSelector('#steam', { timeout: 30000 });
        await page.click('#steam'); // Clica no botão "Sign in with Steam"

        // **Login Steam Popup - ADICIONADO AGORA!**
        const steamPopup = await new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))); // Espera a janela popup do Steam abrir
        await steamPopup.waitForSelector('input[type="text"]._2GBWeup5cttgbTw8FM3tfx', { timeout: 60000 }); // Espera o campo de username do Steam
        await steamPopup.type('input[type="text"]._2GBWeup5cttgbTw8FM3tfx', 'pedromatou'); // **Digite seu username do Steam AQUI!**

        await steamPopup.waitForSelector('input[type="password"]._2GBWeup5cttgbTw8FM3tfx', { timeout: 30000 }); // Espera o campo de senha do Steam
        await steamPopup.type('input[type="password"]._2GBWeup5cttgbTw8FM3tfx', '@@8!YX!M7PXF'); // **Digite sua senha do Steam AQUI!**

        await steamPopup.click('button.DjSvCZoKKfoNSmarsEcTS[type="submit"]'); // Clica no botão "Entrar" do Steam
        // await steamPopup.waitForNavigation({ timeout: 60000 }); // **NÃO PRECISA ESPERAR NAVEGAÇÃO NA JANELA DO POPUP** - O redirecionamento acontece na página principal


        await page.waitForNavigation({ timeout: 120000 }); // **Espera a página principal recarregar/navegar APÓS LOGIN DO STEAM!** (Timeout aumentado para 120s)


        // **Verifica login bem-sucedido esperando pelo título "Your Matches"**
        await page.waitForSelector('a[aria-current="page"] span.font-brand', { timeout: 30000 });
        console.log('"Your Matches" encontrado! Login Steam (direto) bem-sucedido.');

        const currentURL = page.url(); // **Pega a URL atual**
        console.log('URL após login:', currentURL); // **Imprime a URL no console**


        const content = await page.content(); // Obtém o HTML *renderizado* da página

        // Salva o HTML renderizado em um arquivo (para debug - pode remover depois)
        // await fs.writeFile('pagina_renderizada_pos_login_steam.html', content);
        // console.log('HTML renderizado após login Steam salvo em pagina_renderizada_pos_login_steam.html');


        // Agora que estamos logados, espera a tabela de partidas carregar
        await page.waitForSelector('tbody tr.leading-8', { timeout: 60000 }); // Timeout de 60 segundos (voltei para 60s)


        await browser.close(); // Fecha o navegador


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