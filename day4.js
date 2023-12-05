const fs = require("fs");

const input = fs.readFileSync("./inputs/4.txt", "utf8");
const inputs = input.split("\n");

function setIntersection(set1, set2) {
  const ans = new Set();
  for (let i of set2) {
    if (set1.has(i)) {
      ans.add(i);
    }
  }
  return ans;
}

const test = [
  "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
  "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
  "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
  "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
  "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
  "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
];

const parseCard = (card) => {
  const [cardName, numbers] = card.split(":");
  const [winning, picks] = numbers.split("|");
  const winningNumbers = winning
    .trim()
    .split(" ")
    .filter((n) => n !== "");
  const pickedNumbers = picks
    .trim()
    .split(" ")
    .filter((n) => n !== "");

  return {
    cardName,
    winningNumbers,
    pickedNumbers,
  };
};

const countMatches = (card) => {
  const { winningNumbers, pickedNumbers } = card;
  let winningSet = new Set(winningNumbers);
  let pickedSet = new Set(pickedNumbers);
  let intersection = setIntersection(winningSet, pickedSet);
  return intersection.size;
};

const score = (matches) => {
  if (matches === 0) {
    return 0;
  }
  return 2 ** (matches - 1);
};

const part1 = (input) => {
  const cards = input.map(parseCard);
  const matches = cards.map(countMatches);
  const totalScore = matches.reduce((acc, curr) => acc + score(curr), 0);
  console.log(totalScore);
};

// part1(inputs);

const part2 = (input) => {
  const cards = input.map(parseCard);
  const matches = cards.map(countMatches);
  let initialCounts = Array(input.length).fill(1);

  for (let i = 0; i < input.length; i++) {
    const matchAmount = matches[i];
    for (let j = i + 1; j < i + 1 + matchAmount; j++) {
      initialCounts[j] = initialCounts[j] + initialCounts[i];
    }
  }

  const sum = initialCounts.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
};

// part2(inputs);
