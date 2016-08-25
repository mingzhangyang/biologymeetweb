
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


var aaClass = {
    "Basic": ["H", "R", "K"],
    "Nonpolar (Hydrophobic)": ["F", "A", "L", "M", "I", "W", "P", "V"],
    "Polar, uncharged": ["C", "G", "Q", "N", "S", "Y", "T"],
    "Acidic": ["D", "E"]
};

//Classify amino acides:
var classifyAA = function(AA) {
    if (aaClass["Basic"].includes(AA)) {
        return "Basic";
    } else if (aaClass["Nonpolar (Hydrophobic)"].includes(AA)) {
        return "Nonpolar (Hydrophobic)";
    } else if (aaClass["Polar, uncharged"].includes(AA)) {
        return "Polar, uncharged";
    } else if (aaClass["Acidic"].includes(AA)) {
        return "Acidic";}
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

//Prepare data for visualization
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

var prepData2 = function(result) {
    var basic = {"class":"Basic", "AA":[]};
    var nonpolar = {"class":"Nonpolar (Hydrophobic)", "AA":[]};
    var polar = {"class":"Polar, uncharged", "AA":[]};
    var acidic = {"class":"Acidic", "AA":[]}
    
    for (let aa in result) {
        let _class = classifyAA(aa);
        if (_class = basic["class"]) {
            basic["AA"].push({"name":aa, "num":result[aa]});
        } else if (_class = nonpolar["class"]) {
            nonpolar["AA"].push({"name":aa, "num":result[aa]});
        } else if (_class = polar["class"]) {
            polar["AA"].push({"name":aa, "num":result[aa]});
        } else if (_class = acidic["class"]) {
            acidic["AA"].push({"name":aa, "num":result[aa]});
        }
    }
        
    var dataArray = [basic, nonpolar, polar, acidic];
    
    return dataArray
}
	
console.log("I am running correctly.");
