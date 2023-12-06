import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/2

interface Game {
    id: number;
    blue: number;
    green: number;
    red: number;
};

const parseGames = (value: string) => {
    const parseGame = (id: number, value: string) => {
      var game: Game = { id, blue: 0, green: 0, red: 0 };
      return value
        .split(",")
        .map((s) => s.trim())
        .reduce((game, s) => {
          const p = s.split(" ");
          const v = +p[0];
          switch (p[1]) {
            case "blue":
              game.blue += v;
              break;
            case "green":
              game.green += v;
              break;
            case "red":
              game.red += v;
              break;
          }
          return game;
        }, game);
    };

    const p = value.split(':');
    const gameId = +p[0].split(" ")[1];
    return p[1].split(';').map(str => parseGame(gameId, str));
};

const data = loadProblem("2.txt")
  .map(parseGames)
  .map(g => g.reduce((acc: Game, game: Game) => {
    acc.blue = Math.max(acc.blue, game.blue);
    acc.green = Math.max(acc.green, game.green);
    acc.red = Math.max(acc.red, game.red);
    acc.id = game.id;
    return acc;
  }, { id: 0, blue: 0, green: 0, red: 0 }));

const values1 = data
  .filter(g => g.red <= 12 && g.green <= 13 && g.blue <= 14)
  .reduce((acc, game) => acc + game.id, 0);

console.log("Part1:", values1);

const values2 = data
  .map((g) => g.blue * g.green * g.red)
  .reduce((acc, prod) => acc + prod, 0);

console.log("Part2:", values2);

