window.Auth = (() => {
  const TOKEN_KEY = 'pie-seminarios-session';
  const userKey = 'pie-seminarios-demo-user';
  function getSession() { try { return JSON.parse(localStorage.getItem(TOKEN_KEY)); } catch (_) { return null; } }
  function saveSession(session) { localStorage.setItem(TOKEN_KEY, JSON.stringify(session)); }
  function clear() { localStorage.removeItem(TOKEN_KEY); }
  async function demoPasswordHash(password,salt) {
    if(!window.crypto?.subtle)throw new Error('El navegador no permite crear cuentas demo; utiliza localhost o HTTPS');
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+password));
    return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function createDemoAdmin(user) {
    const data=await Admin.loadManagement();
    const admins=data.demoAdmins||[];
    const username=user.username.toLowerCase();
    if(['admin','evaluador'].includes(username)||admins.some(a=>a.username.toLowerCase()===username)||data.evaluators.some(e=>e.username.toLowerCase()===username))throw new Error('El usuario ya existe');
    if(!window.crypto?.subtle)throw new Error('El navegador no permite crear cuentas demo; utiliza localhost o HTTPS');
    const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
    const hash=await demoPasswordHash(user.password,salt);
    data.demoAdmins=[...admins,{name:user.name,username:user.username,salt,hash}];
    Admin.saveDemo(data);
  }
  async function login(username, password) {
    if (API.isDemo()) {
      if (username === 'admin' && password === 'admin123') return {token:'demo-admin', role:'admin', name:'Administrador'};
      if (username === 'evaluador' && password === 'evaluador123') {
        const data=await Admin.load();
        if(data.evaluators.some(e=>e.username===username&&e.state==='Activo'))return {token:'demo-evaluator', role:'evaluator', name:'Dr. Ana Evaluadora'};
      }
      const data=await Admin.load();
      const admin=(data.demoAdmins||[]).find(a=>a.username===username);
      if(admin&&await demoPasswordHash(password,admin.salt)===admin.hash)return {token:'demo-admin',role:'admin',name:admin.name};
      throw new Error('Usuario o contraseña incorrectos');
    }
    const result = await API.call('login', {username, password});
    saveSession(result); return result;
  }
  async function logout() { clear(); }
  return { getSession, saveSession, clear, login, logout, createDemoAdmin };
})();
