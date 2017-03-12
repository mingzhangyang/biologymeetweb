var myTools = {
  readTSV: function (str, head) { // str is a string, head is true or false
    var result = {};
    var strArr = str.split('\n');
    if (head) {
      result.th = strArr[0];
      result.td = strArr.slice(1);
      return result;
    }
    result.td = strArr;
    return result;
  },
  prepTable: function (data) { // data = {th: str, td: [str, str, ...]}
    var html = '<table>';
    if (data.th) {
      var vals = data.th.split('\t');
      html += '<tr>';
      for (var i = 0, len = vals.length; i < len; i++) {
        html += `<th>${vals[i]}</th>`;
      }
      html += '</tr>';
    }
    for (i = 0, len = data.td.length; i < len; i++) {
      if (data.td[i]) {
        var row = '<tr>';
        var line = data.td[i].split('\t');
        for (var j = 0; j < line.length; j++) {
          row += `<td>${line[j]}</td>`;
        }
        row += '</tr>';
        html += row;
      }
    }
    return html + '</table>';
  }
};
