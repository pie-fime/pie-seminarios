window.Auth = (() => {
  const TOKEN_KEY = 'pie-seminarios-session';
  function getSession() { try { return JSON.parse(localStorage.getItem(TOKEN_KEY)); } catch (_) { return null; } }
  function saveSession(session) { localStorage.setItem(TOKEN_KEY, JSON.stringify(session)); }
  function clear() { localStorage.removeItem(TOKEN_KEY); }
  async function demoPasswordHash(password,salt) {
    if(!window.crypto?.subtle)throw new Error('El navegador no permite crear cuentas demo; utiliza localhost o HTTPS');
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+password));
    return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function loadDemoData() {
    const data=await Admin.load();
    const legacy=data.demoAccounts;
    if(!legacy)return data;
    const accounts=Object.values(legacy);
    if(accounts.filter(a=>a.role==='admin').length>1||accounts.filter(a=>a.role==='evaluator').length>1)
      throw new Error('No se pudieron migrar las cuentas demo: hay registros duplicados');
    for(const account of accounts){
      if(!account.username||!account.salt||!account.hash)throw new Error('No se pudo migrar una cuenta demo incompleta');
      if(account.role==='admin'){
        if(data.demoDefaultAdmin||(data.demoAdmins||[]).some(a=>a.username.toLowerCase()===account.username.toLowerCase()))
          throw new Error('No se pudo migrar la cuenta demo de administrador');
        data.demoDefaultAdmin={name:account.name,username:account.username,salt:account.salt,hash:account.hash};
      }else if(account.role==='evaluator'){
        const evaluator=data.evaluators.find(e=>e.id==='EV-001'&&e.username===account.username);
        if(!evaluator||evaluator.demoAuth)throw new Error('No se pudo migrar la cuenta demo de evaluador');
        evaluator.demoAuth={salt:account.salt,hash:account.hash};
      }else throw new Error('No se pudo migrar una cuenta demo con rol desconocido');
    }
    delete data.demoAccounts;
    Admin.saveDemo(data);
    return data;
  }
  async function createDemoAdmin(user) {
    const data=await loadDemoData();
    const admins=data.demoAdmins||[];
    const username=user.username.toLowerCase();
    if(demoUsernameTaken(data,username))throw new Error('El usuario ya existe');
    if(!window.crypto?.subtle)throw new Error('El navegador no permite crear cuentas demo; utiliza localhost o HTTPS');
    const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
    const hash=await demoPasswordHash(user.password,salt);
    data.demoAdmins=[...admins,{name:user.name,username:user.username,salt,hash}];
    Admin.saveDemo(data);
  }
  async function login(username, password) {
    if (API.isDemo()) {
      const data=await loadDemoData();
      const defaultAdmin=data.demoDefaultAdmin||{name:'Administrador',username:'admin'};
      if(defaultAdmin.username===username && (defaultAdmin.hash
        ? await demoPasswordHash(password,defaultAdmin.salt)===defaultAdmin.hash : password==='admin123'))
        return {token:'demo-admin',role:'admin',name:defaultAdmin.name,username:defaultAdmin.username};
      const evaluator=data.evaluators.find(e=>e.id==='EV-001'&&e.username===username&&e.state==='Activo');
      if(evaluator && (evaluator.demoAuth
        ? await demoPasswordHash(password,evaluator.demoAuth.salt)===evaluator.demoAuth.hash : username==='evaluador'&&password==='evaluador123'))
        return {token:'demo-evaluator',role:'evaluator',name:evaluator.name,username:evaluator.username,email:evaluator.email};
      const admin=(data.demoAdmins||[]).find(a=>a.username===username);
      if(admin&&await demoPasswordHash(password,admin.salt)===admin.hash)return {token:'demo-admin',role:'admin',name:admin.name,username:admin.username,email:''};
      throw new Error('Usuario o contraseña incorrectos');
    }
    const result = await API.call('login', {username, password});
    saveSession(result); return result;
  }
  function demoUsernameTaken(data,username) {
    const key=username.toLowerCase();
    return ['admin','evaluador'].includes(key) ||
      (data.demoDefaultAdmin?.username||'admin').toLowerCase()===key ||
      (data.demoAdmins||[]).some(a=>a.username.toLowerCase()===key) ||
      data.evaluators.some(e=>e.username.toLowerCase()===key);
  }
  async function getProfile() {
    const session=getSession();
    if(!session)throw new Error('Sesión inválida o vencida');
    if(!API.isDemo())return API.call('getProfile',{},session.token);
    if(!session.username)throw new Error('Cierra sesión y vuelve a entrar para actualizar tu perfil');
    const data=await loadDemoData();
    const account=session.role==='evaluator'
      ? data.evaluators.find(e=>e.id==='EV-001'&&e.username===session.username&&e.state==='Activo')
      : [data.demoDefaultAdmin||{name:'Administrador',username:'admin'},...(data.demoAdmins||[])].find(a=>a.username===session.username);
    if(!account)throw new Error('No se encontró la cuenta; cierra sesión y vuelve a entrar');
    return {name:account.name,username:account.username,email:account.email||''};
  }
  async function updateProfile(profile) {
    const session=getSession();
    if(!session)throw new Error('Sesión inválida o vencida');
    if(!API.isDemo()){
      const result=await API.call('updateProfile',{profile},session.token);
      saveSession({...session,...result});
      return result;
    }
    const data=await loadDemoData();
    if(!session.username)throw new Error('Cierra sesión y vuelve a entrar para actualizar tu perfil');
    const username=session.username;
    const defaultAdmin=data.demoDefaultAdmin||{name:'Administrador',username:'admin'};
    const evaluator=session.role==='evaluator'?data.evaluators.find(e=>e.id==='EV-001'&&e.username===username&&e.state==='Activo'):null;
    const admin=session.role==='admin'?[defaultAdmin,...(data.demoAdmins||[])].find(a=>a.username===username):null;
    const account=evaluator||admin;
    if(!account)throw new Error('No se encontró la cuenta; cierra sesión y vuelve a entrar');
    const credentials=evaluator?.demoAuth||admin;
    const currentValid=credentials?.hash
      ? await demoPasswordHash(profile.currentPassword,credentials.salt)===credentials.hash
      : (admin===defaultAdmin&&username==='admin'&&profile.currentPassword==='admin123') ||
        (evaluator&&username==='evaluador'&&profile.currentPassword==='evaluador123');
    if(!currentValid)throw new Error('La contraseña actual es incorrecta');
    const name=String(profile.name||'').trim(), newUsername=String(profile.username||'').trim();
    if(!name||!newUsername||/\s/.test(newUsername)||name.startsWith('=')||newUsername.startsWith('='))
      throw new Error('Introduce un nombre y un usuario válidos, sin espacios en el usuario');
    const email=String(profile.email||'').trim();
    if(evaluator&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Introduce un correo válido');
    if(evaluator&&data.evaluators.some(item=>item!==evaluator&&item.email.toLowerCase()===email.toLowerCase()))throw new Error('El correo ya está registrado');
    if(newUsername.toLowerCase()!==username.toLowerCase()&&demoUsernameTaken(data,newUsername))throw new Error('El usuario ya existe');
    const newPassword=String(profile.newPassword||'');
    if(newPassword&&(newPassword.length<12||!newPassword.trim()))throw new Error('La nueva contraseña debe tener al menos 12 caracteres y no estar vacía');
    if(!window.crypto?.subtle)throw new Error('El navegador no permite actualizar cuentas demo; utiliza localhost o HTTPS');
    const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
    const hash=await demoPasswordHash(newPassword||profile.currentPassword,salt);
    account.name=name;account.username=newUsername;
    if(evaluator){evaluator.email=email;evaluator.demoAuth={salt,hash};}
    else {admin.salt=salt;admin.hash=hash;if(admin===defaultAdmin)data.demoDefaultAdmin=admin;}
    Admin.saveDemo(data);
    const result={name,username:newUsername,email:evaluator?email:''};
    saveSession({...session,...result}); return result;
  }
  async function logout() { clear(); }
  return { getSession, saveSession, clear, login, logout, getProfile, updateProfile, createDemoAdmin, demoUsernameTaken };
})();
