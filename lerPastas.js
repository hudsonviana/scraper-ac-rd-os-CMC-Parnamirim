const fs = require('fs');

// Caminho para as duas pastas a serem comparadas
const folder1 = 'data';
const folder2 = 'data2';

// Lê os arquivos de cada pasta e os coloca em um conjunto
const files1 = new Set(fs.readdirSync(folder1));
const files2 = new Set(fs.readdirSync(folder2));

// Encontra os arquivos que existem em ambas as pastas
const filesInBoth = new Set([...files1].filter(x => files2.has(x)));
console.log("Arquivos em ambas as pastas:", filesInBoth);

// Encontra os arquivos que existem apenas na pasta 1
const filesOnlyIn1 = new Set([...files1].filter(x => !files2.has(x)));
console.log("Arquivos apenas na pasta 1:", filesOnlyIn1);

// Encontra os arquivos que existem apenas na pasta 2
const filesOnlyIn2 = new Set([...files2].filter(x => !files1.has(x)));
console.log("Arquivos apenas na pasta 2:", filesOnlyIn2);
