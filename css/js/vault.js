// Browser-only demonstration. No passwords or decrypted notes are persisted.
const encode = value => btoa(new Uint8Array(value).reduce((text, byte) => text + String.fromCharCode(byte), ''));
const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export async function deriveKey(password, salt) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: decode(salt), iterations: 600000 }, material, {name:'AES-GCM',length:256}, false, ['encrypt','decrypt']);
}
export const newSalt = () => encode(crypto.getRandomValues(new Uint8Array(16)));
export async function seal(notes, key, salt) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({name:'AES-GCM',iv}, key, new TextEncoder().encode(JSON.stringify(notes)));
  return {version:1, salt, iv:encode(iv), data:encode(data)};
}
export async function unseal(record, key) {
  const data = await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(record.iv)}, key, decode(record.data));
  const notes = JSON.parse(new TextDecoder().decode(data));
  if (!Array.isArray(notes) || notes.length > 50 || notes.some(n => typeof n.body !== 'string' || n.body.length > 1000 || typeof n.id !== 'string' || typeof n.created !== 'string')) throw Error('Invalid notebook.');
  return notes;
}
