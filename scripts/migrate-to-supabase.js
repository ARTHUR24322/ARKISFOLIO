const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement manuellement pour le script
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split(/\r?\n/).forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine && !cleanLine.startsWith('#')) {
        const [key, ...valueParts] = cleanLine.split('=');
        if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Erreur: URL ou Clé Supabase manquante dans .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Début de la migration...');

    // 1. Migration des produits
    const productsPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(productsPath)) {
        console.log('Migration des produits...');
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        for (const p of products) {
            const { error } = await supabase.from('products').upsert({
                id: p.id,
                type: p.type,
                badge: p.badge,
                title: p.title,
                description: p.description,
                price: p.price,
                currency: p.currency,
                gradient: p.gradient,
                accent: p.accent,
                emoji: p.emoji,
                features: p.features,
                cta: p.cta,
                published: p.published !== undefined ? p.published : true,
                featured: p.featured !== undefined ? p.featured : false,
                image_url: p.imageUrl || '',
                external_link: p.externalLink || '',
                updated_at: p.updatedAt || new Date().toISOString()
            });
            if (error) console.error(`Erreur produit ${p.id}:`, error.message);
        }
    }

    // 2. Migration des projets
    const projectsPath = path.join(__dirname, '../data/projects.json');
    if (fs.existsSync(projectsPath)) {
        console.log('Migration des projets...');
        const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        for (const p of projects) {
            const { error } = await supabase.from('projects').upsert({
                id: p.id,
                category: p.category,
                title: p.title,
                description: p.description,
                emoji: p.emoji,
                gradient: p.gradient,
                accent: p.accent,
                tags: p.tags,
                live_url: p.liveUrl || '',
                year: p.year || '',
                published: p.published !== undefined ? p.published : true,
                media_url: p.mediaUrl || '',
                updated_at: p.updatedAt || new Date().toISOString()
            });
            if (error) console.error(`Erreur projet ${p.id}:`, error.message);
        }
    }

    // 3. Migration des messages
    const messagesPath = path.join(__dirname, '../data/messages.json');
    if (fs.existsSync(messagesPath)) {
        console.log('Migration des messages...');
        const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
        for (const m of messages) {
            const { error } = await supabase.from('messages').upsert({
                id: m.id,
                name: m.name,
                email: m.email,
                message: m.message,
                date: m.date,
                read: m.read !== undefined ? m.read : false
            });
            if (error) console.error(`Erreur message ${m.id}:`, error.message);
        }
    }

    // 4. Migration de l'analytique
    const analyticsPath = path.join(__dirname, '../data/analytics.json');
    if (fs.existsSync(analyticsPath)) {
        console.log('Migration de l\'analytique...');
        const a = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
        const { error } = await supabase.from('analytics').upsert({
            id: 1,
            visits: a.visits || 0,
            clicks: a.clicks || 0,
            revenue: a.revenue || 0,
            last_update: a.lastUpdate || new Date().toISOString()
        });
        if (error) console.error(`Erreur analytique:`, error.message);
    }

    console.log('Migration terminée !');
}

migrate();
