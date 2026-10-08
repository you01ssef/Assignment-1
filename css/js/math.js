// A small arithmetic parser. Never evaluate user input as JavaScript.
export function mathAnswer(question) {
  let text = question.toLowerCase().trim().replace(/[?=]+$/g,'').replace(/^(please\s+)?(what is|what's|calculate|compute|solve)\s+/,'').trim();
  const percent = text.match(/^(-?\d+(?:\.\d+)?)\s*(?:%|percent)\s+of\s+(-?\d+(?:\.\d+)?)$/);
  if (percent) return {text:`${percent[1]}% of ${percent[2]} = ${Number((Number(percent[1])*Number(percent[2])/100).toPrecision(12))}`,id:'math'};
  text = text.replace(/square root of\s+(-?\d+(?:\.\d+)?)/g,'sqrt($1)').replace(/to the power of/g,'^').replace(/multiplied by|times/g,'*').replace(/divided by/g,'/').replace(/plus/g,'+').replace(/minus/g,'-').replace(/[×x]/g,'*').replace(/÷/g,'/').replace(/\*\*/g,'^');
  if (!/\d/.test(text) || /[a-z]/.test(text.replace(/sqrt/g,''))) return null;
  if (!/^[\d\s.+\-*/^()%sqrt]+$/.test(text)) return null;
  try {
    const source=text.replace(/\s/g,'');
    const tokens=source.match(/sqrt|(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/^%]/g) || [];
    if(tokens.join('')!==source || tokens.length>100) throw Error('Use a shorter arithmetic expression.');
    let i=0;
    function primary() {
      const t=tokens[i++]; let value;
      if(t==='(') { value=sum(); if(tokens[i++]!==')') throw Error('Check your parentheses.'); }
      else if(t==='sqrt') { if(tokens[i++]!=='(') throw Error('Use sqrt(25).'); value=Math.sqrt(sum()); if(tokens[i++]!==')') throw Error('Check your parentheses.'); }
      else { if(!t || !/^(\d|\.)/.test(t)) throw Error('Check your expression.'); value=Number(t); }
      while(tokens[i]==='%') {i++;value/=100;}
      return value;
    }
    function power(){const value=primary();return tokens[i]==='^'?(i++,value**unary()):value;}
    function unary(){if(tokens[i]==='+'){i++;return unary();}if(tokens[i]==='-'){i++;return -unary();}return power();}
    function product(){let value=unary();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],right=unary();if(op==='/'&&right===0)throw Error('Division by zero is undefined.');value=op==='*'?value*right:value/right;}return value;}
    function sum(){let value=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],right=product();value=op==='+'?value+right:value-right;}return value;}
    const value=sum();
    if(i!==tokens.length) throw Error('Use explicit operators, for example 2 * (3 + 4).');
    if(!Number.isFinite(value)) throw Error('That result is outside the real-number range I support.');
    return {text:`${text} = ${Number(value.toPrecision(12))}`,id:'math'};
  } catch(error) {return {text:error.message+' I can do arithmetic, powers, percentages, and square roots.',id:'math'};}
}
