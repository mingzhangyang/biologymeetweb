/**
 * Created by yangm11 on 3/6/2017.
 */

// This script translate DNA sequence to Amino acid sequence

'use strict';

var translateDNA = function (inputId, outputId) {
  document.getElementById('gcOutput').style.display = 'none';
  document.getElementById('transformOutput').style.display = 'none';
  document.getElementById('primersOutput').style.display = 'none';
  document.getElementById('translateOutput').style.display = 'block';
  document.getElementById('translateOutput').innerHTML = '';

  var codon = bioKit.codon;
  var inputSeq = document.getElementById(inputId).value;
  var seq = bioKit.prepSeq(inputSeq);

  for (var k = 0; k < seq.length; k++) {
    if (['A', 'T', 'G', 'C'].indexOf(seq[k]) === -1) {
      alert(`Illegal character ${seq[k]} found in the sequence!`);
      return;
    }
  }

  if (seq.length < 3) {
    alert('Please input a DNA sequence at least 3 bases! :-)');
    return;
  }

  if (seq.substr(0, 3) === 'ATG') {
    work();
    return;
  }

  var choice = prompt('The sequence does not start with "ATG"! Please' +
    ' select your options as follow: 1 for continue to translate from' +
    ' start; 2 for automatic detection of "ATG" and translate; 3 for stop' +
    ' and check input.');
  switch (choice) {
    case ('1'):
      work();
      return;
    case ('2'):
      var candidates = [];
      for (var c = 0; c < seq.length - 2; c++) {
        if (seq.substr(c, 3) === 'ATG') {
          candidates.push(scan(c, seq));
        }
      }

      if (candidates.length >= 1) {
        candidates.sort(function (a, b) {
          return b.len - a.len;
        });
        document.getElementById(outputId).innerHTML = `<h4>The longest translated region is from <span>
${candidates[0].start}</span> to <span>${candidates[0].stop}</span>. The length of amnino acid sequence is <span>${candidates[0].len}</span>, and the sequence is as below.</h4> <p>${candidates[0].fragment}</p>`;

        var tb = `<p style="background-color:#f2f2f2"><strong>The other possible candidates 
includes:</strong></p><table id="candidateTable"><tr><th>start</th><th>stop</th><th>length
</th></tr>`;

        for (var p = 1; p < candidates.length; p++) {
          tb += `<tr><td>${candidates[p].start}</td><td>${candidates[p].stop}</td><td>${candidates[p].len} aa</td></tr>`;
        }
        tb += '</table>';
        document.getElementById(outputId).innerHTML += tb;
      } else {
        document.getElementById(outputId).innerHTML = 'No translatable region' +
          ' found in the sequence.'
      }
      return;
    default:
      return;
  }

  function work() {
    if (seq.length % 3 !== 0) {
      var answer = confirm('The number of' +
        ' bases of input is ' + seq.length + ', which can not be divided' +
        ' exactly by 3. Are you sure to continue?');
      if (!answer) {
        return -1;
      }
      var i = 0;
      var aaSeq = '';
      var msg;
      for (i; i + 2 < seq.length; i += 3) {
        if (codon[seq.substr(i, 3)] && codon[seq.substr(i, 3)] !== 'STOP') {
          aaSeq += codon[seq.substr(i, 3)];
          continue;
        }
        if (i < seq.length - 3) {
          msg = `<h4>STOP codon found! Translation stopped at position <span>${i+1}</span> !</h4>`;
          document.getElementById('translateOutput').innerHTML = msg;
        }
        break;
      }
      document.getElementById(outputId).innerHTML += `<p>${aaSeq}</p>`;
      return 0;
    }

    var j;
    var result = '';
    for (j = 0; j + 2 < seq.length; j += 3) {
      if (codon[seq.substr(j, 3)] && codon[seq.substr(j, 3)] !== 'STOP') {
        result += codon[seq.substr(j, 3)];
        continue;
      }
      if (j < seq.length - 3) {
        document.getElementById(outputId).innerHTML = `<h4>STOP codon found at position <span>${i+1}</span>.</h4>`;
      }
      break;
    }
    document.getElementById(outputId).innerHTML += `<p>${result}</p>`;
    return 0;
  }

  function scan(start, seq) {
    var fragment = '';
    for (var i = start; i < seq.length - 2; i += 3) {
      if (codon[seq.substr(i, 3)] && codon[seq.substr(i, 3)] !== 'STOP') {
        fragment += codon[seq.substr(i, 3)];
        continue;
      }
      break;
    }
    return {
      start: start + 1,
      stop: i + 3,
      fragment: fragment,
      len: fragment.length
    }
  }
};