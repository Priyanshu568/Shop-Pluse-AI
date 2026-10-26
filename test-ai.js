require('dotenv').config();
(async () => {
  const base = process.env.OPENAI_BASE_URL.replace(/\/?$/, '/');
  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY };
  console.log('Model:', process.env.OPENAI_MODEL);

  const chat = await fetch(base + 'chat/completions', {
    method: 'POST', headers,
    body: JSON.stringify({ model: process.env.OPENAI_MODEL, messages: [{ role: 'user', content: 'Say hi' }] }),
  });
  console.log('CHAT STATUS:', chat.status);
  console.log((await chat.text()).slice(0, 600));

  const models = await fetch(base + 'models', { headers });
  console.log('MODELS STATUS:', models.status);
  console.log((await models.text()).slice(0, 1500));
})();