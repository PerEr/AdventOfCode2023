import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/12

function calcArrangements(cache: Map<String, number>, pattern: string, groups: number[]): number {
    const key = pattern + '_' + groups.join(':');
    if (cache.has(key)) {
        return cache.get(key) || 0;
    }
    if (groups.length == 0) {
        const res = pattern.includes("#") ? 0 : 1;
        // console.log(pattern, groups, '=>', res);
        return res;
    }
    if (pattern.length - groups.reduce((a, b) => a + b) - groups.length + 1 < 0) {
        // console.log(pattern, groups, '=>', 0);
        return 0;
    }
    const p1 = (pattern[0] != "#" ? calcArrangements(cache, pattern.slice(1), groups) : 0) || 0;
    const anyFine = pattern.slice(0, groups[0]).includes(".");
    const p2 = (!anyFine && pattern[groups[0]] != "#" ? calcArrangements(cache, pattern.slice(groups[0] + 1), groups.slice(1)) : 0) || 0;
    // console.log(pattern, groups, '=>', p1 + p2, p1, p2);
    const res = p1 + p2;
    cache.set(key, res);
    return res;
}


const file = "12.txt";


console.log('Part1:', loadProblem(file)
    .map((line: string) => {
        const p = line.split(' ');
        return calcArrangements(new Map<String, number>(), p[0], p[1].split(',').map(v => +v));
    })
    .reduce((acc, v) => acc + v, 0));

console.log('Part2:', loadProblem(file)
    .map((line: string) => {
        const p = line.split(' ');
        const pattern = Array(5).fill(p[0]).join('?');
        const groups = Array(5).fill(p[1].split(',').map(v => +v)).flat();
        return calcArrangements(new Map<String, number>(), pattern, groups);
    })
    .reduce((acc, v) => acc + v, 0));

    