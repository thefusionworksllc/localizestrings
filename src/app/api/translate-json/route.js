import { NextResponse } from 'next/server';
import { Translate } from '@google-cloud/translate/build/src/v2';

// Initialize the Google Translate API client
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

export async function POST(request) {
  try {
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
          // Translate string values
          try {
            const [translation] = await translate.translate(value, targetLang);
            result[key] = translation;
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
                  const [translation] = await translate.translate(item, targetLang);
                  return translation;
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