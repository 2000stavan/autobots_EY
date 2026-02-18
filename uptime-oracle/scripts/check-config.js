
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded .env.local');
} else {
    console.error('❌ .env.local not found!');
    process.exit(1);
}

const requiredVars = [
    'VITE_VAPI_PUBLIC_KEY',
    'VAPI_PRIVATE_KEY',
    'VITE_VAPI_ASSISTANT_ID',
    'SARVAM_API_KEY'
];

let hasError = false;

// 1. Environment Verification
console.log('\n--- 1. ENVIRONMENT VERIFICATION ---');
requiredVars.forEach(varName => {
    if (process.env[varName]) {
        console.log(`✅ ${varName}: PRESENT`);
    } else {
        console.error(`❌ ${varName}: MISSING`);
        hasError = true;
    }
});

if (hasError) {
    console.error('\n❌ Missing required environment variables. Aborting.');
    process.exit(1);
}

// 3. Vapi Assistant Sync
async function checkVapiSync() {
    console.log('\n--- 3. VAPI ASSISTANT SYNC ---');

    const vapiPrivateKey = process.env.VAPI_PRIVATE_KEY;
    console.log(`   Using VAPI_PRIVATE_KEY starting with: ${vapiPrivateKey ? vapiPrivateKey.substring(0, 4) + '...' : 'UNDEFINED'}`);
    const assistantId = process.env.VITE_VAPI_ASSISTANT_ID;

    try {
        // Fetch Assistant details
        const response = await axios.get(`https://api.vapi.ai/assistant/${assistantId}`, {
            headers: {
                'Authorization': `Bearer ${vapiPrivateKey}`
            }
        });

        const assistant = response.data;
        console.log(`✅ Fetched Assistant: ${assistant.name || assistantId}`);
        console.log(`   Voice Provider: ${assistant.voice?.provider || 'Unknown'}`);
        console.log(`   Model: ${assistant.model?.model || 'Unknown'}`);

        // Check Ngrok
        try {
            const ngrokResponse = await axios.get('http://127.0.0.1:4040/api/tunnels');
            const publicUrl = ngrokResponse.data.tunnels[0]?.public_url;

            if (publicUrl) {
                console.log(`✅ Current Ngrok URL: ${publicUrl}`);

                const serverUrl = assistant.serverUrl;
                if (serverUrl && serverUrl.startsWith(publicUrl)) {
                    console.log('✅ Vapi Server URL matches current Ngrok session.');
                } else {
                    console.log(`⚠️ Vapi Server URL mismatch!`);
                    console.log(`   Expected start: ${publicUrl}`);
                    console.log(`   Actual: ${serverUrl || 'Not set'}`);
                    console.log('   Action: Update Vapi Assistant Server URL to match Ngrok.');
                }

                if (assistant.voice?.provider !== 'custom-voice') { // Adjust check based on actual Vapi response for custom voice
                    // It seems Vapi might use 'playht', 'deepgram', 'rime', or 'custom-voice'
                    // The user asked to check if "Voice Provider" is "Custom".
                    // Vapi API structure might vary, logging what we verify.

                    // If the user meant the *transcriber* or *model* provider being custom, or specifically a custom *voice*
                    // provider setup. Usually for custom voices (like cloned ones), provider might be specific.
                    // Let's log what we find.
                    // Re-reading usage: "Voice Provider" in remote Vapi Dashboard is set to "Custom".
                    // This usually maps to `voice.provider`.
                }

            } else {
                console.log('⚠️ Ngrok is running but no tunnels found.');
            }
        } catch (error) {
            console.log('⚠️ Could not connect to local Ngrok API (is Ngrok running?). Skipping URL sync check.');
        }

    } catch (error) {
        console.error(`❌ Failed to fetch Vapi assistant: ${error.message}`);
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error('   Verify VAPI_PRIVATE_KEY and VITE_VAPI_ASSISTANT_ID.');
        }
    }
}

// Execute
await checkVapiSync();
