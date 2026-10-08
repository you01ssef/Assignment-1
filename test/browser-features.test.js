import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mathAnswer} from '../css/js/math.js';
import {answerQuestion} from '../css/js/chatbot.js';
import {deriveKey,newSalt,seal,unseal} from '../css/js/vault.js';
test('Nova handles arithmetic safely and introduces its limits',()=>{
 for(const [q,result] of [['2+3*4','14'],['(2+3)*4','20'],['15% of 240','36'],['sqrt(81)','9'],['2^3^2','512'],['-2^2','-4'],['12 times 8','96'],['0.1+0.2','0.3']]) assert.ok(mathAnswer(q).text.endsWith('= '+result),q);
 assert.match(mathAnswer('1/0').text,/undefined/); assert.match(mathAnswer('(2+3').text,/parentheses/);
 assert.equal(mathAnswer('alert(1)'),null); assert.match(answerQuestion('Who are you?').text,/Nova/);
 assert.match(answerQuestion('Where are notes saved?').text,/browser/);
});
test('browser vault encrypts, uses fresh IVs, rejects wrong passwords and tampering',async()=>{
 const salt=newSalt(),key=await deriveKey('a sample test passphrase',salt),notes=[{id:'1',body:'practice note',created:'2026-10-08'}];
 const a=await seal(notes,key,salt),b=await seal(notes,key,salt);
 assert.notEqual(a.iv,b.iv); assert.ok(!JSON.stringify(a).includes('practice note'));
 assert.deepEqual(await unseal(a,key),notes);
 await assert.rejects(unseal(a,await deriveKey('a different passphrase',salt)));
 const damaged={...a,data:(a.data[0]==='A'?'B':'A')+a.data.slice(1)}; await assert.rejects(unseal(damaged,key));
});
