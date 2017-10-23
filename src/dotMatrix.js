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

function drawTable(ctx, descriptor){
  let obj = descriptor| {};
  let topLeft = obj.topLeftCorner || {left: 10, top: 10};
  let rows = obj.rows || 8;
  let cols = obj.cols || 6;
  let width = obj.cellWidth || 50;
  let height = obj.cellHeight || 25;

  ctx.strokeStyle = obj.color || 'rgba(0, 0, 0, 1)';
  ctx.beginPath();
  ctx.moveTo(topLeft.left, topLeft.top);

  for (let i = 0; i < rows + 1; i++) {
    ctx.lineTo(topLeft.left + width * cols, topLeft.top + i * height);
    ctx.moveTo(topLeft.left, topLeft.top + (i + 1) * height);
  }

  ctx.moveTo(topLeft.left, topLeft.top);

  for (let j = 0; j < cols + 1; j++) {
    ctx.lineTo(topLeft.left + width * j, topLeft.top + height * rows);
    ctx.moveTo(topLeft.left + width * (j + 1), topLeft.top);
  }
  ctx.closePath();
  ctx.stroke();
  return ctx;
}

function draw() {
  let ctx = document.getElementById('dotMatrix').getContext('2d');
  if (typeof ctx !== 'undefined') {
    // ctx.font = '48px serif';
    // ctx.fillText('Hello DotMatrix', 100, 100)
    ctx = drawTable(ctx);
  }
}

draw();

if (typeof module !== 'undefined' && module.parent) {

} else {
  // test code go here
}