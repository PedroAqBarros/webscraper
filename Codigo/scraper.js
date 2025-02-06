const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://edge.skybox.gg/u/demos/personal'; // URL do site

const fs = require('fs').promises; // Importe o módulo 'fs' para salvar o arquivo


async function scrapeData() {
    try {
        const browser = await puppeteer.launch(); // Abre um navegador Chromium
        const page = await browser.newPage(); // Abre uma nova página no navegador
        await page.goto(url); // Navega até a URL

        // Espera a tabela de partidas carregar (seletor CSS da tabela)
        await page.waitForSelector('tbody tr.leading-8', { timeout: 60000 }); // Timeout aumentado para 60 segundos

        const content = await page.content(); // Obtém o HTML *renderizado* da página
        await browser.close(); // Fecha o navegador

        // Salva o HTML renderizado em um arquivo
        await fs.writeFile('pagina_renderizada.html', content);
        console.log('HTML renderizado salvo em pagina_renderizada.html');


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