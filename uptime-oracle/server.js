
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if present
const envPath = path.resolve(__dirname, '.env.local');
dotenv.config({ path: envPath });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Simple Health Check for Browser
app.get('/', (req, res) => {
    res.send('✅ Server is running. Use POST /api/test-sarvam for the bridge test.');
});

// 2. BRIDGE CONNECTIVITY TEST
app.post('/api/test-sarvam', async (req, res) => {
    console.log('Received request to /api/test-sarvam');

    const sarvamApiKey = process.env.SARVAM_API_KEY;
    if (!sarvamApiKey) {
        console.error('Missing SARVAM_API_KEY');
        return res.status(500).json({ error: 'SARVAM_API_KEY not configured' });
    }

    try {
        const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
            inputs: ['This is a test message.'],
            target_language_code: 'hi-IN',
            speaker: 'shreya',
            pace: 1.0,
            speech_sample_rate: 8000,
            enable_preprocessing: true,
            model: 'bulbul:v3'
        }, {
            headers: {
                'api-subscription-key': sarvamApiKey,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer' // Expect binary data
        });

        console.log('SARVAM BRIDGE: SUCCESS');
        // Send audio buffer back
        res.set('Content-Type', 'audio/wav');
        res.send(response.data);

    } catch (error) {
        if (error.response) {
            console.error(`SARVAM BRIDGE: FAILED with status ${error.response.status}`);
            console.error(error.response.data.toString('utf8')); // Try to read error message from buffer
            res.status(error.response.status).json({ error: error.response.statusText });
        } else {
            console.error(`SARVAM BRIDGE: FAILED with network error`, error.message);
            res.status(500).json({ error: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
