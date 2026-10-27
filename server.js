const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Erhöht das Limit, da Bild-Scans oft größer sind

// Das lädt deine normalen Web-App-Dateien (index.html etc.), die im Hauptverzeichnis liegen
app.use(express.static(__dirname));

// PROXY FÜR GEMINI API: Deine App leitet die Scans sicher hierüber um
app.all('/api/proxy', async (req, res) => {
    try {
        // Die offizielle Gemini-URL, bei der dein sicherer Key aus Render angehängt wird
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.API_KEY}`;
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy Fehler', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
