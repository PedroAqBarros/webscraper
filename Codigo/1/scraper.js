const puppeteer = require('puppeteer');

async function scrapeData() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://edge.skybox.gg/u/demos/personal', { waitUntil: "networkidle2" });

        // **Login Direto com Steam**
        await page.waitForSelector('#steam');
        await page.click('#steam'); // Clica no botão "Sign in with Steam"
        console.log('⏳ Aguardando você fazer o login MANUALMENTE na janela do Steam...'); // Mensagem para o usuário
        await page.waitForNavigation({ url: 'https://steamcommunity.com/openid/login?openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.realm=https%3A%2F%2Fsteam.id.skybox.gg&openid.return_to=https%3A%2F%2Fsteam.id.skybox.gg%2Fopenid%2Freturn%3Fstate%3DeyJhbGciOiJSUzI1NiIsImtpZCI6IllIbkxpVHJ1djQ0QmI4dC1YaGxEVWcifQ.eyJjbGllbnRfaWQiOiI0T0Ztd1Q0NmUwZW1jc0NzN2JWcFZHMkRnckpjekhyRyIsImV4cCI6MTczODg4MjY5NCwicmVkaXJlY3RfdXJpIjoiaHR0cHM6Ly9hdXRoLmlkLnNreWJveC5nZy9vYXV0aDIvaWRwcmVzcG9uc2UiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIiwic3RhdGUiOiJINHNJQUFBQUFBQUFBRjJTM1pLaU1CQ0YzNFhyWVpURUJQQnVGa3ZFQVZGVUVMYTJMRWpDbnlBSUFZZmQybmZmZUxWVmNfZFZjcnB6VG5mLVNMRzBsTmdnRTNiblhWekp5clhNUEV5RGNBeWtOeWtSbDBmTzRsb3dFYXowZmZ6Z0NNTUg2bkhhemZVeUgwaVc4WTRLQVJXQ25QTzJYODVtakdic3ZiOU5TZlAxbm1XekpoNTREbVlkNDBOM0YxSW1wS1NoVEdBcTBMVldoc0JNV3Y2VW1wYmRpMWU3dG12U29tTFNyemNwZjNtY3RpMkJPeVc2V0lWYmJCdTY4WjdrZHpQYVlEZEdBTFhVMUhnY2VFLTc5aFU3MkZYSjNadkM0TW1kSThxVFlJMFRnSElLblNFRU9yZkJONDJ2UHlMRkF0R2FSclFpaFcxc3B5andXbEw3SlYzckNxbHYzOTcwYnhFNER3UndGTmI2d3E3cDNZYm5NVEo5bmtCbkpLWV9FYUFQb25lUkhrU1dRZ1NnVm54ZGJPREpYM1J6M3QzQ1MzQzlBbXc0WFhmR202T0hwdzJxbEtoOHlOR3JvbnhOSGlBczhDWndLbzJrT2F4OTdLWFQzSzJHbmFGQzB6NlpIOFpHUG1DeWJvOUFwR3NqZGpjODdyVzVmQ1p3ZTlsOWZmcHFPb1RXajFHR1VlUHl4TzJmRkl6SXdkN2F6eEZiNlNXZlY2ZlZSekoyUHNKZlBIUXpEWnRzdjJmb3VobEcta0JhLVZ5aGc3S3JUOVppdUp5c19SaVByZWM2VTRNX1NidDF1cjNLTWpOTnVhb245aW83WnNKeEpSeV9OdjVlMFAtZlFKelgwbEpSb2FacGlxcERzV0ZwbWNaVno5NmtUaFNnV0NNeFRGUVo2d2pJaTNtc3lkcWNZVmxKVkRXRnFhNWhHRXRfX3dGZHR2Y0NzUUlBQUEuSDRzSUFBQUFBQUFBQU91NTdzU1hfOTlITjNwUEVwdW9leFAzcDV4S1U5WUx0OWZWWFY3ejlSX0R2bVVBNnpDNk1DQUFBQUEuMyJ9.YaXiOFDQ3uF_QFXN-zmPOycrJk-mfv4zII5NBeE8jHcmFQIhlNeyqzC5gUvoYo619Kaqz4X_8QyCcJ0u7MpWQFDHvAFm5zqvvwOttUTL5ELI7KvsAiCwMZ0Q6NxRRtxqW-0mNPhF5iCTcI0QkBOQZSNttMxUBOBDQzArSN5E5VWVNYFMH-i2nTXRWT_TvERikrHNaINk99keROBfZyZF7KVwwzJXbIfx2iIOs_YodXnsHDnDNDRU5FJAmSr_HQL54YqP2Z9xZur0Fe1gXgcFNDrqRbUSXnx8r-JieSOGO2G7fq4oADSyZ8yevlJy0z8Cmv2kt0Aq_F0N7tFMaxBVfQ'})
        await page.click ('#imageLogin') // Clica no botão de login
        await new Promise(resolve => setTimeout(resolve, 5000));
        await page.waitForNavigation({ url: 'https://edge.skybox.gg/u/demos/personal', timeout: 30000 }); // **ESPERA DIRETAMENTE O URL DA PAGINA DE DEMOS!**
        console.log('🔓 Login efetuado com sucesso!'); // Mensagem para o usuário


        // Aguarda a tabela carregar completamente
        await page.waitForSelector('.h-fit > tr:nth-of-type(1)', { timeout: 10000 });

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

       
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

scrapeData();
