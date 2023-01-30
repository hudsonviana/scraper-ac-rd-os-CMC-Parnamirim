const fs = require('fs');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const path = require('path');

const pathPdf = 'data';
const files = fs.readdirSync(pathPdf);
let acordaos = [];

async function exportResultsToExcel() {
  const sheetName = 'acordaos_cmc_parn';
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString().replace(/\//g, '');
  const timeString = currentDate.toLocaleTimeString().replace(/:/g, '');
  const fileName = `${sheetName}_${dateString}_${timeString}.xlsx`;
  const filePath = path.join(__dirname, fileName);
  
  var workbook = xlsx.utils.book_new();
  var worksheet = xlsx.utils.json_to_sheet(acordaos);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  try {
    xlsx.writeFile(workbook, filePath, { bookType: 'xlsx' });
  } catch (error) {
    console.log('Erro ao tentar salvar o arquivo:', error);
  }
}

async function extractDataFromPdf() {
  await Promise.all(files.map(async (file) => {

    let acordao = await new Promise(async (resolve, reject) => {
      await pdfParse(`${pathPdf}/${file}`).then((data) => {
        try {
          const dataText = data.text;
          // console.log(dataText);

          console.log('Lendo Arquivo: ', file);

          let nome_arquivo = file;

          let num_processo = /PROCESSO(.*?)\n/gi.exec(dataText)[1].trim().replace(/[^\d]/g, '').substring(0, 11);

          let num_acordao = dataText.includes('ACÓRDÃO') ?
            /ACÓRDÃO(.*)/gi.exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') == '' ?
              /ACÓRDÃO[\s\S]*Nº\s*(.*)/gi.exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') :
              /ACÓRDÃO(.*)/gi.exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') :
            dataText.includes('ACORDÃO') ?
              /ACORDÃO(.*)/gi.exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') :
              dataText.includes('O N. º') ?
                /O N. º(.*)/gi.exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') :
                dataText.includes('A C Ó R D Ã O') ?
                  /A\sC\sÓ\sR\sD\sÃ\sO(.*)/gi.exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') : 'ERRO::::';

          let tributo = 'N/D';
          const conditionsTrib = [
            { condition: dataText.includes('IPTU') || dataText.includes('71/2013'), tributo: 'IPTU' },
            { condition: dataText.includes('ITIV') || dataText.includes('ITBI') || dataText.includes('TRANSMISSÃO INTER'), tributo: 'ITBI' },
            { condition: dataText.includes('ISSQN') || dataText.includes('ISS  SUBSTITUTO') || dataText.includes('SERVIÇOS  DE  QUALQUER  NATUREZA') || dataText.includes('ISS SUBSTITUTO') || dataText.includes('ISS.') || dataText.includes(' ISS ') || dataText.includes('QN – SUBSTITUTO'), tributo: 'ISSQN' },
            { condition: dataText.includes('DMS') || dataText.includes('DECLARAÇÃO MENSAL DE SERVIÇOS') || dataText.includes('OBRIGAÇÃO ACESSÓRIA'), tributo: 'OBRIGAÇÃO ACESSÓRIA' },
            { condition: dataText.toLowerCase().includes('taxa ') || dataText.includes('ALVARÁ'), tributo: 'TAXAS' }
          ];

          conditionsTrib.forEach(c => {
            if (c.condition) {
              tributo = c.tributo;
              return;
            }
          });

          let resultado = dataText.toLowerCase().includes('improvido') ? 'IMPROVIDO' :
            dataText.toLowerCase().includes('desprovido') ? 'IMPROVIDO' :
              dataText.toLowerCase().includes('provido') ? 'PROVIDO' : 'NÃO CONHECIDO';

          let tipo_recurso = dataText.toLowerCase().includes('voluntário' || 'voluntario') ? 'RECURSO VOLUNTÁRIO' : 'RECURSO DE OFÍCIO';

          let data_julgamento = dataText.toLowerCase().includes('data de julgamento') ?
            /Julgamento\:(.*?)\./gi.exec(dataText)[1].trim() :
            dataText.includes('Data do julgamento') ?
              /julgamento\:(.*?)\./gi.exec(dataText)[1].trim() :
              /Parnamirim,\s(.*?)\./gi.exec(dataText)[1].trim();

          resolve({
            num_processo,
            num_acordao,
            tributo,
            tipo_recurso,
            resultado,
            data_julgamento,
            nome_arquivo
          });
        } catch (error) {
          console.log('Erro no arquivo:', file);
        }
      });
    });

    acordaos.push(acordao);
  }));

  console.log(acordaos);
  exportResultsToExcel();
}

extractDataFromPdf();
