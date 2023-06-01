const fs = require('fs');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const path = require('path');

const pathPdf = 'acordãos_baixados';
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

function extractFileName(file) {
  return file;
}

function extractProcessNumber(dataText) {
  const processNumber = /PROCESSO(.*?)\n/gi.exec(dataText)[1].trim().replace(/[^\d]/g, '').substring(0, 11) || 'N/D';
  return processNumber;
}

function extractJudgmentNumber(dataText) {
  let judgmentNumber = 'N/D';
  const judgmentNumberTargets = ['ACÓRDÃO', 'ACORDÃO', 'ACORDAO', 'A C Ó R D Ã O', 'O N. º'];
  for (const judgmentNumberTarget of judgmentNumberTargets) {
    if (dataText.includes(judgmentNumberTarget)) {
      judgmentNumber =
        new RegExp(`${judgmentNumberTarget}(.*)`, 'gi').exec(dataText)[1].trim().replace(/[^0-9\/]/g, '') ||
        new RegExp(`${judgmentNumberTarget}(.*)`, 'gs').exec(dataText)[1].trim().replace(/[^0-9\/]/g, '');
      break;
    }
  }
  return judgmentNumber;
}

function extractTaxObligation(dataText) {
  let taxObligation = 'N/D';
  const taxTargets = [
    { condition: dataText.includes('IPTU') || dataText.includes('71/2013'), taxObligation: 'IPTU' },
    { condition: dataText.includes('ITIV') || dataText.includes('ITBI') || dataText.includes('TRANSMISSÃO INTER'), taxObligation: 'ITBI' },
    { condition: dataText.includes('ISSQN') || dataText.includes('ISS  SUBSTITUTO') || dataText.includes('SERVIÇOS  DE  QUALQUER  NATUREZA') || dataText.includes('ISS SUBSTITUTO') || dataText.includes('ISS.') || dataText.includes(' ISS ') || dataText.includes('QN – SUBSTITUTO'), taxObligation: 'ISSQN' },
    { condition: dataText.includes('DMS') || dataText.includes('DECLARAÇÃO MENSAL DE SERVIÇOS') || dataText.includes('OBRIGAÇÃO ACESSÓRIA'), taxObligation: 'OBRIGAÇÃO ACESSÓRIA' },
    { condition: dataText.toLowerCase().includes('taxa ') || dataText.includes('ALVARÁ'), taxObligation: 'TAXAS' }
  ];
  taxTargets.forEach(taxTarget => {
    if (taxTarget.condition) {
      taxObligation = taxTarget.taxObligation;
      return;
    }
  });
  return taxObligation;
}

function extractAppealType(dataText) {
  const appealTypeTargets = /RECURSO VOLUNT(ÁRIO|ARIO)|RECURSO\s+VOLUNT(ÁRIO|ARIO)|RECURSO DE\s+VOLUNTÁRIO/gi;
  const appealType = appealTypeTargets.test(dataText) ? 'RECURSO VOLUNTÁRIO' : 'RECURSO DE OFÍCIO';
  return appealType;
}

function extractAppealResult(dataText) {
  const appealResultTargets = /IMPROVIDO|DESPROVIDO|PARCIALMENTE PROVIDO|PARCIALMENTE\s+PROVIDO|PROVIDO|JULGAR EXTINTO/gi;
  const appealResult = appealResultTargets.test(dataText) ?
    dataText.toUpperCase().match(appealResultTargets)[0].replace(/DESPROVIDO/gi, 'IMPROVIDO').replace(/JULGAR EXTINTO/gi, 'EXTINTO') : 'NÃO CONHECIDO';
  return appealResult;
}

function extractJudgmentDate(dataText) {
  const judgmentDateTargets = /(Data de julgamento|Data do julgamento|Parnamirim,)(.*?)\./gi;
  const judgmentDate = judgmentDateTargets.exec(dataText)?.[2].trim().replace(/^\s*:\s*/, '') || 'N/D';
  return judgmentDate;
}

function extractAppellant(dataText) {
  const appellantTargets = /(RECORRENTE|EMBARGANTE)(.*?)\n/gi;
  const result = appellantTargets.exec(dataText);
  if (!result) return 'N/D';
  const appellant = result[2].toUpperCase().replace(/: |:.|\/RECORRIDA|\/RECORRIDO/g, '').replace(/(\(VOLUNTÁRIO\)|\(EMBARGO DECLARATÓRIO\)|\(EMBARGO|\(EX-OFFÍCIO\))/g, '').trim().replace(/\.$|\/$/, '').trim();
  return appellant;
}

function extractAppellee(dataText) {
  const appelleeTargets = /(RECORRIDO\(A\)|RECORRIDO|RECORRIDA|EMBARGADO|EMBARGADA)(.*?)\n/gi;
  const result = appelleeTargets.exec(dataText);
  if (!result) return 'N/D';
  const appellee = result[2].toUpperCase().replace(/: |:.|\/RECORRENTE/g, '').replace(/(\(VOLUNTÁRIO\)|\(EMBARGO\)|\(EX-OFFÍCIO\))/g, '').trim().replace(/\.$|\/$/, '').trim();
  return appellee;
}

function extractReporter(dataText) {
  const reporterTargets = /(RELATOR\(A\)|RELATORA|RELATOR)(.*?)\n/gi;
  const result = reporterTargets.exec(dataText);
  if (!result) return 'N/D';
  const reporter = result[2].toUpperCase().replace(/CONSELHEIRO|CONSELHEIRA|PARA O VOTO|P\/ VOTO|: |\./gi, '').trim();
  return reporter;
}

function extractDecisionComposition(dataText) {
  const decisionCompositionTargets = /UNANIMEMENTE|UNANIMIDADE|ACORDAM  A  MAIORIA|POR MAIORIA|POR\s+MAIORIA/gi;
  const decisionComposition = decisionCompositionTargets.test(dataText) ?
  dataText.toUpperCase().match(decisionCompositionTargets)[0].replace(/  /g, ' ').replace('UNANIMEMENTE', 'UNANIMIDADE').replace('ACORDAM A', 'POR') : 'N/D';
  return decisionComposition;
}

async function extractData(dataText, file) {
  const extractedData = {
    num_processo: extractProcessNumber(dataText),
    num_acordao: extractJudgmentNumber(dataText),
    obrigacao_tributaria: extractTaxObligation(dataText),
    tipo_recurso: extractAppealType(dataText),
    resultado_recurso: extractAppealResult(dataText),
    data_julgamento: extractJudgmentDate(dataText),
    recorrente: extractAppellant(dataText),
    recorrido: extractAppellee(dataText),
    relator: extractReporter(dataText),
    composicao_decisao: extractDecisionComposition(dataText),
    nome_arquivo: extractFileName(file)
  };

  judgments.push(extractedData);
}

async function getDataTextFromPdf() {
  console.time('Tempo de execução')

  await Promise.all(files.map(async (file) => {
    console.log(`- Lendo Arquivo ${files.indexOf(file) + 1}/${files.length}:`, file);
    try {
      await pdfParse(`${pathPdf}/${file}`).then(async (data) => {
        const dataText = data.text;
        // console.log(dataText);
        await extractData(dataText, file);
      });
    } catch (error) {
      console.log(`Erro ao ler arquivo:`, file, error);
    }
  }));

  console.log(judgments);
  await exportResultsToExcel();
  console.timeEnd('Tempo de execução')
}

getDataTextFromPdf();
