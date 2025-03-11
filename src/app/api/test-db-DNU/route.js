import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET() {
  try {
    // Test insert
    const testData = {
      source_text: 'Hello, world!',
      target_language: 'es',
      translated_text: '¡Hola, mundo!'
    };

    const { data, error } = await supabase
      .from('translations')
      .insert(testData)
      .select();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
