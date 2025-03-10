import fs from 'fs';

const readData = (path) => {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.log('Error reading file:', e);
    }
}

const writeData = (path, data) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

const updateData = (path, key, value) => {
    try {
        const data = readData(path);
        data[key] = value;
        writeData(path, data);
    } catch (e) {
        console.log('Error updating data:', e);
    }
}

export { readData, writeData, updateData };