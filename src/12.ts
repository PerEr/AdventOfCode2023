import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/12

function calcArrangements(pattern: string, groups: number[]): number {
    if (groups.length == 0) {
        return pattern.includes("#") ? 0 : 1;
    }
    if (pattern.length - groups.reduce((a, b) => a + b) - groups.length + 1 < 0) {
        return 0;
    }
    const p1 = (pattern[0] != "#" ? calcArrangements(pattern.slice(1), groups) : 0) || 0;
    const anyFine = pattern.slice(0, groups[0]).includes(".");
    const p2 = (!anyFine && pattern[groups[0]] != "#" ? calcArrangements(pattern.slice(groups[0] + 1), groups.slice(1)) : 0) || 0;
    return p1 + p2;
}


const arrs = loadProblem("12.txt").map((line: string) => {
    const p = line.split(' ');
    return calcArrangements(p[0], p[1].split(',').map(v => +v));
});


console.log('Part1:', arrs);
console.log('Part1:', arrs.reduce((acc, v) => acc + v, 0));
