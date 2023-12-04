import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/4

interface Card {
  id: number;
  wins: number;
}
const parseCard = (line: string): Card => {
    const p = line.split(":");
    const id = +p[0].split(" ")[1];
    const numbers = p[1].split("|").map((s) =>
      s
        .trim()
        .match(/\b(\w+)\b/g)
        ?.map((s) => +s.trim())
    );
    
    const wins = numbers[0]?.filter(val => numbers[1]?.includes(val))?.length || 0
    return { id, wins};
}

const values1 = readFileSync("data/4.txt", "utf8")
  .split("\n")
  .filter((v) => v.length)
  .map(parseCard)
  .filter(card => card.wins > 0)
  .map(card => 2**(card.wins-1))
  .reduce((acc, val) => acc + val, 0);


console.log("Part1:", values1);

