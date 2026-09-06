import { sanitize, totalFor, rankPlayers, bestTotal, isBlankCategory } from './src/lib/score.js';

const P = (id, name) => ({ id, name });
const g = {
  players: [P('a','Ann'), P('b','Bob'), P('c','Cal'), P('d','Dee')],
  categories: [{id:'c1',name:'Objectives'},{id:'c2',name:'Coins'},{id:'c3',name:''}],
  scores: {
    c1: { a: 12, b: 9, c: -3, d: 20 },
    c2: { a: 5,  b: 8, c: 10 },          // Dee blank -> 0
  },
  order: 'high',
};

let fails = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(ok ? '  ok  ' : ' FAIL ', label, '=>', JSON.stringify(got), ok ? '' : `(expected ${JSON.stringify(want)})`);
};

console.log('sanitize');
eq('empty', sanitize(''), {text:'',value:null});
eq('zero', sanitize('0'), {text:'0',value:0});
eq('leading zeros', sanitize('007'), {text:'7',value:7});
eq('minus only', sanitize('-'), {text:'-',value:null});
eq('negative', sanitize('-12'), {text:'-12',value:-12});
eq('letters stripped', sanitize('1a2'), {text:'12',value:12});
eq('minus zero', sanitize('-0'), {text:'-',value:null});
eq('huge clamped', sanitize('12345678901'), {text:'999999999',value:999999999});

console.log('totals  (Ann 12+5, Bob 9+8, Cal -3+10, Dee 20+0)');
eq('Ann', totalFor(g,'a'), 17);
eq('Bob', totalFor(g,'b'), 17);
eq('Cal', totalFor(g,'c'), 7);
eq('Dee', totalFor(g,'d'), 20);
eq('best (high)', bestTotal(g), 20);
eq('best (low)', bestTotal({...g, order:'low'}), 7);

console.log('ranking, high wins, with a tie at 17');
eq('ranks', rankPlayers(g).map(r=>`${r.name}:${r.total}:${r.rank}${r.tied?'T':''}`), ['Dee:20:1','Ann:17:2T','Bob:17:2T','Cal:7:4']);

console.log('ranking, low wins');
eq('ranks', rankPlayers({...g, order:'low'}).map(r=>`${r.name}:${r.total}:${r.rank}`), ['Cal:7:1','Ann:17:2','Bob:17:2','Dee:20:4']);

console.log('blank category detection');
eq('c3 blank', isBlankCategory(g, g.categories[2]), true);
eq('c1 not blank', isBlankCategory(g, g.categories[0]), false);

console.log(fails ? `\n${fails} FAILURES` : '\nall checks passed');
process.exit(fails ? 1 : 0);
