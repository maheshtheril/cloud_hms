import { signup } from './src/app/actions/auth';
import * as fs from 'fs';

async function run() {
    const fd = new FormData();
    fd.append('email', `test_error_${Date.now()}@test.com`);
    fd.append('password', 'password123');
    fd.append('name', 'Test Error User');
    fd.append('companyName', 'Test Error Company');
    fd.append('countryId', 'IN');
    fd.append('currencyId', 'INR');
    fd.append('industry', 'Healthcare');
    fd.append('modules', 'hms');

    try {
        const res = await signup(null, fd as any);
        fs.writeFileSync('signup-error-output.txt', JSON.stringify(res, null, 2));
    } catch (e: any) {
        const errorData = {
            message: e.message,
            stack: e.stack,
            stringified: String(e)
        };
        fs.writeFileSync('signup-error-output.txt', JSON.stringify(errorData, null, 2));
    }
}

run().catch(e => fs.writeFileSync('signup-error-output.txt', 'FATAL: ' + String(e)));
