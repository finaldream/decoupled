import fs from 'fs';

export default function requireJSON(file) {
    try {
        const data: any = fs.readFileSync(file);
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}
