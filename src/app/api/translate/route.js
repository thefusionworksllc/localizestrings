export const runtime = 'nodejs';

import { createClient } from '@supabase/supabase-js';
import xmljs from 'xml-js';
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

async function translateXliffContent(fileContent, targetLanguage) {
  try {
    const xmlObj = xmljs.xml2js(fileContent, { compact: true });

    // Extract all translatable units
    const units = xmlObj.xliff.file.body['trans-unit'];
    const translationUnits = Array.isArray(units) ? units : [units];

    // Translate each unit
    for (const unit of translationUnits) {
      if (unit.source && unit.source._text) {
        const sourceText = unit.source._text;
        const translatedText = await translateText(sourceText, targetLanguage);
        unit.target = { _text: translatedText };
      }
    }

    // Convert back to XML
    const translatedXml = xmljs.js2xml(xmlObj, { compact: true, spaces: 2 });
    return translatedXml;
  } catch (error) {
    console.error('XLIFF translation error:', error);
    throw error;
  }
}

export async function POST(request) {
  console.log('Translation request received');
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
    const fileNameWithoutExt = fileName.replace('.xliff', '');

    // Process translations for each target language
    const translations = await Promise.all(targetLanguages.map(async (lang) => {
      if (!lang || !lang.code || !lang.name) {
        throw new Error('Invalid language object format');
      }
      
      console.log('Translating to:', lang.name, '(', lang.code, ')');
      const translatedContent = await translateXliffContent(fileContent, lang.code);
      const languageName = lang.name.replace(/\s+/g, ''); // Remove spaces from language name
      const translatedFileName = `translated_${languageName}_${fileNameWithoutExt}.xliff`;
      
      return {
        content: translatedContent,
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