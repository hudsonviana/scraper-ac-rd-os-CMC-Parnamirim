const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function downloadPDFs(url) {
  const urlBase = 'https://www.parnamirim.rn.gov.br';

  // Faz uma solicitação GET para a página
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Extrai os links de arquivos PDF da página
  const pdfLinks = $('.pos_tr a[href$=".pdf"]').map((i, el) => $(el).attr('href')).get();
  
  // Faz solicitações GET para cada link e salva o arquivo
  for (const link of pdfLinks) {
    const pdfResponse = await axios({
      url: `${urlBase}${link}`,
      method: 'GET',
      responseType: 'stream'
    });
    try {
      pdfResponse.data.pipe(fs.createWriteStream(link.split('/').pop().replace(/:/g, '.')));
    } catch (error) {
      console.log(error);
    }
  }
}

downloadPDFs('https://www.parnamirim.rn.gov.br/acordao.jsp');
