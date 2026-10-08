import { deriveKey, newSalt, seal, unseal } from './vault.js';
const $ = id => document.getElementById(id);
const prefix = 'youssef-notebook-v1:';
let mode = 'login', key = null, salt = '', username = '', notes = [], timer, expires = 0, savedRecord = '', revision = 0;
function lock(message = 'Notebook locked. Unlock it with your passphrase.') {
  revision++; clearTimeout(timer); key = null; notes = []; expires = 0;
  $('notes').replaceChildren(); $('note-body').value = ''; $('password').value = '';
  $('note-count').textContent = '0 / 1,000 characters';
  $('notebook').hidden = true; $('auth-area').hidden = false;
  $('lab-status').textContent = message;
}
function assertUnlocked() {
  if (!key || Date.now() >= expires) { lock(); throw Error('Please unlock your notebook again.'); }
}
async function save(next) {
  assertUnlocked();
  const currentRevision = revision;
  // Avoid silently overwriting changes from another tab.
  if (localStorage.getItem(prefix + username) !== savedRecord) { lock(); throw Error('Notebook changed in another tab. Unlock it again.'); }
  const record = JSON.stringify(await seal(next, key, salt));
  if (currentRevision !== revision) throw Error('Notebook was locked. Unlock it and try again.');
  assertUnlocked();
  localStorage.setItem(prefix + username, record);
  savedRecord = record; notes = next; render();
}
function render() {
  $('notes').replaceChildren();
  if (!notes.length) {
    const p = document.createElement('p'); p.className = 'empty-notes'; p.textContent = 'Your first study note will appear here.'; $('notes').append(p);
  }
  for (const note of notes) {
    const article = document.createElement('article'); article.className = 'note';
    const p = document.createElement('p'); p.textContent = note.body;
    const meta = document.createElement('div'); meta.className = 'note-meta';
    const time = document.createElement('time'); time.textContent = new Date(note.created).toLocaleString();
    const button = document.createElement('button'); button.className = 'delete-note'; button.textContent = 'Delete';
    button.addEventListener('click', async () => {
      if (!confirm('Delete this study note?')) return;
      button.disabled = true;
      try { await save(notes.filter(n => n.id !== note.id)); $('note-message').textContent = 'Note deleted.'; }
      catch (error) { $('note-message').textContent = error.message; button.disabled = false; }
    });
    meta.append(time,button); article.append(p,meta); $('notes').append(article);
  }
}
for (const tab of ['login','register']) $(tab + '-tab').addEventListener('click', () => {
  mode = tab;
  for (const name of ['login','register']) { $(name+'-tab').classList.toggle('selected',name===mode); $(name+'-tab').setAttribute('aria-pressed',String(name===mode)); }
  $('auth-title').textContent = mode === 'login' ? 'Welcome back.' : 'Start a browser notebook.';
  $('auth-description').textContent = 'Saved only in this browser. No installation or server needed.';
  $('auth-submit').textContent = mode === 'login' ? 'Unlock notebook →' : 'Create notebook →';
  $('password').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  $('auth-message').textContent = '';
});
$('auth-form').addEventListener('submit', async event => {
  event.preventDefault(); $('auth-submit').disabled = true; $('auth-message').textContent = 'Opening your notebook…';
  try {
    const name = $('username').value.trim().toLowerCase(), password = $('password').value;
    if (!/^[a-z0-9_]{3,24}$/.test(name) || password.length < 12 || password.length > 128) throw Error('Use a valid notebook name and a 12–128 character passphrase.');
    const raw = localStorage.getItem(prefix + name);
    if (mode === 'register' && raw) throw Error('That notebook already exists here. Choose Unlock.');
    if (mode === 'login' && !raw) throw Error('No notebook with that name in this browser. Create one first.');
    const record = raw ? JSON.parse(raw) : {salt:newSalt()};
    const nextKey = await deriveKey(password, record.salt);
    let nextNotes = [];
    if (raw) { try { nextNotes = await unseal(record,nextKey); } catch { throw Error('Wrong passphrase, or notebook data is damaged.'); } }
    const nextRaw = raw || JSON.stringify(await seal([],nextKey,record.salt));
    if (localStorage.getItem(prefix+name) !== raw) throw Error('Notebook changed in another tab. Try again.');
    if (!raw) localStorage.setItem(prefix+name,nextRaw);
    revision++; username = name; key = nextKey; salt = record.salt; notes = nextNotes; savedRecord = nextRaw;
    $('password').value = ''; $('auth-message').textContent = ''; $('auth-area').hidden = true; $('notebook').hidden = false;
    $('welcome').textContent = name + '’s notebook'; $('lab-status').textContent = 'Unlocked · Encrypted notes saved in this browser only.';
    expires = Date.now()+15*60*1000; clearTimeout(timer); timer = setTimeout(() => lock('Your 15-minute demo session ended.'),15*60*1000);
    $('session-info').textContent = 'Locks after 15 minutes, on refresh, or when you press Lock.';
    $('note-message').textContent = ''; render(); $('note-body').focus();
  } catch(error) { $('auth-message').textContent = error.name === 'QuotaExceededError' ? 'Browser storage is full. Free some space and try again.' : error.message; }
  finally { $('auth-submit').disabled = false; }
});
$('logout').addEventListener('click',() => lock());
$('note-body').addEventListener('input',() => $('note-count').textContent = `${$('note-body').value.length} / 1,000 characters`);
$('note-form').addEventListener('submit',async event => {
  event.preventDefault(); $('save-note').disabled = true;
  try {
    const body = $('note-body').value.trim();
    if (!body || body.length > 1000) throw Error('Enter 1–1,000 characters.');
    if (notes.length >= 50) throw Error('Maximum 50 notes. Delete one first.');
    await save([{id:crypto.randomUUID(),body,created:new Date().toISOString()},...notes]);
    $('note-body').value = ''; $('note-count').textContent = '0 / 1,000 characters'; $('note-message').textContent = 'Saved in this browser.';
  } catch(error) { $('note-message').textContent = error.name === 'QuotaExceededError' ? 'Browser storage is full. Your note was not saved.' : error.message; }
  finally { $('save-note').disabled = false; }
});
window.addEventListener('storage',event => { if (key && (event.key === prefix+username || event.key === null)) lock('Notebook changed in another tab. Unlock again to see it.'); });
window.addEventListener('pagehide',() => lock());
document.addEventListener('visibilitychange',() => { if (key && Date.now() >= expires) lock(); });
try {
  if (!crypto.subtle) throw Error('This demo needs HTTPS and a modern browser.');
  const probe = prefix+'storage-check'; localStorage.setItem(probe,'1'); localStorage.removeItem(probe);
  lock('Ready on GitHub Pages · Create or unlock a browser notebook.');
} catch(error) { $('lab-status').textContent = 'Browser storage or encryption is unavailable. Allow site storage and use HTTPS in a modern browser.'; }
