
const fs = require('fs');
const readline = require('readline');

async function extractRanges(ranges, outputFile) {
    const fileStream = fs.createReadStream('render_backup.sql');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let currentLine = 0;
    const output = [];

    for await (const line of rl) {
        currentLine++;
        for (const range of ranges) {
            if (currentLine >= range.start && currentLine <= range.end) {
                output.push(line);
                break;
            }
        }
    }

    fs.writeFileSync(outputFile, output.join('\n'));
    console.log(`Extracted to ${outputFile}`);
}

const ranges = [
    { start: 2600, end: 2647, name: 'hms_invoice_history_trigger' },
    { start: 2654, end: 2665, name: 'hms_invoice_immutable_when_posted' },
    { start: 2672, end: 2694, name: 'hms_next_invoice_number' },
    { start: 2877, end: 2970, name: 'hms_recompute_invoice_totals' },
    { start: 2991, end: 3038, name: 'hms_sync_invoice_lines_on_upsert' },
    { start: 3045, end: 3063, name: 'hms_touch_invoice_from_line' },
    { start: 40868, end: 40982, name: 'hms_triggers' }
];

extractRanges(ranges, 'hms_full_logic.sql');
