import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Health endpoint for uptime checks
app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.warn('OPENAI_API_KEY is not set; AI endpoints will return errors.');
}

const openaiClient = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

app.post('/api/chat', async (req, res) => {
  const { message, system } = req.body || {};
  if (!openaiClient) return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server.' });
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'message is required' });

  try {
    const response = await openaiClient.responses.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: system || "You are MarketFlow's helpful assistant for buyers, sellers, and admins of a digital marketplace.",
        },
        { role: 'user', content: message },
      ],
    });

    const reply =
      response.output_text ||
      (response.content && response.content[0] && response.content[0].text) ||
      "I'm sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to get response from OpenAI.' });
  }
});

// Serve built frontend if dist exists (production)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('dist/ not found; static assets will not be served (likely running in dev).');
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
