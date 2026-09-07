import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.xml': 'application/xml',
    '.txt': 'text/plain; charset=utf-8'
};

const LIVERELOAD_SCRIPT = `
<!-- Live Reload Auto-Refresh -->
<script>
(function() {
    let es;
    function connect() {
        es = new EventSource('/__livereload');
        es.onmessage = function(e) {
            if (e.data === 'reload') {
                console.log('[DevServer] File changed, reloading...');
                window.location.reload();
            }
        };
        es.onerror = function() {
            es.close();
            setTimeout(connect, 1500);
        };
    }
    connect();
})();
</script>
`;

// Connected SSE clients
const clients = new Set();

function broadcastReload() {
    for (const res of clients) {
        try {
            res.write('data: reload\n\n');
        } catch (err) {
            clients.delete(res);
        }
    }
}

// Watch directory recursively for changes
let reloadTimeout = null;
const IGNORE_DIRS = new Set(['.git', '.gemini', 'node_modules', 'scratch', 'backups', '.data']);

function setupWatcher(targetDir) {
    try {
        fs.watch(targetDir, { recursive: true }, (eventType, filename) => {
            if (!filename) return;
            const parts = filename.split(/[/\\]/);
            if (parts.some(p => IGNORE_DIRS.has(p))) return;
            
            // Debounce rapid changes
            clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(() => {
                console.log(`[DevServer] Detected change in ${filename}. Refreshing connected browsers...`);
                broadcastReload();
            }, 100);
        });
    } catch (err) {
        console.warn(`[DevServer] Watcher warning: ${err.message}`);
    }
}

setupWatcher(__dirname);

const server = http.createServer((req, res) => {
    // Live reload SSE endpoint
    if (req.url === '/__livereload') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        res.write('\n');
        clients.add(res);
        req.on('close', () => clients.delete(res));
        return;
    }

    // Parse requested path
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(urlObj.pathname);
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    let filePath = path.normalize(path.join(__dirname, pathname));
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Check if adding .html helps (clean urls)
            if (!path.extname(filePath)) {
                const htmlPath = filePath + '.html';
                if (fs.existsSync(htmlPath)) {
                    filePath = htmlPath;
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                    return;
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Headers preventing browser caching during development
        const headers = {
            'Content-Type': contentType,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        };

        if (ext === '.html') {
            fs.readFile(filePath, 'utf8', (readErr, content) => {
                if (readErr) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Internal Server Error');
                    return;
                }
                // Inject live reload script before </body> or at end
                let htmlWithLiveReload;
                if (content.includes('</body>')) {
                    htmlWithLiveReload = content.replace('</body>', `${LIVERELOAD_SCRIPT}</body>`);
                } else if (content.includes('</html>')) {
                    htmlWithLiveReload = content.replace('</html>', `${LIVERELOAD_SCRIPT}</html>`);
                } else {
                    htmlWithLiveReload = content + LIVERELOAD_SCRIPT;
                }

                res.writeHead(200, headers);
                res.end(htmlWithLiveReload);
            });
        } else {
            res.writeHead(200, headers);
            fs.createReadStream(filePath).pipe(res);
        }
    });
});

function startServer(port) {
    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`[DevServer] Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(`[DevServer] Server error:`, err);
        }
    });

    server.listen(port, () => {
        console.log(`\n======================================================`);
        console.log(`🚀 Live-Reload Dev Server running at: http://localhost:${port}`);
        console.log(`⚡ Auto-reloads on any file change (HTML, CSS, JS, etc.)`);
        console.log(`======================================================\n`);
    });
}

startServer(PORT);
