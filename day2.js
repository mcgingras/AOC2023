const fs = require("fs");

const input = fs.readFileSync("./inputs/2.txt", "utf8");
const lines = input.split("\n");

const test1 = [
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];

const initialBag = {
  green: 13,
  blue: 14,
  red: 12,
};

const parseNumberAndColor = (str, d) => {
  const [number, color] = str.split(" ");
  d[color] = parseInt(number);
  return d;
};

const generateGameData = (game) => {
  let gameData = game.split(":")[1].trim();
  let gameDataRounds = gameData.split(";").map((item) => item.trim());
  let gameDataRoundsWithPicks = gameDataRounds.map((item) =>
    item.split(",").map((item) => item.trim())
  );
  let gameDataScores = gameDataRoundsWithPicks.map((round) => {
    let d = {};
    for (let i = 0; i < round.length; i++) {
      let pick = round[i];
      parseNumberAndColor(pick, d);
    }
    return d;
  });

  return gameDataScores;
};

let sum = 0;
for (let i = 0; i < lines.length; i++) {
  let game = lines[i];
  let gameNumber = game.split(":")[0].trim();
  let gameDataScores = generateGameData(game);

  let passes = !gameDataScores.some((game) => {
    return Object.entries(game).some(([color, number]) => {
      if (initialBag[color] < number) {
        return true;
      }
      return false;
    });
  });

  if (passes) {
    const [_, number] = gameNumber.split(" ");
    sum += parseInt(number);
  }
}
// console.log(sum);

let sum2 = 0;
for (let i = 0; i < lines.length; i++) {
  let game = lines[i];
  let gameDataScores = generateGameData(game);

  let startingMaximums = {
    green: 0,
    blue: 0,
    red: 0,
  };

  const newMaximums = gameDataScores.reduce((acc, game) => {
    for (let [color, number] of Object.entries(game)) {
      if (number > acc[color]) {
        acc[color] = number;
      }
    }
    return acc;
  }, startingMaximums);

  const power = Object.values(newMaximums).reduce((acc, number) => {
    return acc * number;
  }, 1);

  sum2 += power;
}

console.log(sum2);
