const path = require('path')
const fs = require('fs');
const xlsx = require('node-xlsx').default;
const xl = xlsx.parse(path.resolve(__dirname, 'price.xls'));

const [{ data }] = xl;
const cleanData = data
    .filter(row => row.length === 8)
    .map((row, i) => (row[1] && row[6]) && { id: i, model: row[1], price: row[6] })
    .slice(2)
    .filter((row) => typeof row === 'object')

fs.writeFile(
    path.resolve(__dirname, 'src/assets', 'price.json'),
    JSON.stringify(cleanData),
    (err) => {
        if (err) {
            throw err;
        }
        // eslint-disable-next-line no-console
        console.log('The file has been saved!');
    }
);
