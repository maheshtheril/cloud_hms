
const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('render_backup.sql');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let capturingFunction = false;
    let capturingTrigger = false;
    let currentBlock = [];
    const outputFunctions = [];
    const outputTriggers = [];

    for await (const line of rl) {
        // Start of Function
        if (line.match(/^CREATE (OR REPLACE )?FUNCTION public\.hms_/i)) {
            capturingFunction = true;
            currentBlock = [line];
            continue;
        }

        // Start of Trigger
        if (line.match(/^CREATE TRIGGER trg_hms_/i)) {
            capturingTrigger = true;
            currentBlock = [line];
            continue;
        }

        if (capturingFunction || capturingTrigger) {
            currentBlock.push(line);
            // End of block (simplified: look for $$;)
            if (line.includes('$$;') || line.includes(');')) {
                if (capturingFunction) outputFunctions.push(currentBlock.join('\n'));
                if (capturingTrigger) outputTriggers.push(currentBlock.join('\n'));
                capturingFunction = false;
                capturingTrigger = false;
                currentBlock = [];
            }
        }
    }

    fs.writeFileSync('extracted_hms_logic.sql',
        '-- EXTRACTED HMS FUNCTIONS\n\n' + outputFunctions.join('\n\n') +
        '\n\n-- EXTRACTED HMS TRIGGERS\n\n' + outputTriggers.join('\n\n')
    );
    console.log('Extraction complete. Output: extracted_hms_logic.sql');
}

extract();
