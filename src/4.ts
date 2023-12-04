import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/4

interface Card {
  id: number;
  winning: number[];
  actual: number[];
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
    return { id, winning: numbers[0] || [], actual: numbers[1] || [] };
}

const values1 = readFileSync("data/4.txt", "utf8")
  .split("\n")
  .filter((v) => v.length)
  .map(parseCard)
  .map((card: Card) => card.winning.filter(val => card.actual.includes(val)))
  .filter(nums => nums.length > 0)
  .map(nums => 2**(nums.length-1))
  .reduce((acc, val) => acc + val, 0);


console.log("Part1:", values1);

