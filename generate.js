export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const formData = await req.formData();
    const prompt = formData.get('prompt');
    if (!prompt) return new Response('Missing prompt', { status: 400 });

    const imageFile = formData.get('image');
    if (!imageFile) return new Response('Missing image', { status: 400 });

    // Prepare multipart/form-data to OpenAI
    const ff = new FormData();
    ff.append('image', imageFile, imageFile.name);
    ff.append('prompt', prompt);
    ff.append('size', formData.get('size') || '1024x1024');
    ff.append('n', '1');
    ff.append('response_format', 'b64_json');

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return new Response('Server missing OPENAI_API_KEY', { status: 500 });

    const openaiRes = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY },
      body: ff
    });

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      return new Response('OpenAI error: ' + txt, { status: 500 });
    }

    const data = await openaiRes.json();
    const b64 = data?.data?.[0]?.b64_json || null;
    if (!b64) return new Response(JSON.stringify({ error: 'No b64' , debug: data }), { status: 500, headers: { 'Content-Type': 'application/json' }});

    return new Response(JSON.stringify({ base64: b64 }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    return new Response('Server error: ' + err.message, { status: 500 });
  }
}
