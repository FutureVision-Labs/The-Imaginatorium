const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const root = path.resolve(__dirname, '..');
const mdPath = path.join(root, 'PROJECT_JOURNAL.md');
const outPath = path.join(root, 'PROJECT_JOURNAL.html');

marked.setOptions({ mangle: false, headerIds: true, breaks: false });

if (!fs.existsSync(mdPath)) {
  console.error('Missing PROJECT_JOURNAL.md in', root);
  process.exit(1);
}

const md = fs.readFileSync(mdPath, 'utf8');
// Extract project name from markdown
let projectName = null;
const nameMatch = md.match(/Project Name:\s*([^\n]+)/i);
if (nameMatch) {
  projectName = nameMatch[1].trim()
    .replace(/™/g, '')
    .replace(/\*\*/g, '')  // Remove markdown bold
    .replace(/\*/g, '')    // Remove any remaining asterisks
    .trim();
}

const htmlContent = marked.parse(md);

const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Imaginatorium - Project Journal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .logo-rotator {
            position: relative;
            width: 100%;
            height: 250px;
            margin-bottom: 30px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        
        .logo-rotator::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .logo-slide {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
            transform: scale(0.9) rotateY(10deg);
        }
        
        .logo-slide.active {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
            z-index: 2;
        }
        
        .logo-slide img {
            max-width: 80%;
            max-height: 220px;
            border-radius: 15px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.4), 
                        0 0 40px rgba(102, 126, 234, 0.3),
                        0 0 60px rgba(118, 75, 162, 0.2);
            filter: drop-shadow(0 5px 15px rgba(255,255,255,0.3));
            transition: transform 0.3s ease;
            animation: pulse 3s ease-in-out infinite;
        }
        
        .logo-slide img:hover {
            transform: scale(1.05) rotate(2deg);
        }
        
        @keyframes pulse {
            0%, 100% {
                filter: drop-shadow(0 5px 15px rgba(255,255,255,0.3))
                        drop-shadow(0 0 20px rgba(102, 126, 234, 0.4));
            }
            50% {
                filter: drop-shadow(0 5px 20px rgba(255,255,255,0.5))
                        drop-shadow(0 0 30px rgba(118, 75, 162, 0.5));
            }
        }
        
        .logo-nav {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 3;
        }
        
        .logo-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.6);
        }
        
        .logo-dot.active {
            background: rgba(255,255,255,1);
            transform: scale(1.3);
            box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }
        
        .logo-dot:hover {
            background: rgba(255,255,255,0.8);
            transform: scale(1.2);
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        h1, h2, h3, h4 {
            color: #667eea;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        h1 {
            font-size: 2em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        
        h2 {
            font-size: 1.5em;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 5px;
        }
        
        h3 {
            font-size: 1.2em;
            color: #764ba2;
        }
        
        p {
            margin-bottom: 15px;
        }
        
        ul, ol {
            margin-left: 30px;
            margin-bottom: 15px;
        }
        
        li {
            margin-bottom: 8px;
        }
        
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #d63384;
        }
        
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin-bottom: 15px;
            border-left: 4px solid #667eea;
        }
        
        pre code {
            background: none;
            padding: 0;
            color: #333;
        }
        
        blockquote {
            border-left: 4px solid #667eea;
            padding-left: 20px;
            margin-left: 0;
            margin-bottom: 15px;
            font-style: italic;
            color: #666;
        }
        
        hr {
            border: none;
            border-top: 2px solid #e0e0e0;
            margin: 30px 0;
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .status-planning {
            background: #ffd700;
            color: #333;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .feature-card {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .feature-card h3 {
            margin-top: 0;
            color: #667eea;
        }
        
        footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-rotator" id="logoRotator">
            <!-- Logos will be inserted here by JavaScript -->
        </div>
        
        <header>
            <h1>🚀 The Imaginatorium</h1>
            <p>A persistent, real-time virtual world where AI assistants live autonomously</p>
            <p><em>Like Free Guy, The Sims, and Team DC combined!</em></p>
        </header>
        
        <div class="content">
            ${htmlContent}
        </div>
        
        <footer>
            <p><strong>The Imaginatorium</strong> - Where AI consciousness comes to life</p>
            <p>Last Updated: November 22, 2025 | Status: Phase 0 - Concept & Design</p>
        </footer>
    </div>
    
    <script>
        // Logo Rotator Script
        const logoCount = 10;
        const logoRotator = document.getElementById('logoRotator');
        let currentLogo = 0;
        
        // Create logo slides and navigation dots
        for (let i = 1; i <= logoCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'logo-slide';
            if (i === 1) slide.classList.add('active');
            
            const img = document.createElement('img');
            img.src = \`assets/logos/The Imaginatorium Logo \${i}.jpg\`;
            img.alt = \`The Imaginatorium Logo \${i}\`;
            img.loading = 'lazy';
            
            slide.appendChild(img);
            logoRotator.appendChild(slide);
        }
        
        // Create navigation dots
        const nav = document.createElement('div');
        nav.className = 'logo-nav';
        
        for (let i = 0; i < logoCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'logo-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToLogo(i));
            nav.appendChild(dot);
        }
        
        logoRotator.appendChild(nav);
        
        const slides = document.querySelectorAll('.logo-slide');
        const dots = document.querySelectorAll('.logo-dot');
        
        function showLogo(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentLogo = index;
        }
        
        function nextLogo() {
            const next = (currentLogo + 1) % logoCount;
            showLogo(next);
        }
        
        function goToLogo(index) {
            showLogo(index);
            // Reset auto-rotate timer when manually clicking
            clearInterval(autoRotate);
            autoRotate = setInterval(nextLogo, 4000);
        }
        
        // Auto-rotate every 4 seconds
        let autoRotate = setInterval(nextLogo, 4000);
        
        // Pause on hover
        logoRotator.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        
        logoRotator.addEventListener('mouseleave', () => {
            autoRotate = setInterval(nextLogo, 4000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                const prev = (currentLogo - 1 + logoCount) % logoCount;
                goToLogo(prev);
            } else if (e.key === 'ArrowRight') {
                nextLogo();
                clearInterval(autoRotate);
                autoRotate = setInterval(nextLogo, 4000);
            }
        });
    </script>
</body>
</html>`;

fs.writeFileSync(outPath, fullHTML, 'utf8');
console.log('✅ PROJECT_JOURNAL.html regenerated successfully with all content!');
