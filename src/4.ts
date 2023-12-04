import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/4

interface Card {
  id: number;
  wins: number;
}
const parseCard = (line: string): Card => {
    const p = line.split(":");
    const id = +(p[0].match(/\b(\w+)\b/g) || [0,0])[1];
    const numbers = p[1].split("|").map((s) =>
      s.trim()
        .match(/\b(\w+)\b/g)
        ?.map((s) => +s.trim())
    );
    const wins = numbers[0]?.filter(val => numbers[1]?.includes(val))?.length || 0
    return { id, wins};
}

const data = readFileSync("data/4.txt", "utf8")
  .split("\n")
  .filter((v) => v.length)
  .map(parseCard);

const values1 = data
  .filter(card => card.wins > 0)
  .map(card => 2**(card.wins-1))
  .reduce((acc, val) => acc + val, 0);

console.log("Part1:", values1);

// Create a map from id to wins from a list of cards
const cardMap = new Map<number, number>(data.map(card => [card.id, card.wins]));

const countCards = (ix: number, res: Map<number, number>) => {
    res.set(ix, (res.get(ix) || 0) + 1);
    const wins = cardMap.get(ix) || 0;
    for (var o = 0; o < wins; o++) {
      countCards(ix + 1 + o, res);
    }
}

var resMap = new Map<number, number>();
data.forEach(card => countCards(card.id, resMap));
console.log("Part2:", [...resMap.values()].reduce((acc, val) => acc + val, 0));


