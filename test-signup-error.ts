import { signup } from './src/app/actions/auth';

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

    console.log("Calling signup with try-catch...");
    try {
        const res = await signup(null, fd as any);
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("CAUGHT ERROR STR:", String(e));
        if (e instanceof Error) {
            console.error("CAUGHT ERROR MSG:", e.message);
            console.error("CAUGHT ERROR STACK:", e.stack);
        }
    }
}

run().catch(e => console.error("FATAL:", e));
