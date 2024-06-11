// client.js
const readline = require('readline');
const { request } = require('./clientLib');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
    while (true) {
        try {
            const url = await prompt('Enter URL: ');
            const method = await prompt('Enter HTTP method (GET, POST, PUT, DELETE): ');
            const headerInput = await prompt('Enter headers (key:value,key:value): ');
            const headers = Object.fromEntries(headerInput.split(',').map(h => h.split(':').map(s => s.trim())));
            const body = await prompt('Enter body: ');

            const response = await request(method, url, headers, body);
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', error);
        }

        const continuePrompt = await prompt('Do you want to send another request? (yes/no): ');
        if (continuePrompt.toLowerCase() !== 'yes') {
            break;
        }
    }

    rl.close();
}

main();
