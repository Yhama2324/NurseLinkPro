import fetch from 'node-fetch';

async function testCurriculumAPI() {
  try {
    console.log('Testing /api/curriculum/subjects...');
    const response = await fetch('http://localhost:5000/api/curriculum/subjects');
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    console.log('Status:', response.status);
    
    const text = await response.text();
    console.log('Response (first 500 chars):', text.substring(0, 500));
    
    if (contentType?.includes('application/json')) {
      const data = JSON.parse(text);
      console.log('\nTotal subjects:', data.length);
      if (data.length > 0) {
        console.log('First subject:', JSON.stringify(data[0], null, 2));
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testCurriculumAPI();
