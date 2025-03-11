export async function GET() {
  try {
    const testText = 'Hello, how are you?';
    const targetLanguage = 'es'; // Spanish

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: testText,
          target: targetLanguage,
          format: 'text'
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return new Response(JSON.stringify({
      success: true,
      original: testText,
      translation: data.data.translations[0].translatedText,
      targetLanguage
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Translation test error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
