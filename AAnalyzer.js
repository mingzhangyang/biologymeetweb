
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
    "V": "Val",
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

//Compute amino acides composition
var computeAA = function(seq) {
    var SEQ = seq.toUpperCase();

    let re = /[\s\d]+/;

    SEQ = SEQ.split(re).join("");

    let result = {};

    for (let i = 0; i < SEQ.length; i++) {
        if (SEQ[i] in result) {
            result[SEQ[i]] += 1;
        } else {
            result[SEQ[i]] = 1;
        }
    }

    return result;
};

//Prepare data for visualization (method #1)
var prepData = function(result) {
    var data = {
        "Basic": {"H":0, "R":0, "K":0},
        "Nonpolar (Hydrophobic)": {"F":0, "A":0, "L":0, "M":0, "I":0, "W":0, "P":0, "V":0},
        "Polar, uncharged": {"C":0, "G":0, "Q":0, "N":0, "S":0, "Y":0, "T":0},
        "Acidic": {"D":0, "E":0}
    };

    for (let aa in result) {
        var _class = classifyAA(aa);
        data[_class][aa] = result[aa];
    }

    var dataArray = [];

    for (let d in data) {
        let x = {};
        x["class"] = d;
        x["AA"] = data[d];
        dataArray.push(x);
    }

    return dataArray;
};

//Prepare data for visualization (method #2)
var prepData2 = function(result) {
    var basic = {"name":"Basic", "children":[]};
    var nonpolar = {"name":"Nonpolar (Hydrophobic)", "children":[]};
    var polar = {"name":"Polar, uncharged", "children":[]};
    var acidic = {"name":"Acidic", "children":[]};
    
    for (let aa in result) {
        let _class = classifyAA(aa);
        if (_class === basic["name"]) {
            basic["children"].push({"name":aaDict[aa], "num":result[aa]});
        } else if (_class === nonpolar["name"]) {
            nonpolar["children"].push({"name":aaDict[aa], "num":result[aa]});
        } else if (_class === polar["name"]) {
            polar["children"].push({"name":aaDict[aa], "num":result[aa]});
        } else if (_class === acidic["name"]) {
            acidic["children"].push({"name":aaDict[aa], "num":result[aa]});
        }
    }
        
    var data = {
      "name": "All Amnio Acides",
      "children": [basic, nonpolar, polar, acidic]
    };
    
    return data;
};

//Prepare data for visualization (method #3)
var prepData3 = function(result) {
	var dataArray = {
		"Basic": {"name":"Basic", "children":[]},
		"Nonpolar (Hydrophobic)": {"name":"Nonpolar (Hydrophobic)", "children":[]},
		"Polar, uncharged": {"name":"Polar, uncharged", "children":[]},
		"Acidic": {"name":"Acidic", "children":[]}
	};
	
	for (let aa in result) {
		dataArray[aaTable[aa]]["children"].push({"name":aaDict[aa], "num":result[aa]});
	}
	
	var data = {"name": "root", "children":[]};
	
	for (let d in dataArray) {
		data["children"].push(dataArray[d]);
	}
	
	return data;
	
};
	
console.log("I am running correctly.");
