const axios = require('axios'); // Vamos remover axios depois, mas deixe por enquanto
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://edge.skybox.gg/u/demos/personal'; // URL do site

const fs = require('fs').promises; // Importe o módulo 'fs' para salvar o arquivo

async function scrapeData() {
    try {
        const browser = await puppeteer.launch(); // Abre um navegador Chromium
        const page = await browser.newPage(); // Abre uma nova página no navegador
        await page.goto(url); // Navega até a URL da página de demos (que redireciona para login)

        // **Login Skybox ID Steps**
        await page.waitForSelector('#email', { timeout: 30000 });
        await page.type('#email', 'pkzinfps@gmail.com');
        await page.waitForSelector('#password', { timeout: 30000 });
        await page.type('#password', 'R26WK!2rZKNBqtG');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 30000 });

        // **Verifica login Skybox ID bem-sucedido**
        await page.waitForSelector('a[aria-current="page"] span.font-brand', { timeout: 30000 });
        console.log('"Your Matches" encontrado! Login Skybox ID bem-sucedido.');

        // **Connect Steam Account Steps - ADICIONADO AGORA!**
        await page.waitForSelector('#steam', { timeout: 30000 }); // Espera o botão "Conectar com Steam"
        await page.click('#steam'); // Clica no botão "Conectar com Steam"

        // **AGORA VEM A PARTE MAIS COMPLICADA: LIDAR COM A JANELA POPUP DO STEAM**
        // ... (vamos adicionar o código para login no Steam no próximo passo) ...


        // Espera até que pelo menos uma linha de partida seja carregada na tabela
        await page.waitForFunction(() => {
            return document.querySelectorAll('tbody tr.leading-8').length > 0;
        }, { timeout: 60000 }); // Timeout de 60 segundos (voltei para 60s)


        const content = await page.content(); // Obtém o HTML *renderizado* da página
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