const fs = require('fs');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const path = require('path');

const pathPdf = 'data';
const files = fs.readdirSync(pathPdf);
let judgments = [];

async function exportResultsToExcel() {
  const sheetName = 'acordaos_cmc_parn';
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString().replace(/\//g, '');
  const timeString = currentDate.toLocaleTimeString().replace(/:/g, '');
  const fileName = `${sheetName}_${dateString}_${timeString}.xlsx`;
  const filePath = path.join(__dirname, fileName);

  var workbook = xlsx.utils.book_new();
  var worksheet = xlsx.utils.json_to_sheet(judgments);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  try {
    xlsx.writeFile(workbook, filePath, { bookType: 'xlsx' });
  } catch (error) {
    console.log('Erro ao tentar salvar o arquivo:', error);
  }
}

async function extractData(dataText, file) {
  console.log('Lendo Arquivo: ', file);

  let nome_arquivo = file;

  let num_processo = /PROCESSO(.*?)\n/gi.exec(dataText)[1].trim().replace(/[^\d]/g, '').substring(0, 11);

  let num_acordao = 'N/D';
  const judgmentTargets = ['ACÓRDÃO', 'ACORDÃO', 'ACORDAO', 'A C Ó R D Ã O', 'O N. º'];
  for (const judgmentTarget of judgmentTargets) {
    if (dataText.includes(judgmentTarget)) {
      num_acordao =
        new RegExp(`${judgmentTarget}(.*)`, 'gi').exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') ||
        new RegExp(`${judgmentTarget}(.*)`, 'gs').exec(dataText)[1].trim().replace(/[^0-9\/]/g, '');
      break;
    }
  }

  let tributo = 'N/D';
  const taxConditions = [
    { condition: dataText.includes('IPTU') || dataText.includes('71/2013'), tributo: 'IPTU' },
    { condition: dataText.includes('ITIV') || dataText.includes('ITBI') || dataText.includes('TRANSMISSÃO INTER'), tributo: 'ITBI' },
    { condition: dataText.includes('ISSQN') || dataText.includes('ISS  SUBSTITUTO') || dataText.includes('SERVIÇOS  DE  QUALQUER  NATUREZA') || dataText.includes('ISS SUBSTITUTO') || dataText.includes('ISS.') || dataText.includes(' ISS ') || dataText.includes('QN – SUBSTITUTO'), tributo: 'ISSQN' },
    { condition: dataText.includes('DMS') || dataText.includes('DECLARAÇÃO MENSAL DE SERVIÇOS') || dataText.includes('OBRIGAÇÃO ACESSÓRIA'), tributo: 'OBRIGAÇÃO ACESSÓRIA' },
    { condition: dataText.toLowerCase().includes('taxa ') || dataText.includes('ALVARÁ'), tributo: 'TAXAS' }
  ];
  taxConditions.forEach(c => {
    if (c.condition) {
      tributo = c.tributo;
      return;
    }
  });

  // let resultado_recurso = dataText.toLowerCase().includes('improvido') ? 'IMPROVIDO' :
  //   dataText.toLowerCase().includes('desprovido') ? 'IMPROVIDO' :
  //   dataText.toLowerCase().includes('parcialmente provido') ? 'PARCIALMENTE PROVIDO' :
  //   dataText.toLowerCase().includes('provido') ? 'PROVIDO' : 'NÃO CONHECIDO';

  // const appealResultTargets = /IMPROVIDO|DESPROVIDO|PARCIALMENTE PROVIDO|PROVIDO/gi;
  // let resultado_recurso = appealResultTargets.test(dataText) ? 
  // dataText.match(appealResultTargets)[0] === 'DESPROVIDO' ? 'IMPROVIDO' : dataText.toUpperCase().match(appealResultTargets)[0] : 'NÃO CONHECIDO';

  const appealResultTargets = /IMPROVIDO|DESPROVIDO|PARCIALMENTE PROVIDO|PROVIDO/gi;
  let resultado_recurso = appealResultTargets.test(dataText) ?
    dataText.toUpperCase().match(appealResultTargets)[0].replace(/DESPROVIDO/gi, 'IMPROVIDO') : 'NÃO CONHECIDO';

  // let tipo_recurso = dataText.toLowerCase().includes('voluntário' || 'voluntario') ? 'RECURSO VOLUNTÁRIO' : 'RECURSO DE OFÍCIO';

  let tipo_recurso = /RECURSO VOLUNT(ÁRIO|ARIO)/i.test(dataText) ? 'RECURSO VOLUNTÁRIO' : 'RECURSO DE OFÍCIO';

  let data_julgamento = dataText.toLowerCase().includes('data de julgamento') ?
    /Julgamento\:(.*?)\./gi.exec(dataText)[1].trim() :
    dataText.includes('Data do julgamento') ?
      /julgamento\:(.*?)\./gi.exec(dataText)[1].trim() :
      /Parnamirim,\s(.*?)\./gi.exec(dataText)[1].trim();

  judgments.push({
    num_processo,
    num_acordao,
    tributo,
    tipo_recurso,
    resultado_recurso,
    data_julgamento,
    nome_arquivo
  });
}

async function getDataTextFromPdf() {
  await Promise.all(files.map(async (file) => {
    await pdfParse(`${pathPdf}/${file}`).then(async (data) => {
      const dataText = data.text;
      // console.log(dataText);
      await extractData(dataText, file);
    });
  }));
  console.log(judgments);
  await exportResultsToExcel();
}

getDataTextFromPdf();
