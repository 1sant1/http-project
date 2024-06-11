// clientLib.js
const net = require('net');

function parseURL(url) {
    const { hostname, port, pathname } = new URL(url);
    return { hostname, port: port || 80, path: pathname };
}

function buildRequest({ method, path, headers, body }) {
    headers['API-Key'] = '12345';  // Add the API key
    const headerLines = Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    return `${method} ${path} HTTP/1.1\r\n${headerLines}\r\n\r\n${body}`;
}


function request(method, url, headers = {}, body = '') {
    const { hostname, port, path } = parseURL(url);
    const client = new net.Socket();
    const requestData = buildRequest(method, path, headers, body);

    return new Promise((resolve, reject) => {
        client.connect(port, hostname, () => {
            client.write(requestData);
        });

        let response = '';
        client.on('data', (data) => {
            response += data.toString();
        });

        client.on('end', () => {
            resolve(response);
            client.destroy();
        });

        client.on('error', reject);
    });
}

module.exports = { request };
