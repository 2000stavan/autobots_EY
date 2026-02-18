
import { spawn, execSync } from 'child_process';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, '../server.js');
const checkConfigPath = path.resolve(__dirname, 'check-config.js');

async function runDiagnostics() {
    console.log('🚀 Starting Diagnostic Health Check...\n');

    // 1. Run Configuration Check
    try {
        execSync(`node "${checkConfigPath}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Configuration check failed.');
        process.exit(1);
    }

    // 2. Start Server
    console.log('\n--- 2. BRIDGE CONNECTIVITY TEST ---');
    console.log('Starting server...');
    const server = spawn('node', [serverPath], { stdio: 'pipe' });

    // Capture server output for debugging, but don't pipe directly to avoid clutter unless error
    server.stdout.on('data', (data) => {
        // confirm server started
        if (data.includes('Server running')) {
            // console.log('Server started successfully.');
        }
    });

    server.stderr.on('data', (data) => console.error(`Server Error: ${data}`));

    // Give server a moment to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Test Bridge Endpoint
    try {
        console.log('Testing /api/test-sarvam...');
        const response = await axios.post('http://localhost:3000/api/test-sarvam');

        if (response.status === 200 && response.headers['content-type'].includes('audio')) {
            console.log('✅ SARVAM BRIDGE: SUCCESS (Received audio buffer)');
        } else {
            console.error(`❌ SARVAM BRIDGE: FAILED (Unexpected response: ${response.status})`);
        }

    } catch (error) {
        console.error(`❌ SARVAM BRIDGE: FAILED`);
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    } finally {
        // Cleanup
        console.log('\nStopping server...');
        server.kill();
        process.exit(0);
    }
}

runDiagnostics();
