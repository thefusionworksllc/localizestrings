import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import convert from 'xml-js';

// Helper function to translate text using Google Translate API
async function translateText(text, targetLanguage) {
  if (!text || !targetLanguage) {
    throw new Error('Missing required fields: text or target language');
  }

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'text'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Translation API error:', data);
      throw new Error(data.error?.message || 'Translation API error');
    }

    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}
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
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body = await request.json();
    const { content, targetLanguage } = body;

    if (!content || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse XLIFF content
    const xmlObj = convert.xml2js(content, {
      compact: true,
      spaces: 2,
      ignoreComment: true,
      ignoreDeclaration: true
    });

    // Find all source elements and their corresponding target elements
    const processNode = async (node) => {
      if (node['source'] && node['target']) {
        const sourceText = node['source']._text;
        
        // Check cache first
        let translatedText = await checkCache(sourceText, targetLanguage.code, supabase);
        
        if (!translatedText) {
          // If not in cache, use Google Translate
          translatedText = await translateText(sourceText, targetLanguage.code);
          // Update cache
          await updateCache(sourceText, translatedText, targetLanguage.code, supabase);
        }
        
        // Update target element
        node['target']._text = translatedText;
      }
      
      // Recursively process child elements
      for (const key in node) {
        if (typeof node[key] === 'object') {
          await processNode(node[key]);
        }
      }
    };

    // Process the entire XLIFF document
    await processNode(xmlObj);

    // Convert back to XML
    const translatedContent = convert.js2xml(xmlObj, {
      compact: true,
      spaces: 2,
      ignoreComment: true,
      ignoreDeclaration: true
    });

    return NextResponse.json({ translatedContent });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
