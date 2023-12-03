const fs = require("fs");

const input = fs.readFileSync("./inputs/1.txt", "utf8");
const lines = input.split("\n");

const numberStrings = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const getNumberFromString = (str) => {
  const numbers = {};

  for (let start = 0; start < str.length; start++) {
    numberStrings.forEach((numberString, i) => {
      if (str.startsWith(numberString, start)) {
        numbers[start] = i + 1; // number string as number is index + 1
      }
    });
  }

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (/^\d+$/.test(char)) {
      numbers[i] = parseInt(char);
    }
  }

  // get first and last number
  const numberIndices = Object.keys(numbers).map((key) => parseInt(key));
  const firstNumberIndex = Math.min(...numberIndices);
  const lastNumberIndex = Math.max(...numberIndices);
  const firstNumber = numbers[firstNumberIndex];
  const lastNumber = numbers[lastNumberIndex];
  return firstNumber * 10 + lastNumber;
};

let sumPart1 = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const chars = line.split("");
  const numbers = chars.filter((char) => /^\d+$/.test(char));
  const firstNumber = numbers[0];
  const lastNumber = numbers[numbers.length - 1];
  const number = parseInt(firstNumber) * 10 + parseInt(lastNumber);
  sumPart1 += number;
}

// console.log(sumPart1);

let sumPart2 = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  console.log(line);
  const number = getNumberFromString(line);
  console.log(number);
  sumPart2 += number;
}

console.log(sumPart2);
