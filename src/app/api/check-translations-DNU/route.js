'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET() {
  try {
    // Get all translations
    const { data: translations, error } = await supabase
      .from('translations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: translations.length,
        translations 
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching translations:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
