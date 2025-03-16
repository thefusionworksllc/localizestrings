import { NextResponse } from 'next/server';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Initialize the Google Translate API client
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

// Helper function to check translation cache
async function checkCache(sourceText, targetLanguage, supabase) {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('translated_text')
      .eq('source_text', sourceText)
      .eq('target_language', targetLanguage)
      .single();

    if (error) throw error;
    return data?.translated_text;
  } catch (error) {
    console.error('Cache check error:', error);
    return null;
  }
}

// Helper function to update translation cache
async function updateCache(sourceText, translatedText, targetLanguage, supabase) {
  try {
    await supabase.from('translations').upsert({
      source_text: sourceText,
      translated_text: translatedText,
      target_language: targetLanguage,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache update error:', error);
  }
}

export async function POST(request) {
  try {
    // Create Supabase client for server-side operations
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value; // Get cookie value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options }); // Set cookie value
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options }); // Remove cookie
          },
        },
      }
    );

    const { content, targetLanguage } = await request.json();

    // Validate input
    if (!content || !targetLanguage || !targetLanguage.code) {
      return NextResponse.json(
        { error: 'Missing required fields: content or targetLanguage' },
        { status: 400 }
      );
    }

    // Parse the JSON content
    let jsonContent;
    try {
      jsonContent = JSON.parse(content);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Function to recursively translate all string values in a JSON object
    const translateJsonValues = async (obj, targetLang) => {
      const result = {};
      
      for (const key in obj) {
        const value = obj[key];
        
        if (typeof value === 'string') {
          // Check cache first for translated text
          let translatedText = await checkCache(value, targetLang, supabase);
          
          if (!translatedText) {
            // If not in cache, use Google Translate
            try {
              const [translation] = await translate.translate(value, targetLang);
              translatedText = translation;
              // Update cache with new translation
              await updateCache(value, translatedText, targetLang, supabase);
            } catch (error) {
              console.error(`Error translating "${value}":`, error);
              translatedText = value; // Keep original if translation fails
            }
          }
          
          result[key] = translatedText;
        } else if (typeof value === 'object' && value !== null) {
          // Recursively translate nested objects or arrays
          if (Array.isArray(value)) {
            result[key] = await Promise.all(
              value.map(async (item) => {
                if (typeof item === 'string') {
                  // Check cache first for translated text
                  let translatedText = await checkCache(item, targetLang, supabase);
                  
                  if (!translatedText) {
                    // If not in cache, use Google Translate
                    try {
                      const [translation] = await translate.translate(item, targetLang);
                      translatedText = translation;
                      // Update cache with new translation
                      await updateCache(item, translatedText, targetLang, supabase);
                    } catch (error) {
                      console.error(`Error translating "${item}":`, error);
                      translatedText = item; // Keep original if translation fails
                    }
                  }
                  
                  return translatedText;
                } else if (typeof item === 'object' && item !== null) {
                  return await translateJsonValues(item, targetLang);
                }
                return item;
              })
            );
          } else {
            result[key] = await translateJsonValues(value, targetLang);
          }
        } else {
          // Keep non-string values as is
          result[key] = value;
        }
      }
      
      return result;
    };

    // Translate the JSON content
    const translatedContent = await translateJsonValues(jsonContent, targetLanguage.code);

    return NextResponse.json({ translatedContent });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate content: ' + error.message },
      { status: 500 }
    );
  }
} 