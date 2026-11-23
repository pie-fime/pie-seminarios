window.API = (() => {
  const CONFIG_KEY = 'pie-seminarios-api-url';
  let baseUrl = localStorage.getItem(CONFIG_KEY) || 'https://script.google.com/macros/s/AKfycbyt_73hwKEzKGJeU_n6xtiume8_xPZegTcde7iRAion-EItTt7B_hUurSHoAZfnVnrM/exec';
  const demo = window.location.protocol === 'file:' || !baseUrl;

  function setUrl(url) {
    baseUrl = String(url || '').trim();
    if (baseUrl) localStorage.setItem(CONFIG_KEY, baseUrl);
    else localStorage.removeItem(CONFIG_KEY);
  }
  async function call(action, payload = {}, token = '') {
    if (demo) throw new Error('API_NO_CONFIGURADA');
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify({...payload, action, token})
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || 'Error del servidor');
    return data.data;
  }
  function isDemo() { return demo; }
  return { call, setUrl, isDemo };
})();
