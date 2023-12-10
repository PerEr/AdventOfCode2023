import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/9

const values = loadProblem("9.txt")
  .map(s => s.split(' ').map(n => +n));

const diffList = (values: number[]): number[] => {
    const result: number[] = [];
    for (var ix = 1; ix < values.length; ix++) {
        result.push(values[ix] - values[ix - 1]);
    }
    return result;
}

const processList = (res: number[][]): number[][] => {
    const diffs = diffList(res[res.length - 1]);
    res.push(diffs);
    const allZeros = diffs.every(d => d == 0);
    if (allZeros) {
        return res;
    } else {
        return processList(res);
    }
}

const predictNextTail = (values: number[]): number => {
    const lst = processList([values]).reverse();
    lst[0].push(0);
    for (var ix = 1; ix < lst.length; ix++) {
        const last = lst[ix][lst[ix].length-1];
        const delta = lst[ix-1][lst[ix-1].length-1];
        lst[ix].push(last + delta);
    }
    
    return lst[lst.length-1][lst[lst.length-1].length-1];
}

console.log('Part1:', values.map(predictNextTail).reduce((a, b) => a + b, 0));

const predictNextHead = (values: number[]): number => {
    const lst = processList([values]).reverse();
    lst[0].unshift(0);
    for (var ix = 1; ix < lst.length; ix++) {
        const first = lst[ix][0];
        const delta = lst[ix-1][0];
        lst[ix].unshift(first - delta);
    }
    
    return lst[lst.length-1][0];
}

console.log('Part2:', values.map(predictNextHead).reduce((a, b) => a + b, 0));

