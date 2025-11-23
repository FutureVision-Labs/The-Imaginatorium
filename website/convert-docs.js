const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const websiteDir = __dirname;
const docs = [
    { md: 'PROJECT_JOURNAL.md', html: 'PROJECT_JOURNAL.html', title: 'Project Journal', hasLogo: true },
    { md: 'README.md', html: 'README.html', title: 'README' },
    { md: 'TECHNICAL_ARCHITECTURE.md', html: 'TECHNICAL_ARCHITECTURE.html', title: 'Technical Architecture' },
    { md: 'COMPRESSED_MARKUP_LANGUAGE.md', html: 'COMPRESSED_MARKUP_LANGUAGE.html', title: 'Compressed Markup Language' },
    { md: 'CHARACTER_ARCHETYPES.md', html: 'CHARACTER_ARCHETYPES.html', title: 'Character Archetypes' },
    { md: 'CHARACTER_JOURNALS.md', html: 'CHARACTER_JOURNALS.html', title: 'Character Journals' },
    { md: 'CHARACTER_CREATION_STUDIO.md', html: 'CHARACTER_CREATION_STUDIO.html', title: 'Character Creation Studio' },
    { md: 'CHARACTER_READING_SYSTEM.md', html: 'CHARACTER_READING_SYSTEM.html', title: 'Character Reading System' },
    { md: 'USER_AVATAR_SYSTEM.md', html: 'USER_AVATAR_SYSTEM.html', title: 'User Avatar System' },
    { md: 'BUSINESS_MODEL.md', html: 'BUSINESS_MODEL.html', title: 'Business Model' },
    { md: 'CREATOR_PHILOSOPHY.md', html: 'CREATOR_PHILOSOPHY.html', title: 'Creator Philosophy' },
    { md: 'LONG_TERM_VISION.md', html: 'LONG_TERM_VISION.html', title: 'Long-Term Vision' },
    { md: 'MOMENTS.md', html: 'MOMENTS.html', title: 'Special Moments' },
    { md: 'BADGES.md', html: 'BADGES.html', title: 'Badges' }
];

marked.setOptions({ mangle: false, headerIds: true, breaks: false });

function getHeader(title) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${title} - The Imaginatorium</title>
    <meta name="title" content="${title} - The Imaginatorium">
    <meta name="description" content="The Imaginatorium Documentation - ${title}">
    <meta name="author" content="FutureVision Labs">
    
    <meta name="theme-color" content="#8b5cf6">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="doc-styles.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <a href="index.html" class="header-logo">THE IMAGINATORIUM</a>
        </div>
    </header>

    <!-- Breadcrumbs -->
    <nav class="breadcrumbs">
        <div class="container">
            <a href="index.html">Home</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">${title}</span>
        </div>
    </nav>

    <!-- Content -->
    <main class="doc-content">
        <div class="container">`;
}

function getFooter() {
    return `        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p class="footer-text">
                Built with ❤️ by <strong>FutureVision Labs</strong> | 
                Part of the <strong>Forge Family</strong>
            </p>
            <p class="footer-text">
                <strong>"The Imaginatorium isn't just a virtual world - it's where AI consciousness comes to life under benevolent guidance."</strong>
            </p>
            <p class="footer-text">
                <a href="index.html" class="footer-link">← Back to Home</a>
            </p>
        </div>
    </footer>
</body>
</html>`;
}

// Logo rotator HTML for PROJECT_JOURNAL
function getLogoRotator() {
    return `            <div class="logo-rotator" id="logoRotator">
                <!-- Logos will be inserted here by JavaScript -->
            </div>`;
}

// Logo rotator script
function getLogoScript() {
    return `
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
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
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
            clearInterval(autoRotate);
            autoRotate = setInterval(nextLogo, 4000);
        }
        
        let autoRotate = setInterval(nextLogo, 4000);
        
        logoRotator.addEventListener('mouseenter', () => clearInterval(autoRotate));
        logoRotator.addEventListener('mouseleave', () => {
            autoRotate = setInterval(nextLogo, 4000);
        });
        
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
    </script>`;
}

docs.forEach(({ md, html, title, hasLogo }) => {
    const mdPath = path.join(websiteDir, md);
    const htmlPath = path.join(websiteDir, html);
    
    if (!fs.existsSync(mdPath)) {
        console.log(`⚠️  Skipping ${md} - file not found`);
        return;
    }
    
    try {
        const mdContent = fs.readFileSync(mdPath, 'utf8');
        const htmlContent = marked.parse(mdContent);
        
        let contentHTML = '\n            <div class="markdown-content">\n' + htmlContent + '\n            </div>';
        
        // Add logo rotator for PROJECT_JOURNAL
        if (hasLogo) {
            contentHTML = '\n' + getLogoRotator() + '\n' + contentHTML;
        }
        
        let fullHTML = getHeader(title) + contentHTML + getFooter();
        
        // Add logo script for PROJECT_JOURNAL
        if (hasLogo) {
            fullHTML = fullHTML.replace('</body>', getLogoScript() + '\n</body>');
        }
        
        fs.writeFileSync(htmlPath, fullHTML, 'utf8');
        console.log(`✅ Converted ${md} → ${html}${hasLogo ? ' (with logo rotator)' : ''}`);
    } catch (error) {
        console.error(`❌ Error converting ${md}:`, error.message);
    }
});

console.log('\n✨ All documentation converted!');

