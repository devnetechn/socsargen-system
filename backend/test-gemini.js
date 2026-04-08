/**
 * Test script to verify Gemini AI API key is working
 * Run: node test-gemini.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testGeminiAPI = async () => {
  console.log('🔍 Testing Gemini AI API...\n');

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }

  console.log('✅ API Key found in .env');
  console.log(`   Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Test with gemini-2.0-flash (primary model)
    console.log('\n📡 Testing gemini-2.0-flash model...');
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.5
      }
    });

    const result = await model.generateContent('Say "API key is working!" in one sentence.');
    const response = await result.response;
    const text = response.text();

    console.log('✅ Success! Response from Gemini:');
    console.log(`   "${text}"`);
    console.log('\n🎉 Your Gemini API key is working correctly!');

  } catch (error) {
    console.error('\n❌ Error testing Gemini API:');

    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid')) {
      console.error('   Invalid API Key - Please check your GEMINI_API_KEY in .env');
      console.error('   Get a new key at: https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.error('   Rate limit or quota exceeded');
      console.error('   Your key is valid but you may have hit quota limits');
    } else {
      console.error(`   ${error.message}`);
    }

    process.exit(1);
  }
};

testGeminiAPI();
