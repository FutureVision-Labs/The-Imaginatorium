const fs = require('fs');
const path = require('path');

const websiteDir = __dirname;
const htmlFiles = [
    'PROJECT_JOURNAL.html',
    'MOMENTS.html',
    'CHARACTER_CREATION_STUDIO.html',
    'TECHNICAL_ARCHITECTURE.html'
];

// Files that have HTML versions
const htmlVersions = [
    'PROJECT_JOURNAL',
    'README',
    'TECHNICAL_ARCHITECTURE',
    'COMPRESSED_MARKUP_LANGUAGE',
    'CHARACTER_ARCHETYPES',
    'CHARACTER_JOURNALS',
    'CHARACTER_CREATION_STUDIO',
    'USER_AVATAR_SYSTEM',
    'BUSINESS_MODEL',
    'CREATOR_PHILOSOPHY',
    'MOMENTS',
    'BADGES'
];

htmlFiles.forEach(file => {
    const filePath = path.join(websiteDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} - file not found`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Replace links to files that have HTML versions
    htmlVersions.forEach(name => {
        const mdLink = new RegExp(`href=["']${name}\\.md["']`, 'gi');
        const mdLinkText = new RegExp(`>${name}\\.md<`, 'gi');
        
        if (mdLink.test(content) || mdLinkText.test(content)) {
            content = content.replace(mdLink, `href="${name}.html"`);
            content = content.replace(mdLinkText, `>${name}.html<`);
            changed = true;
        }
    });
    
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`ℹ️  No changes needed for ${file}`);
    }
});

console.log('\n✨ Link update complete!');

