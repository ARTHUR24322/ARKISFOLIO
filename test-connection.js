const dns = require('dns');
const net = require('net');

const host = 'db.vvxsznvqtbubcircsgih.supabase.co';
const port = 6543;

console.log(`--- Test de connexion vers ${host} ---`);

dns.lookup(host, (err, address) => {
    if (err) {
        console.error('❌ ERREUR DNS (L\'hôte est introuvable) :', err.message);
        console.log('👉 Essayez de changer votre DNS pour 8.8.8.8 sur votre ordinateur.');
    } else {
        console.log(`✅ Succès DNS : ${host} est à l'adresse ${address}`);
        
        const socket = new net.Socket();
        console.log(`--- Tentative de connexion au port ${port}... ---`);
        
        socket.setTimeout(5000);
        socket.connect(port, address, () => {
            console.log(`✅ SUCCÈS : Le port ${port} est ouvert et accessible.`);
            socket.destroy();
        });

        socket.on('error', (e) => {
            console.error(`❌ ERREUR RÉSEAU (Le port est bloqué ou fermé) :`, e.message);
            socket.destroy();
        });

        socket.on('timeout', () => {
            console.error('❌ DÉLAI DÉPASSÉ (Timeout) : Le serveur ne répond pas.');
            socket.destroy();
        });
    }
});
