/**
 * Created by yangm11 on 3/2/2017.
 */

'use strict';

var transformDNA = (function () {
  function transform(inputId, outputId) {
    d3.select('#gcOutput').style('display', 'none');
    d3.select('#transformOutput').style('display', 'block');
    d3.select('#primersOutput').style('display', 'none');
    document.getElementById('translateOutput').style.display = 'none';
    document.getElementById('transformOutput').innerHTML = '';

    var inputSeq = document.getElementById(inputId).value;
    var seq = bioKit.prepSeq(inputSeq);
    for (var j = 0; j < seq.length; j++) {
      if (['A', 'T', 'G', 'C', 'U'].indexOf(seq[j]) === -1) {
        alert(`Illegal character ${seq[j]} found in the sequence!`);
        return;
      }
    }
    // console.log(seq);
    var outputDiv = d3.select(outputId);
    var part1 = outputDiv.append('div').attr('class', 'blockArea');
    var part2 = outputDiv.append('div').attr('class', 'blockArea');
    var part3 = outputDiv.append('div').attr('class', 'blockArea');

    part1.append('h4')
        .text('The reversed sequence is as follow:');
    part1.append('p')
        .attr('class', 'seqArea')
        .text(reverse(seq));

    part2.append('h4')
        .text('The complementary sequence is as  follows:');
    part2.append('p')
        .attr('class', 'seqArea')
        .text(complementary(seq));

    part3.append('h4')
      .text('The reversed complementary sequence is as follows:');
    part3.append('p')
        .attr('class', 'seqArea')
        .text(reverse(complementary(seq)));
  }
  function reverse(seq) {
    var result = '';
    for (var i = seq.length - 1; i >= 0; i--) {
      result += seq[i];
    }
    return result;
  }
  function complementary(seq) {
    var dict = {
      A: 'T',
      G: 'C',
      T: 'A',
      C: 'G',
      U: 'A'
    };
    var result = '';
    for (var i = 0; i < seq.length; i++) {
      result += dict[seq[i]];
    }
    return result;
  }

  return transform;
})();

