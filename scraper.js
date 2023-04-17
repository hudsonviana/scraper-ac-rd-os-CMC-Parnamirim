const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function downloadPDFs(url) {
  console.time('Tempo de execução')
  console.log('Iniciando scraper...');
  const urlBase = 'https://parnamirim.rn.gov.br';
  const downloadPath = path.join(__dirname, 'acordãos_baixados');

  // Cria o diretório se ele ainda não existe
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }

  // Faz uma solicitação GET para a página
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extrai os links de arquivos PDF da página
  const pdfLinks = $('.pos_tr a[href$=".pdf"]').map((i, el) => $(el).attr('href')).get();
  
  // Faz solicitações GET para cada link e salva o arquivo
  for (const link of pdfLinks) {
    console.log(`Baixando ${pdfLinks.indexOf(link) + 1}/${pdfLinks.length} --> ${link}`);
    const fileName = link.split('/').pop().replace(/:/g, '.');
    const pdfResponse = await axios({
      url: `${urlBase}${link}`,
      method: 'GET',
      responseType: 'stream'
    });
    try {
      pdfResponse.data.pipe(fs.createWriteStream(path.join(downloadPath, fileName)));
    } catch (error) {
      console.log(error);
    }
  }
  console.log('Scraper finished!');
  console.timeEnd('Tempo de execução')
}

downloadPDFs('https://parnamirim.rn.gov.br/acordao.jsp');
