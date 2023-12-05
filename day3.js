const fs = require("fs");

const input = fs.readFileSync("./inputs/3.txt", "utf8");
const inputs = input.split("\n");

// number is a part number is it is NOT surrounded by dots or other numbers
// can be surrounded on left, right, top, bottom, or diagonally
const test = [
  "467..114..",
  "...*......",
  "..35..633.",
  "......#...",
  "617*......",
  ".....+.58.",
  "..592.....",
  "......755.",
  "...$.*....",
  ".664.598..",
];

const numberRegex = /\d+/g;

const isSymbol = (char) => {
  return char !== "." && !char.match(numberRegex);
};

const isGear = (char) => char === "*";

const extractNumberPositions = (line, index) => {
  const numberPositions = [];
  const numberRegex = /\d+/g;
  let match;

  while ((match = numberRegex.exec(line)) !== null) {
    const number = parseInt(match[0]);
    const l = match.index;
    const r = l + match[0].length - 1;

    numberPositions.push({ number, l, r, index });
  }

  return numberPositions;
};

const isPartNumber = (lines, potentialPartNumber) => {
  const { index, l, r } = potentialPartNumber;
  const lineLength = lines[index].length;

  // left of number is a symbol
  if (l !== 0) {
    const leftOfNumber = lines[index][l - 1];
    if (isSymbol(leftOfNumber)) {
      return true;
    }
  }

  // right of number is a symbol
  if (r !== lineLength - 1) {
    const rightOfNumber = lines[index][r + 1];
    if (isSymbol(rightOfNumber)) {
      return true;
    }
  }

  // top of number(s) contains a symbol
  // only check top row if not first row
  if (index !== 0) {
    let leftMost = l == 0 ? 0 : l - 1;
    let rightMost = r == lineLength - 1 ? r : r + 1;
    const topLine = lines[index - 1];
    const topLineChars = topLine.slice(leftMost, rightMost + 1);
    if (topLineChars.split("").some((char) => isSymbol(char))) {
      return true;
    }
  }

  // bottom of number(s) contains a symbol
  // only check bottom row if not last row

  if (index !== lines.length - 1) {
    let leftMost = l == 0 ? 0 : l - 1;
    let rightMost = r == lineLength - 1 ? r : r + 1;
    const bottomLine = lines[index + 1];
    const bottomLineChars = bottomLine.slice(leftMost, rightMost + 1);
    if (bottomLineChars.split("").some((char) => isSymbol(char))) {
      return true;
    }
  }

  // otherwise return false
  return false;
};

let sum = 0;
for (let i = 0; i < inputs.length; i++) {
  const line = inputs[i];
  const potentialPartNumbers = extractNumberPositions(line, i);
  const partNumbers = potentialPartNumbers.filter((partNumber) => {
    return isPartNumber(inputs, partNumber);
  });

  const partialSum = partNumbers.reduce((acc, partNumber) => {
    return acc + partNumber.number;
  }, 0);

  sum += partialSum;
}

// console.log(sum);

// d stores map of gear x,y coordinates and stores a list of numbers that touch this gear
const parseGearRatios = (lines, potentialPartNumber, d) => {
  const { index, l, r, number } = potentialPartNumber;
  const lineLength = lines[index].length;

  const addToDictionary = (k, v, d) => {
    d[k] = d[k] ? [...d[k], v] : [v];
    return d;
  };

  // left of number is a symbol
  if (l !== 0) {
    const leftOfNumber = lines[index][l - 1];
    if (isGear(leftOfNumber)) {
      const gearPostion = `${l - 1},${index}`;
      d = addToDictionary(gearPostion, number, d);
      return d;
    }
  }

  // right of number is a symbol
  if (r !== lineLength - 1) {
    const rightOfNumber = lines[index][r + 1];
    if (isGear(rightOfNumber)) {
      const gearPostion = `${r + 1},${index}`;
      d = addToDictionary(gearPostion, number, d);
      return d;
    }
  }

  // top of number(s) contains a symbol
  // only check top row if not first row
  if (index !== 0) {
    let leftMost = l == 0 ? 0 : l - 1;
    let rightMost = r == lineLength - 1 ? r : r + 1;
    const topLine = lines[index - 1];
    const topLineChars = topLine.slice(leftMost, rightMost + 1);
    topLineChars.split("").forEach((char, i) => {
      if (isGear(char)) {
        const gearPostion = `${leftMost + i},${index - 1}`;
        d = addToDictionary(gearPostion, number, d);
        return d;
      }
    });
  }

  // bottom of number(s) contains a symbol
  // only check bottom row if not last row
  if (index !== lines.length - 1) {
    let leftMost = l == 0 ? 0 : l - 1;
    let rightMost = r == lineLength - 1 ? r : r + 1;
    const bottomLine = lines[index + 1];
    const bottomLineChars = bottomLine.slice(leftMost, rightMost + 1);
    bottomLineChars.split("").forEach((char, i) => {
      if (isGear(char)) {
        const gearPostion = `${leftMost + i},${index + 1}`;
        d = addToDictionary(gearPostion, number, d);
        return d;
      }
    });
  }

  // returns d with no additions
  return d;
};

let potentialPartNumbers = [];
for (let i = 0; i < inputs.length; i++) {
  const line = inputs[i];
  potentialPartNumbers.push(...extractNumberPositions(line, i));
}

// console.log(potentialPartNumbers);
let d = {};
for (let j = 0; j < potentialPartNumbers.length; j++) {
  const partNumber = potentialPartNumbers[j];
  // iteratively build up d -- probably a way to do this with reduce
  parseGearRatios(inputs, partNumber, d);
}

const sum2 = Object.values(d).reduce((acc, v) => {
  if (v.length === 2) {
    const ratio = v[0] * v[1];
    acc += ratio;
  }
  return acc;
}, 0);

console.log("sol", sum2);
