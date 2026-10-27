const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Erhöht das Limit, da Bild-Scans oft größer sind

// Das lädt deine normalen Web-App-Dateien (index.html etc.), die im Hauptverzeichnis liegen
app.use(express.static(__dirname));

// PROXY FÜR GOOGLE API: Deine App fragt ab jetzt diesen Link
app.all('/api/proxy', async (req, res) => {
    try {
        // Die offizielle Google-URL, bei der der Key sicher als Parameter angehängt wird
        const targetUrl = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.API_KEY}`;
        
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy Fehler', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
