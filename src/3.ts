import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/3


const data1 = readFileSync("data/3.txt", "utf8")
  .split("\n")
  .filter((v) => v.length)
;

interface Num {
    ix: number;
    len: number;
    value: number;
}

interface Symbol {
    ix: number;
    sym: string;
}

const isDigit = (char: string) => char >= "0" && char <= "9";

const parseSymbols = (line: string) => {
  const result: Symbol[] = [];
  const isSymbol = (char: string) => char != "." && !isDigit(char);
  for (var ix = 0; ix < line.length; ix++) {
    if (isSymbol(line[ix])) {
      result.push({ix, sym: line[ix]});
    }
  }
  return result;
};

const symbolMap = new Map(data1.map((line, ix) => [ix, parseSymbols(line)]));

const isAdjacentToSymbol = (num: Num, row: number) => {
  const sr = Math.max(0, row - 1);
  const lr = Math.min(data1.length - 1, row + 1);
  for (var r = sr; r <= lr; r++) {
    const syms = symbolMap.get(r) || [];
    for (const sym of syms) {
      if (sym.ix >= num.ix - 1 && sym.ix <= num.ix + num.len) {
        return true;
      }
    }
  }
  return false;
};

const parseNumbers = (line: string) => {
  const result: Num[] = [];
  var len = 0;
  var value = 0;
  for (var ix = 0; ix < line.length; ix++) {
    if (isDigit(line[ix])) {
      len++;
      value = value * 10 + +line[ix];
    } else {
      if (len > 0) {
        result.push({ ix: ix-len, len, value });
      }
      len = 0;
      value = 0;
    }
  }
  if (len > 0) {
    result.push({ ix: ix - len, len, value });
  }

  return result;
};

const numbers = data1
    .map(parseNumbers)
    .map((nums, row) => nums.filter(num => isAdjacentToSymbol(num, row)))
    .flat()
    .map(num => num.value)
    .reduce((acc, value) => acc + value, 0);

console.log('Part 1', numbers);