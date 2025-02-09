const fs = require('fs');
const path = require('path');

function countHtmlFiles(dir) {
    console.log('[Page Verification] Starting page count...');
    const files = [];
    
    function scanDirectory(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                scanDirectory(fullPath);
            } else if (entry.isFile() && path.extname(entry.name) === '.html') {
                const relativePath = path.relative(dir, fullPath);
                files.push(relativePath);
                console.log(`[Page Verification] Found page: ${relativePath}`);
            }
        }
    }
    
    scanDirectory(dir);
    console.log(`[Page Verification] Total pages found: ${files.length}`);
    console.log('[Page Verification] Page list:', files);
    return files;
}

// Run the verification
const outDir = path.join(__dirname, '..', 'out');
if (fs.existsSync(outDir)) {
    countHtmlFiles(outDir);
} else {
    console.log('[Page Verification] Error: out directory not found. Please build the project first.');
}
