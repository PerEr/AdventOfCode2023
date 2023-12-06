import { isDigit, loadProblem } from "./utils";

// https://adventofcode.com/2023/day/1

const lines = loadProblem("1.txt");

const values1 = lines
  .map(s => s.split(''))
  .map(cl => cl.filter(c => isDigit(c)))
  .map(cl => +(cl[0] + cl[cl.length - 1]))
  .reduce((acc, value) => acc + value, 0);

console.log('Part1:', values1);

const t = ('two, 2')

const numbers: [string, number][] = [
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
];

function parseNumbers(value: string): number[] {
    const result: number[] = [];
    for (var ix = 0; ix < value.length; ix++) {
        if (isDigit(value[ix])) {
            result.push(+value[ix]);
        } else {
            const rest = value.substring(ix);
            const match = numbers.find((n) => rest.startsWith(n[0]));
            if (match) {
                result.push(match[1]);
            }
        }
    }
    return result;
}

const values2 = lines
  .map(parseNumbers)
  .map((cl) => cl[0] * 10 + cl[cl.length - 1])
  .reduce((acc, value) => acc + value, 0);

console.log("Part2:", values2);
