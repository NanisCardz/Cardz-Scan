const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Das lädt deine normalen Web-App-Dateien (index.html etc.), die im Hauptverzeichnis liegen
app.use(express.static(__dirname));

// HIER IST DEIN PROXY: Deine App fragt ab jetzt diesen Link statt direkt die externe API
app.all('/api/proxy', async (req, res) => {
    try {
        const targetUrl = 'HIER_DIE_ECHTE_API_URL_EINTRAGEN'; // Z.B. https://api.mein-anbieter.com/v1/scan
        
        // Wir leiten die Anfrage mit deinem geheimen API-Key weiter
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer DEIN_GEHEIMER_API_KEY' // Falls deine API einen Key nutzt
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

