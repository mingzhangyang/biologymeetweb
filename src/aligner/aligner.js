/**
 * Created by yangm11 on 3/30/2017.
 */
'use strict';

// This script aligns a series of arrays by an organized sequence of unique ids

function aligner(collectionOfArrs, uidName, seqOfUid) {
  let result = [];
  let row;
  let len = seqOfUid.length;

  for (let j = 0; j < len; j++) {
    row = [];
    for (let k = 0; k < collectionOfArrs.length; k++) {
      let obj = collectionOfArrs[k].find(function (d) {
        return d[uidName] === seqOfUid[j];
      });
      if (!obj) {
        row.push(null);
        continue;
      }
      row.push(obj);
    }
    result.push(row);
  }
  return result;
}


function splitLine(s) {
  let elem = '';
  let quo = {
    open: false,
    seq: '',
    sign: '',
    ready: false
  };
  let array = [];

  for (let i = 0; i < s.length; i++) {
    if (quo.open) {
      if (s[i] === quo.sign) {
        quo.open = false;
        quo.ready = true;
      } else {
        quo.seq += s[i];
      }
    } else {
      if (s[i] === ',') {
        if (quo.ready) {
          array.push(quo.seq);
          quo.seq = '';
          quo.sign = '';
          quo.ready = false;
          continue;
        }

        array.push(elem);
        elem = '';
        continue;
      }
      if (s[i] === ' ') {
        continue;
      }
      if (s[i] === '"' || s[i] === "'") {
        quo.open = true;
        quo.sign = s[i];
        continue;
      }
      elem += s[i];
    }
  }
  if (quo.seq) {
    array.push(quo.seq);
  }
  if (elem) {
    array.push(elem);
  }
  return array;
}

function csv2json(str) {
  // console.log(str);
  let arr = str.trim().split('\n');
  let headers = splitLine(arr[0].trim());
  let result = [];
  for (let i = 1; i < arr.length; i++) {
    let obj = {};
    // console.log(i, arr[i]);
    let row = splitLine(arr[i].trim());
    // console.log(i, row);
    for (let k = 0; k < headers.length; k++) {
      obj[headers[k]] = row[k];
    }
    result.push(obj);
  }
  // console.log(headers);
  return result;
}

let csvs = [];
function readCSV(id) {
  let foo = document.getElementById(id).files;

  for (let i = 0; i < foo.length; i++) {
    let reader = new FileReader();
    reader.onload = function () {
      let text = reader.result;
      console.log(text);
      csvs.push(csv2json(text));
    };
    reader.readAsText(foo[i]);
  }
}

function preview() {
  
}

