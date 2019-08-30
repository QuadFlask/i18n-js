const XLSX = require('xlsx');
const workbook = XLSX.readFile('translations.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const [columnNames, reader] = readRow(worksheet);

const translates = {};
for (const row of reader) {
    translates[row.kr] = row.en;
}

const strip = (s) => s.split(/\${.+?}/g);
const transform = (o, columnNames = ["kr", "en"]) => Object
    .entries(o)
    .map(a => a.map(s => strip(s)))
    .reduce((o, vs) => {
        const r = {};
        columnNames.forEach((columnName, i) => {
            r[columnName] = vs[i]
        });
        o[vs[0].join('')] = r;
        return o;
    }, {});

console.log(JSON.stringify(transform(translates, columnNames)));

function readRow(worksheet, startIndex = 2, columns = ["G", "H"]) {
    const columnNames = columns.map(column => worksheet[column + 1].v.trim());
    return [columnNames, (function* () {
        while (true) {
            if (worksheet[columns[0] + startIndex]) {
                let row = columns.map(column => {
                    const cell = worksheet[column + startIndex];
                    return cell ? cell.v.trim() : '';
                });
                startIndex++;
                yield row.reduce((a, b, i) => {
                    return {
                        ...a,
                        [columnNames[i]]: b
                    }
                }, {});
            } else return;
        }
    })()];
}
