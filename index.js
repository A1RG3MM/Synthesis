// a1rg3mm was here you scummy lil skids

import { randomBytes } from 'crypto';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const CSRF_TTL = 15 * 60 * 1000;
const csrfTokens = new Map();
const storedKeys = new Map();
const activeBrowsers = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT) || 3000;
const views = path.join(__dirname, 'views');

app.use(express.static("public", {
    index: "index.html",
    extensions: ["html"]
}));

app.use((req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        return next();
    }

    const token = req.headers["x-csrf-token"];
    const now = Date.now();

    if (!token || !csrfTokens.has(token) || csrfTokens.get(token) < now) {
        const newToken = randomBytes(16).toString("hex");
        csrfTokens.set(newToken, now + CSRF_TTL);
        for (const [t, exp] of csrfTokens.entries()) {
            if (exp < now) csrfTokens.delete(t);
        }

        res.setHeader("x-csrf-token", newToken);
        return res.status(403).json({ error: "CSRF token required or expired" });
    }

    next();
});

app.post('/syn/browser-key', (req, res) => {
    const information = {
        key: randomBytes(8).toString('hex'),
        expiry: Date.now() + 10 * 1000
    };

    storedKeys.set(information.key, information.expiry);
    res.json(information);
});

app.get('/syn/browser', (req, res) => {
    if (!req.query.key || !storedKeys.has(req.query.key)) {
        return res.status(403).json({ error: "Missing or invalid key" });
    }

    const expiry = storedKeys.get(req.query.key);
    if (Date.now() > expiry) {
        storedKeys.delete(req.query.key);
        return res.status(403).json({ error: "Key expired" });
    }

    storedKeys.delete(req.query.key);

    const hash = randomBytes(10).toString("hex");
    activeBrowsers.set(hash, true);
    res.json({ url: `/browser-${hash}` });
});



// main pages
app.get('/', (req, res) => res.sendFile(path.join(views, 'index.html')));
app.get('/browser-:hash', (req, res) => res.sendFile(path.join(views, "browser.html")));

app.use((req, res) => res.status(404).sendFile(path.join(views, '404.html')));
app.use((req, res, next) => req.path.endsWith(".html") ? res.redirect("/") : next());

app.listen(port, () => {
    console.log(`Synthesis is running on port ${port}!\n- http://localhost:${port}`);
});
