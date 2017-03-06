'use strict';

var bioKit = (function () {
  var aaDict = {
    "H": "His",
    "D": "Asp",
    "R": "Arg",
    "F": "Phe",
    "A": "Ala",
    "C": "Cys",
    "G": "Gly",
    "Q": "Gln",
    "E": "Glu",
    "K": "Lys",
    "L": "Leu",
    "M": "Met",
    "N": "Asn",
    "S": "Ser",
    "Y": "Tyr",
    "T": "Thr",
    "I": "Ile",
    "W": "Trp",
    "P": "Pro",
    "V": "Val"
  };

  var aapI = {
    "Ala": 6.01,
    "Cys": 5.05,
    "Asp": 2.85,
    "Glu": 3.15,
    "Phe": 5.49,
    "Gly": 6.06,
    "His": 7.60,
    "Ile": 6.05,
    "Lys": 9.60,
    "Leu": 6.01,
    "Met": 5.74,
    "Asn": 5.41,
    "Pro": 6.30,
    "Gln": 5.65,
    "Arg": 10.76,
    "Ser": 5.68,
    "Thr": 5.60,
    "Val": 6.00,
    "Trp": 5.89,
    "Tyr": 5.64
  };

  var aaClass = {
    "Basic": ["H", "R", "K"],
    "Nonpolar (Hydrophobic)": ["F", "A", "L", "M", "I", "W", "P", "V"],
    "Polar, uncharged": ["C", "G", "Q", "N", "S", "Y", "T"],
    "Acidic": ["D", "E"]
  };

//Classify amino acides (method #1):
  var classifyAA = function(AA) {
    if (aaClass["Basic"].includes(AA)) {
      return "Basic";
    } else if (aaClass["Nonpolar (Hydrophobic)"].includes(AA)) {
      return "Nonpolar (Hydrophobic)";
    } else if (aaClass["Polar, uncharged"].includes(AA)) {
      return "Polar, uncharged";
    } else if (aaClass["Acidic"].includes(AA)) {
      return "Acidic";

    }
  };

//Classify amino acides (method #2):
  var aaTable = {
    "H": "Basic",
    "R": "Basic",
    "K": "Basic",
    "F": "Nonpolar (Hydrophobic)",
    "A": "Nonpolar (Hydrophobic)",
    "L": "Nonpolar (Hydrophobic)",
    "M": "Nonpolar (Hydrophobic)",
    "I": "Nonpolar (Hydrophobic)",
    "W": "Nonpolar (Hydrophobic)",
    "P": "Nonpolar (Hydrophobic)",
    "V": "Nonpolar (Hydrophobic)",
    "C": "Polar, uncharged",
    "G": "Polar, uncharged",
    "Q": "Polar, uncharged",
    "N": "Polar, uncharged",
    "S": "Polar, uncharged",
    "Y": "Polar, uncharged",
    "T": "Polar, uncharged",
    "D": "Acidic",
    "E": "Acidic"
  };

// AA color scale
  var aaCategoryColors = {
    "Basic": "blue",
    "Acidic": "red",
    "Nonpolar (Hydrophobic)": "green",
    "Polar, uncharged": "purple",
    "All Amnio Acides": "rgba(255, 255, 0, 0.1)"
  };

  var aaColorsDomain = {
    'Basic': [7.6, 10.76],
    'Acidic': [2.85, 3.15],
    'Nonpolar (Hydrophobic)': [5.49, 6.3],
    'Polar, uncharged': [5.05, 6.06]
  };

  var aaColorsRange = {
    'Basic': ['#00bfff', '#0040ff'],
    'Acidic': ['#fd8d3c', '#e6550d'],
    'Nonpolar (Hydrophobic)': ['#c7e9c0', '#31a354'],
    'Polar, uncharged': ['#bcbddc', '#756bb1']
  };

  var aaColors = {
    'Basic': d3.scale.linear().domain([7.6, 10.76]).range(['#00bfff', '#0040ff']),
    'Acidic': d3.scale.linear().domain([2.85, 3.15]).range(['#fd8d3c', '#e6550d']),
    'Nonpolar (Hydrophobic)': d3.scale.linear().domain([5.49, 6.3]).range(['#c7e9c0', '#31a354']),
    'Polar, uncharged': d3.scale.linear().domain([5.05, 6.06]).range(['#bcbddc', '#756bb1'])
  };

//Prep seqence to remove illeagle chars
  var prepSeq = function(seq) {
    var SEQ = seq.toUpperCase();
    var re = /[\s\d]+/;
    SEQ = SEQ.split(re).join("");
    return SEQ;
  };


//Count ATGC
  var countBase = function(seq) {
    seq = prepSeq(seq);
    var bases = {A: 0, T:0, G:0, C:0, U:0};
    for (var i = 0; i < seq.length; i++) {
      bases[seq[i]] += 1;
    }
    return bases;
  };


//Count amino acides composition
  var countAA = function(seq) {
    var SEQ = seq.toUpperCase();
    var re = /[\s\d]+/;
    SEQ = SEQ.split(re).join("");
    var result = {};
    for (var i = 0; i < SEQ.length; i++) {
      if (SEQ[i] in result) {
        result[SEQ[i]] += 1;
      } else {
        result[SEQ[i]] = 1;
      }
    }
    return result;
  };

//Prepare hierarchy data for visualization (method #1)
//I am not sure whether this data structure works or not. Anyway, method #2 and #3 do.
  var prepData = function(aaCounts) {
    var data = {
      "Basic": {"H":0, "R":0, "K":0},
      "Nonpolar (Hydrophobic)": {"F":0, "A":0, "L":0, "M":0, "I":0, "W":0, "P":0, "V":0},
      "Polar, uncharged": {"C":0, "G":0, "Q":0, "N":0, "S":0, "Y":0, "T":0},
      "Acidic": {"D":0, "E":0}
    };

    for (var aa in aaCounts) {
      var _class = classifyAA(aa);
      data[_class][aa] = aaCounts[aa];
    }

    var dataArray = [];

    for (var d in data) {
      var x = {};
      x["class"] = d;
      x["AA"] = data[d];
      dataArray.push(x);
    }

    return dataArray;
  };

//Prepare hierarchy data for visualization (method #2)
  var prepData2 = function(aaCounts) {
    var basic = {"name":"Basic", "children":[]};
    var nonpolar = {"name":"Nonpolar (Hydrophobic)", "children":[]};
    var polar = {"name":"Polar, uncharged", "children":[]};
    var acidic = {"name":"Acidic", "children":[]};

    for (var aa in aaCounts) {
      var _class = classifyAA(aa);
      if (_class === basic["name"]) {
        basic["children"].push({"name":aaDict[aa], "count":aaCounts[aa]});
      } else if (_class === nonpolar["name"]) {
        nonpolar["children"].push({"name":aaDict[aa], "count":aaCounts[aa]});
      } else if (_class === polar["name"]) {
        polar["children"].push({"name":aaDict[aa], "count":aaCounts[aa]});
      } else if (_class === acidic["name"]) {
        acidic["children"].push({"name":aaDict[aa], "count":aaCounts[aa]});
      }
    }
    return {
      "name": "All Amnio Acides",
      "children": [basic, nonpolar, polar, acidic]
    };
  };

//Prepare hierarchy data for visualization (method #3)
  var prepData3 = function(aaCounts) {
    var dataArray = {
      "Basic": {"name":"Basic", "children":[]},
      "Nonpolar (Hydrophobic)": {"name":"Nonpolar (Hydrophobic)", "children":[]},
      "Polar, uncharged": {"name":"Polar, uncharged", "children":[]},
      "Acidic": {"name":"Acidic", "children":[]}
    };

    for (var aa in aaCounts) {
      dataArray[aaTable[aa]]["children"].push({"name":aaDict[aa], "count":aaCounts[aa]});
    }

    var data = {"name": "root", "children":[]};

    for (var d in dataArray) {
      data["children"].push(dataArray[d]);
    }

    return data;

  };

// genetic code
  var codon = {
    'TTC': 'F',
    'GTG': 'V',
    'GGT': 'G',
    'AGA': 'R',
    'CCG': 'P',
    'CCA': 'P',
    'TCC': 'S',
    'GAG': 'E',
    'AGG': 'R',
    'GAC': 'D',
    'TCG': 'S',
    'AAA': 'K',
    'CTA': 'L',
    'GTT': 'V',
    'GCC': 'A',
    'GCT': 'A',
    'TTT': 'F',
    'GAT': 'D',
    'TAT': 'Y',
    'GGG': 'G',
    'CTG': 'L',
    'GAA': 'E',
    'CAA': 'Q',
    'CCT': 'P',
    'GGC': 'G',
    'TCT': 'S',
    'ATG': 'M',
    'CGA': 'R',
    'ATA': 'I',
    'TTG': 'L',
    'CAT': 'H',
    'CAG': 'Q',
    'TGG': 'W',
    'GTA': 'V',
    'AAG': 'K',
    'TGT': 'C',
    'CCC': 'P',
    'AAT': 'N',
    'ACC': 'T',
    'CGG': 'R',
    'TAC': 'Y',
    'ACG': 'T',
    'ACA': 'T',
    'CAC': 'H',
    'ATT': 'I',
    'CGC': 'R',
    'AAC': 'N',
    'CGT': 'R',
    'TTA': 'L',
    'GCA': 'A',
    'AGC': 'S',
    'ACT': 'T',
    'TGC': 'C',
    'TCA': 'S',
    'AGT': 'S',
    'GCG': 'A',
    'GGA': 'G',
    'GTC': 'V',
    'ATC': 'I',
    'CTC': 'L',
    'CTT': 'L',
    'TAA': 'STOP',
    'TGA': 'STOP',
    'TAG': 'STOP'
  };



  console.log("I am running correctly.");

  return {
    prepSeq: prepSeq,
    countBase: countBase,
    countAA: countAA,
    prepData: prepData2,
    aapI: aapI,
    aaClass: aaClass,
    aaDict: aaDict,
    aaTable: aaTable,
    aaCategoryColors: aaCategoryColors,
    aaColorsDomain: aaColorsDomain,
    aaColorsRange: aaColorsRange,
    aaColors: aaColors,
    codon: codon
  }

})();

// for (var key in bioKit.aaClass) {
//   if (bioKit.aaClass.hasOwnProperty(key) && Array.isArray(bioKit.aaClass[key])) {
//     var arr = bioKit.aaClass[key].sort(function (a, b) {
//       return bioKit.aapI[bioKit.aaDict[a]] - bioKit.aapI[bioKit.aaDict[b]];
//     });
//     var newArr = arr.map(function (x) {
//       return {
//         name: x,
//         pI: bioKit.aapI[bioKit.aaDict[x]]
//       }
//     });
//     console.log(newArr);
//   }
// }