/**
 * Created by yangm11 on 10/17/2017.
 */
'use strict';

function getSeq() {
  let input1 = document.getElementById('input1');
  let input2 = document.getElementById('input2');
  return {
    top: input1,
    left: input2
  };
}

function seqProcessor(seq) {
  let arr = seq.split('\n');
  if (arr[0][0] === '>') {
    return arr.slice(1).join('');
  }
  return arr.join('');
}

function draw() {
  let ctx = document.getElementById('dotMatrix').getContext('2d');
  if (typeof ctx !== 'undefined') {
    ctx.font = '48px serif';
    ctx.fillText('Hello DotMatrix', 100, 100)
  }
}

draw();

if (typeof module !== 'undefined' && module.parent) {

} else {
  // test code go here
}