/**
 * Created by yangm11 on 6/15/2017.
 */
'use strict';

function countGC(s) {
  let sc = s.toUpperCase();
  let count = 0;
  for (let i = 0; i < sc.length; i++) {
    if (sc[i] === 'G' || sc[i] === 'C') {
      count += 1;
    }
  }
  return count;
}

function gcRatio(s) {
  let sc = s.toUpperCase();
  let count = 0;
  for (let i = 0; i < sc.length; i++) {
    if (sc[i] === 'G' || sc[i] === 'C') {
      count += 1;
    }
  }
  return +((count / sc.length).toFixed(2));
}

function countTail(s) {
  let sc = s.toUpperCase();
  let count = 0;
  let len = sc.length;
  for (let i = 1; i <= len; i++) {
    if (sc[len - i] === 'G' || sc[len - i] === 'C') {
      count += 1;
    } else {
      break;
    }
  }
  // console.log(count);
  return count;
}

function gcScore(str1, str2) {
  let gc1 = gcRatio(str1) * 100;
  let gc2 = gcRatio(str2) * 100;

  return (10 - Math.abs(50 - gc1)) * 2 + (10 - Math.abs(50 - gc2)) * 2 + (10 - Math.abs(gc1 - gc2)) * 6;
}

function tailScore(str1, str2) {
  let t1 = countTail(str1);
  let t2 = countTail(str2);
  function ts (n) {
    switch (n) {
      case 0:
        return 4;
      case 1:
        return 7;
      case 2:
        return 9;
      case 3:
        return 8;
      case 4:
        return 2;
      default:
        return 5 - n;
    }
  }
  let score = ts(t1) + ts(t2);
  if (score >= 0) {
    return score * 2;
  } else {
    return score * 100;
  }
}

function lenScore(str1, str2) {
  let len1 = str1.length;
  let len2 = str2.length;

  return (10 - Math.abs(25 - len1)) * 2 + (10 - Math.abs(25 - len2)) * 2 + (10 - Math.abs(len1 - len2)) * 6;
}

let base = {
  A: 'T',
  T: 'A',
  G: 'C',
  C: 'G',
  a: 't',
  t: 'a',
  g: 'c',
  c: 'g'
};

function revComp(s) {
  let res = '';
  for (let i = 0; i < s.length; i++) {
    res = base[s[i]] + res;
  }
  return res;
}

function palindrome(str) {
  let i = 0;
  let t = str.slice(-(i + 1));
  while (str.slice(0, -(i + 3)).includes(revComp(t))) {
    // console.log(t, revComp(t));
    i += 1;
    t = str.slice(-(i + 1));
  }
  return i;
}

function palScore(s) {
  let sc = palindrome(s);
  switch (sc) {
    case 1:
      return 10;
    case 2:
      return 5;
    case 3:
      return 0;
    default:
      return sc * sc * (-2);
  }
}

function interPalindromeScore(str1, str2) {
  let c1 = 1;
  let c2 = 1;
  while (str2.includes(revComp(str1.slice(-(c1 + 1))))) {
    c1 += 1;
  }
  while (str1.includes(revComp(str2.slice(-(c2 + 1))))) {
    c2 += 1;
  }
  // console.log(c1, c2);

  function foo(c) {
    switch (c) {
      case 1:
        return 10;
      case 2:
        return 5;
      case 3:
        return 0;
      default:
        return c * c * (-2);
    }
  }

  return foo(c1) + foo(c2);
}


function score(str1, str2) {
  console.log('gcscore', gcScore(str1, str2));
  console.log('lenscore', lenScore(str1, str2));
  console.log('tailscore', tailScore(str1, str2));
  console.log('palscore1', palScore(str1));
  console.log('palscore2', palScore(str2));
  console.log('interpalscore', interPalindromeScore(str1, str2));
  return gcScore(str1, str2)
    + lenScore(str1, str2)
    + tailScore(str1, str2)
    + palScore(str1)
    + palScore(str2)
    + interPalindromeScore(str1, str2);
}


// function foo(gc1, gc2) {
//   return (10 - Math.abs(50 - gc1)) * 2 + (10 - Math.abs(50 - gc2)) * 2 + (10 - Math.abs(gc1 - gc2)) * 6;
// }
//
// let a = [];
// for (let i = 25; i < 70; i++) {
//   for (let j = 25; j < 70; j++) {
//     a.push({
//       x: i,
//       y: j,
//       score: foo(i, j)
//     })
//   }
// }
//
// console.log(a.length);
// console.log(a.sort((a, b) => a.score - b.score).slice(-100, -50));
// console.log(revComp('atg'));
// console.log(palindrome('atgccggagctaggctggatgccgatccg'));

let s1 = 'atgccggacgctaggctggatgccgatccg';
let s2 = 'atcgtgtgtttgctagtgctgtcatgtcc';

// console.log(interPalindromeScore(s1, s2));
console.log(score(s1, s2));

// countTail(s2);
// console.log(palScore(s1));
// console.log(palScore(s2));