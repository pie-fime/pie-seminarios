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
      const data=await Admin.load();
      const account=(data.demoAccounts||{})[username.toLowerCase()];
      if(account&&await demoPasswordHash(password,account.salt)===account.hash)
        return {token:`demo-${account.role}`,role:account.role,name:account.name,username:account.username,email:account.email||''};
      if (username === 'admin' && password === 'admin123') return {token:'demo-admin', role:'admin', name:'Administrador',username:'admin',email:''};
      if (username === 'evaluador' && password === 'evaluador123') {
        const evaluator=data.evaluators.find(e=>e.username===username&&e.state==='Activo');
        if(evaluator)return {token:'demo-evaluator', role:'evaluator', name:evaluator.name,username:evaluator.username,email:evaluator.email};
      }
      const admin=(data.demoAdmins||[]).find(a=>a.username===username);
      if(admin&&await demoPasswordHash(password,admin.salt)===admin.hash)return {token:'demo-admin',role:'admin',name:admin.name,username:admin.username,email:''};
      throw new Error('Usuario o contraseña incorrectos');
    }
    const result = await API.call('login', {username, password});
    saveSession(result); return result;
  }
  async function updateProfile(profile) {
    const session=getSession();
    if(!session)throw new Error('Sesión inválida o vencida');
    if(!API.isDemo()){
      const result=await API.call('updateProfile',{profile},session.token);
      saveSession({...session,...result});
      return result;
    }
    const data=await Admin.load();
    const username=session.username||((session.role==='admin')?'admin':'evaluador');
    const accounts=data.demoAccounts||{};
    const account=accounts[username.toLowerCase()];
    const currentValid=account
      ? await demoPasswordHash(profile.currentPassword,account.salt)===account.hash
      : (session.role==='admin'&&username==='admin'&&profile.currentPassword==='admin123') ||
        (session.role==='evaluator'&&username==='evaluador'&&profile.currentPassword==='evaluador123');
    if(!currentValid)throw new Error('La contraseña actual es incorrecta');
    const name=String(profile.name||'').trim(), newUsername=String(profile.username||'').trim();
    if(!name||!newUsername||/\s/.test(newUsername)||name.startsWith('=')||newUsername.startsWith('='))
      throw new Error('Introduce un nombre y un usuario válidos, sin espacios en el usuario');
    const evaluator=data.evaluators.find(item=>item.username.toLowerCase()===username.toLowerCase());
    if(session.role==='evaluator'&&(!profile.email||String(profile.email).trim().startsWith('=')))throw new Error('Introduce un correo válido');
    const otherUsers=[...Object.keys(accounts),...data.evaluators.map(item=>item.username.toLowerCase()),'admin','evaluador']
      .filter(item=>item!==username.toLowerCase());
    if(otherUsers.includes(newUsername.toLowerCase()))throw new Error('El usuario ya existe');
    const newPassword=String(profile.newPassword||'');
    if(newPassword&&(newPassword.length<12||!newPassword.trim()))throw new Error('La nueva contraseña debe tener al menos 12 caracteres y no estar vacía');
    const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
    const hash=await demoPasswordHash(newPassword||profile.currentPassword,salt);
    data.demoAccounts={...accounts,[newUsername.toLowerCase()]:{name,username:newUsername,email:profile.email||evaluator?.email||'',role:session.role,salt,hash}};
    if(account&&username.toLowerCase()!==newUsername.toLowerCase())delete data.demoAccounts[username.toLowerCase()];
    if(evaluator){evaluator.name=name;evaluator.email=profile.email;evaluator.username=newUsername;}
    Admin.saveDemo(data);
    const result={name,username:newUsername,email:profile.email||evaluator?.email||''};
    saveSession({...session,...result}); return result;
  }
  async function logout() { clear(); }
  return { getSession, saveSession, clear, login, logout, updateProfile, createDemoAdmin };
})();
