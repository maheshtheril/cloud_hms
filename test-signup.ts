import { signup } from './src/app/actions/auth';

async function run() {
    const fd = new FormData();
    fd.append('email', `test_${Date.now()}@test.com`);
    fd.append('password', 'password123');
    fd.append('name', 'Test User');
    fd.append('companyName', 'Test Company');
    fd.append('countryId', 'IN');
    fd.append('currencyId', 'INR');
    fd.append('industry', 'Healthcare');
    fd.append('modules', 'hms');

    console.log("Calling signup...");
    const res = await signup(null, fd as any);
    console.log("Result:", res);
}

run().catch(console.error);
