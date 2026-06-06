const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.vvxsznvqtbubcircsgih:ArthurAdmin243@@@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true' });

async function checkCols() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products'");
        console.log('Columns in products table:', res.rows.map(r => r.column_name));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
checkCols();
