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
      await pdfParse(`${pathPdf}/${file}`).then(function (data) {
        const DataText = data.text;
        // console.log(DataText);

        console.log('Lendo Arquivo: ', file);

        let arquivo = file;
        
        let processo = /PROCESSO(.*?)\n/gi.exec(DataText)[1].trim().replace(/[^\d]/g, '').substring(0, 11);

        let num_acordao = DataText.includes('ACÓRDÃO') ? 
          /ACÓRDÃO(.*)/gi.exec(DataText)[1].trim().replace(/[^0-9\/]/g, '') == '' ? 
          /ACÓRDÃO[\s\S]*Nº\s*(.*)/gi.exec(DataText)[1].trim().replace(/[^0-9\/]/g, '') : 
          /ACÓRDÃO(.*)/gi.exec(DataText)[1].trim().replace(/[^0-9\/]/g, '') :
          DataText.includes('ACORDÃO') ? 
          /ACORDÃO(.*)/gi.exec(DataText)[1].trim().replace(/[^0-9\/]/g, '') :
          DataText.includes('O N. º') ? 
          /O N. º(.*)/gi.exec(DataText)[1].trim().replace(/[^0-9\/]/g, '') :
          DataText.includes('A C Ó R D Ã O') ? 
          /A\sC\sÓ\sR\sD\sÃ\sO(.*)/gi.exec(DataText)[1].trim().replace(/[^0-9\/]/g, '') : 'ERRO::::'
        ;
        
        let tributo = 'N/D';
        const conditionsTrib = [
          { condition: DataText.includes('IPTU') || DataText.includes('71/2013'), tributo: 'IPTU' },
          { condition: DataText.includes('ITIV') || DataText.includes('ITBI') || DataText.includes('TRANSMISSÃO INTER'), tributo: 'ITBI' },
          { condition: DataText.includes('ISSQN') || DataText.includes('ISS  SUBSTITUTO') || DataText.includes('SERVIÇOS  DE  QUALQUER  NATUREZA') || DataText.includes('ISS SUBSTITUTO') || DataText.includes('ISS.') || DataText.includes(' ISS ') || DataText.includes('QN – SUBSTITUTO'), tributo: 'ISSQN' },
          { condition: DataText.includes('DMS') || DataText.includes('DECLARAÇÃO MENSAL DE SERVIÇOS') || DataText.includes('OBRIGAÇÃO ACESSÓRIA'), tributo: 'OBRIGAÇÃO ACESSÓRIA' },
          { condition: DataText.toLowerCase().includes('taxa ') || DataText.includes('ALVARÁ'), tributo: 'TAXAS' }
        ];
        
        conditionsTrib.forEach(c => {
          if (c.condition) {
            tributo = c.tributo;
            return;
          }
        });

        let resultado = DataText.toLowerCase().includes('improvido') ? 'IMPROVIDO' : 
        DataText.toLowerCase().includes('desprovido') ? 'IMPROVIDO' : 
        DataText.toLowerCase().includes('provido') ? 'PROVIDO' : 'NÃO CONHECIDO';

        let tipo_recurso = DataText.toLowerCase().includes('voluntário' || 'voluntario') ? 'RECURSO VOLUNTÁRIO' : 'RECURSO DE OFÍCIO';

        let data_julgamento = DataText.toLowerCase().includes('data de julgamento') ?
        /Julgamento\:(.*?)\./gi.exec(DataText)[1].trim() :
        DataText.includes('Data do julgamento') ? 
        /julgamento\:(.*?)\./gi.exec(DataText)[1].trim() :
        /Parnamirim,\s(.*?)\./gi.exec(DataText)[1].trim();
        
        try {
          resolve({
            processo,
            num_acordao,
            tributo,
            tipo_recurso,
            resultado,
            data_julgamento,
            arquivo
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
