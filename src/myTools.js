let myTools = {
  readTSV: function (str, head) { // str is a string, head is true or false
    let result = {};
    let strArr = str.split('\n');
    if (head) {
      result.th = strArr[0];
      result.td = strArr.slice(1);
      return result;
    }
    result.td = strArr;
    return result;
  },
  prepTable: function (data) { // data = {th: str, td: [str, str, ...]}
    let html = '<table>';
    if (data.th) {
      let vals = data.th.split('\t');
      html += '<tr>';
      for (let i = 0, len = vals.length; i < len; i++) {
        html += `<th>${vals[i]}</th>`;
      }
      html += '</tr>';
    }
    for (i = 0, len = data.td.length; i < len; i++) {
      if (data.td[i]) {
        let row = '<tr>';
        let line = data.td[i].split('\t');
        for (let j = 0; j < line.length; j++) {
          row += `<td>${line[j]}</td>`;
        }
        row += '</tr>';
        html += row;
      }
    }
    return html + '</table>';
  }
};
