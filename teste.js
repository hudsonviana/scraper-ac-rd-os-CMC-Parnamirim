const acs = [
  '2021-04-15262-10.pdf',
  '2021-04-15906-14.pdf',
  '2021-09-21-13.07.49.811.pdf',
  '2021-09-21-13.10.31.894.pdf',
  '2022-03-15-08.10.12.546.pdf',
  '2022-03-15-11.31.49.50.pdf',
  '2022-05-03-07.53.58.411.pdf',
  '2022-06-24-09.42.33.426.pdf',
  '2022-11-11-09.56.27.755.pdf',
  '2021-04-1567-5.pdf',
  '2021-06-17-13.45.39.271.pdf',
  '2021-06-17-13.58.19.735.pdf',
  '2021-06-17-14.00.58.453.pdf',
  '2022-04-08-12.22.32.539.pdf',
  '2022-04-08-12.22.53.407.pdf',
  '2022-05-12-11.57.05.840.pdf',
  '2022-08-01-09.25.17.432.pdf',
  '2022-08-01-09.26.04.432.pdf',
  '2022-08-15-09.41.43.333.pdf',
  '2022-08-15-09.41.54.761.pdf',
  '2022-09-19-11.39.18.200.pdf'
];

// const fs = require('fs');

// function copyFiles(files) {
//   files.forEach(file => {
//     fs.copyFile(`data/${file}`, `data3/${file}`, (err) => {
//       if (err) throw err;
//       console.log(`${file} was copied to data3`);
//     });
//   });
// }

// copyFiles(acs);


// const text = ': 07 de dezembro de 2022';
// const date = text.replace(/^\s*:\s*/, '');
// console.log(date);

// const dataText = "REFERÊNCIA: Processo n. 2019.008705-0.\nASSUNTO: Recurso oficio.\nRECORRENTE: Ponta Distribuidora Alimentos e Serviços Ltda.\nRECORRIDO: A Fazenda Pública Municipal Parnamirim.\nRELATOR: Conselheiro Hudson Svante Bezerra Pereira.";
// const regex = /RECORRENTE: (.+)\./;
// const match = regex.exec(text);
// const company = match[1];
// console.log(company);

// const dataText = "PREFEITURA MUNICIPAL DE PARNAMIRIM\nCONSELHO MUNICIPAL DE CONTRIBUINTES\n\n\n\n\n\nPROCESSO: Nº: 2016.004639-9\nRECORRIDA: EDITORA TRIBUNA DE PARNAMIRIM\nRECORRENTE: FAZENDA MUNICIPAL\nRELATOR: CONSELHEIRO MIRABEAU BATISTA DE MORAIS JÚNIOR\n\nEMENTA: TRIBUTÁRIO. FALTA DE\nRECOLHIMENTO     DA     TAXA     DE     LICENÇA     E\nFUNCIONAMENTO. AUTO DE INFRAÇÃO.\nADIMPLEMENTO    DA    OBRIGAÇÃO    TRIBUTÁRIA\nPRINCIPAL  ANTES  DA  CIENTIFICAÇÃO  DO  AUTO\nDE INFRAÇÃO. EXTINÇÃO DO CRÉDITO\nTRIBUTÁRIO. RECURSO  DE  OFÍCIO  CONHECIDO  E\nIMPROVIDO.\n\n Vistos,  relatados  e  discutidos  estes  autos,  acordam  os  membros  presentes  deste  Conselho\nMunicipal de Contribuintes – CMC,  por unanimidade,  em  conhecer  do recurso interposto, julgando\nIMPROCEDENTE  o  presente  recurso,  determinando  a  baixa  imediata  do  Auto  de  Infração  nº\n5.00212163, extinto pelo pagamento nos termos do art. 156, I do Código Tributário Nacional.\n\nParnamirim, 18 de abril de 2018.\n\n\n\nGustavo da Silva Santos\nPRESIDENTE\n\n\n\nMIRABEAU BATISTA DE MORAIS JÚNIOR\nCONSELHEIRO RELATOR";

const dataText1 = `ESTADO DO RIO GRANDE DO NORTE
PREFEITURA MUNICIPAL DE PARNAMIRIM
CONSELHO MUNICIPAL DE CONTRIBUINTES



REFERÊNCIA: Processo n. 2019.008705-0.
ASSUNTO: Recurso oficio.
RECORRENTE: Ponta Distribuidora Alimentos e Serviços Ltda.
RECORRIDO: A Fazenda Pública Municipal Parnamirim.
RELATOR: Conselheiro Hudson Svante Bezerra Pereira.

TRIBUTÁRIO.  ISSQN.  RECLAMAÇÃO  CONTRA
AUTO  DE  INFRAÇÃO.  CONSTRUÇÃO  CIVIL.
BEM     IMÓVEL     ADQUIRIDO     EM     HASTA
PÚBLICA.  INTELIGÊNCIA  DO  ART.  173,  CTN.
PRAZO    DECADENCIAL    DE    CINCO    ANOS.
CONFIGURAÇÃO DA DECADÊNCIA
ADMINISTRATIVA  TRIBUTÁRIA  DO  CRÉDITO
TRIBUTÁRIO. RECURSO DE OFÍCIO
CONHECIDO E NÃO PROVIDO.

 Vistos,  relatados  e  discutidos  estes  autos,  acordam  os  membros
deste  Conselho  Municipal  de  Contribuintes – CMC,  por  unanimidade  dos  votos,  em
conhecer do recurso voluntário interposto, para em seguida, negar-lhe provimento, nos
termos do voto do relator.


Data de Julgamento: 27 de abril de 2022.


Data de leitura e aprovação: 04 de maio de 2022.


Parnamirim/RN, 04 de maio de 2022.



Francisco Josenildo Olinto Bezerra
Conselheiro Presidente


Hudson Svante Bezerra Pereira
Conselheiro Relator
ACÓRDÃO
Nº 028/2022`


const dataText2 = `
PREFEITURA MUNICIPAL DE PARNAMIRIM
CONSELHO MUNICIPAL DE CONTRIBUINTES





PROCESSO: Nº: 2016.004639-9
RECORRIDA: EDITORA TRIBUNA DE PARNAMIRIM
RECORRENTE: FAZENDA MUNICIPAL
RELATOR: CONSELHEIRO MIRABEAU BATISTA DE MORAIS JÚNIOR


EMENTA: TRIBUTÁRIO. FALTA DE
RECOLHIMENTO     DA     TAXA     DE     LICENÇA     E
FUNCIONAMENTO. AUTO DE INFRAÇÃO.
ADIMPLEMENTO    DA    OBRIGAÇÃO    TRIBUTÁRIA
PRINCIPAL  ANTES  DA  CIENTIFICAÇÃO  DO  AUTO
DE INFRAÇÃO. EXTINÇÃO DO CRÉDITO
TRIBUTÁRIO. RECURSO  DE  OFÍCIO  CONHECIDO  E
IMPROVIDO.


 Vistos,  relatados  e  discutidos  estes  autos,  acordam  os  membros  presentes  deste  Conselho
Municipal de Contribuintes – CMC,  por unanimidade,  em  conhecer  do recurso interposto, julgando
IMPROCEDENTE  o  presente  recurso,  determinando  a  baixa  imediata  do  Auto  de  Infração  nº
5.00212163, extinto pelo pagamento nos termos do art. 156, I do Código Tributário Nacional.

Parnamirim, 18 de abril de 2018.



Gustavo da Silva Santos
PRESIDENTE



MIRABEAU BATISTA DE MORAIS JÚNIOR
CONSELHEIRO RELATOR

A C Ó R D Ã O N. º 04/2018
Warning: TT: undefined function: 32
`

const dataText3 = `
 PREFEITURA MUNICIPAL DE PARNAMIRIM CONSELHO MUNICIPAL DE
CONTRIBUINTES
A C Ó R D Ã O N. º 0015/2022
PROCESSO Nº.: 2018/001074-8
RECORRIDO: MAGNA ANIZERETHE LEITE DANTAS
RECORRENTE: FAZENDA PÚBLICA MUNICIPAL
RELATOR: MARCOS FERNANDES DA SILVA
EMENTA: TRIBUTÁRIO. IPTU. RECLAMAÇÃO CONTRA LANÇAMENTO
.BASE DE CÁLCULO . CONTRIBUIÇÃO E LANÇAMENTO DE CRÉDITO
TRIBUTÁRIO. RECURSO DE OFÍCIO CONHECIDO E IMPROVIDO.
Vistos, relatados e discutidos estes autos, acordam os membros deste Conselho Municipal
de Contribuintes – CMC, por unanimidade dos votos, em conhecer do recurso de ofício
interposto, para em seguida, negar-lhe provimento, nos termos do voto do relator.
 PRECEDENTE. ACÓRDÃO: 123/2025
Data de Julgamento: 06 de Abril de 2022.
Data de leitura e aprovação: 13 de Abril de 2022.
Parnamirim/RN, 13 de abril de 2022.
FRANCISCO JOSENILDO OLINTO BEZERRA
PRESIDENTE
MARCOS FERNANDES DA SILVA
CONSELHEIRO RELATOR
`

// const text1 = ': Ponta Distribuidora Alimentos e Serviços Ltda.';
// const text2 = ': FAZENDA MUNICIPAL';
// const text3 = ': FAZENDA PÚBLICA MUNICIPAL';

// const extractedText =  text1.replace(/: (.+)\./, '$1');
// const extractedText2 = text2.replace(/: (.+)\./, '$1');
// const extractedText3 = text3.replace(/: (.+)\./, '$1');

// console.log(extractedText); // "Ponta Distribuidora Alimentos e Serviços Ltda."
// console.log(extractedText2); // "FAZENDA MUNICIPAL"
// console.log(extractedText3); // "FAZENDA PÚBLICA MUNICIPAL"


// function extractReporter(dataText) {
//   const reporterTarget = /RELATOR(.*?)\n/gi;
//   const reporter = reporterTarget.exec(dataText)[1].toUpperCase().replace(/^: CONSELHEIRO|^: CONSELHEIRA|: |\./gi, '').trim() || 'N/D';
//   console.log(reporter);
//   return reporter;
// }
// extractReporter(dataText1);

const text = "GEYSA.com PEREIRA DE MACEDO.";
const cleanedText = text.replace(/\.$|\/$/, '');
console.log(cleanedText); // Output: "GEYSA PEREIRA DE MACEDO"