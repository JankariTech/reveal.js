
const fs = require('fs');
const { JSDOM } = require('jsdom');

const htmlPath = 'index.html';
const outputPath = 'exported_project/index.html';

fs.readFile(htmlPath, 'utf8', (err, htmlContent) => {
    if (err) {
        console.error('Error reading HTML file:', err);
        return;
    }

    const { window } = new JSDOM(htmlContent);
    const document = window.document;

    // Inline CSS
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const cssPath = link.getAttribute('href');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        const styleTag = document.createElement('style');
        styleTag.appendChild(document.createTextNode(cssContent));
        link.replaceWith(styleTag);
    });

    // Inline JavaScript
    document.querySelectorAll('script[src]').forEach(script => {
        const jsPath = script.getAttribute('src');
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        const scriptTag = document.createElement('script');
        scriptTag.appendChild(document.createTextNode(jsContent));
        script.replaceWith(scriptTag);
    });

    const updatedHTML = window.document.documentElement.outerHTML;

    fs.mkdirSync('exported_project', { recursive: true });
    fs.writeFileSync(outputPath, updatedHTML);
    console.log('Project exported successfully.');
});
