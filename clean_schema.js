
const fs = require('fs');
const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const lines = schema.split('\n');
let cleaned = [];
let currentModel = [];
let skipModel = false;
let modelName = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('model ')) {
        modelName = line.trim().split(' ')[1];
        currentModel = [line];
        skipModel = false;

        // Check previous lines for the comment
        for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
            if (lines[j].includes('unique identifier') && lines[j].includes('not be handled')) {
                skipModel = true;
                break;
            }
        }
    } else if (line.trim().startsWith('}')) {
        currentModel.push(line);
        if (!skipModel && !currentModel.some(l => l.includes('Unsupported('))) {
            cleaned.push(...currentModel);
        } else {
            console.log(`Skipping model: ${modelName}`);
        }
        currentModel = [];
        skipModel = false;
    } else if (currentModel.length > 0) {
        currentModel.push(line);
    } else {
        cleaned.push(line);
    }
}

fs.writeFileSync('prisma/clean.prisma', cleaned.join('\n'));
console.log('Cleaned schema written to prisma/clean.prisma');
