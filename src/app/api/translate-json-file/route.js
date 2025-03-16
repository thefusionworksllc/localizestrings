export const runtime = 'nodejs';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create the Supabase admin client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CHARACTER_LIMIT = 5000;

async function translateText(text, targetLanguage) {
  if (!text || !targetLanguage) {
    throw new Error('Missing required fields: text or target language');
  }

  try {
    if (text.length > CHARACTER_LIMIT) {
      console.log(`Skipping translation: Text exceeds ${CHARACTER_LIMIT} characters:`, text.substring(0, 50) + '...');
      return text; // Return original text if too long
    }

    // Check cache first using admin client
    const { data: cachedTranslation } = await supabaseAdmin
      .from('translations')
      .select('translated_text')
      .eq('source_text', text)
      .eq('target_language', targetLanguage)
      .single();

    if (cachedTranslation) {
      console.log('Cache hit:', { text: text.substring(0, 50) + '...', translation: cachedTranslation.translated_text });
      return cachedTranslation.translated_text;
    }

    // If not in cache, translate using Google API
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: 'text'
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Translate API error:', data);
      throw new Error(data.error?.message || 'Translation API failed');
    }

    const translation = data.data.translations[0].translatedText;

    // Cache the translation using admin client
    try {
      await supabaseAdmin.from('translations').insert({
        source_text: text,
        translated_text: translation,
        target_language: targetLanguage,
        created_at: new Date().toISOString()
      });
    } catch (cacheError) {
      console.error('Cache insert error:', cacheError);
      // Don't fail the translation if caching fails
    }

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

// Function to recursively translate all string values in a JSON object
async function translateJsonValues(obj, targetLanguage) {
  const result = {};
  
  for (const key in obj) {
    const value = obj[key];
    
    if (typeof value === 'string') {
      // Translate string values
      try {
        const translatedText = await translateText(value, targetLanguage);
        result[key] = translatedText;
      } catch (error) {
        console.error(`Error translating "${value}":`, error);
        result[key] = value; // Keep original if translation fails
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively translate nested objects or arrays
      if (Array.isArray(value)) {
        result[key] = await Promise.all(
          value.map(async (item) => {
            if (typeof item === 'string') {
              const translatedText = await translateText(item, targetLanguage);
              return translatedText;
            } else if (typeof item === 'object' && item !== null) {
              return await translateJsonValues(item, targetLanguage);
            }
            return item;
          })
        );
      } else {
        result[key] = await translateJsonValues(value, targetLanguage);
      }
    } else {
      // Keep non-string values as is
      result[key] = value;
    }
  }
  
  return result;
}

export async function POST(request) {
  console.log('JSON File Translation request received');
  try {
    // Clone the request before reading the body
    const clonedRequest = request.clone();

    // Now process the form data from the original request
    const formData = await request.formData();
    const file = formData.get('file');
    const targetLanguagesStr = formData.get('targetLanguages');

    if (!file || !targetLanguagesStr) {
      return new Response(JSON.stringify({ error: 'Missing file or target languages' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const targetLanguages = JSON.parse(targetLanguagesStr);

    if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid target languages format' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileContent = await file.text();
    const fileName = file.name;
    const fileNameWithoutExt = fileName.replace('.json', '');

    // Parse the JSON content
    let jsonContent;
    try {
      jsonContent = JSON.parse(fileContent);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid JSON format' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process translations for each target language
    const translations = await Promise.all(targetLanguages.map(async (lang) => {
      if (!lang || !lang.code || !lang.name) {
        throw new Error('Invalid language object format');
      }
      
      console.log('Translating to:', lang.name, '(', lang.code, ')');
      const translatedContent = await translateJsonValues(jsonContent, lang.code);
      const languageName = lang.name.replace(/\s+/g, ''); // Remove spaces from language name
      const translatedFileName = `translated_${languageName}_${fileNameWithoutExt}.json`;
      
      return {
        content: JSON.stringify(translatedContent, null, 2),
        fileName: translatedFileName
      };
    }));

    return new Response(JSON.stringify({ translations }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Translation failed' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 