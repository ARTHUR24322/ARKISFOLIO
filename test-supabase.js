const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing with URL:', supabaseUrl);
    console.log('Testing with Key:', supabaseKey ? 'PRESENT' : 'MISSING');
    
    const { data, error } = await supabase.from('messages').select('*').limit(1);
    
    if (error) {
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
    } else {
        console.log('Success! Data:', data);
    }
}

test();
