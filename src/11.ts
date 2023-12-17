import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/11


const values1 = (() => {
    var values: string[][] = [];

    loadProblem("11.txt")
        .map(s => s.split(''))
        .forEach(r => {
            values.push(r);
            if (!r.includes('#')) {
                values.push([...r]);
            }
        });

    const cols = Array.from({ length: values[0].length }, (_, i) => i)
        .filter(c =>  -1 === values.findIndex(r => r[c] === '#')).reverse();
    return values.map(r => {
        cols.forEach(c => r.splice(c, 0, '.'))
        return r;
    });
})();

interface Coord {
    r: number,
    c: number,
};

const galaxies: Coord[] = (() => {
    return values1.flatMap((r, rix) => r.map((c, cix) => c === "#" ? {r: rix, c: cix} as Coord: undefined).filter(v => !!v)) as Coord[];
})();

const uniquePairs = (numbers: Coord[]) => numbers.flatMap((num, index) => numbers.slice(index + 1).map((nextNum) => [num, nextNum]));

const distances = uniquePairs(galaxies).map(gp => Math.abs(gp[0].r - gp[1].r) + Math.abs(gp[0].c - gp[1].c));
console.log('Part1:', distances.reduce((acc,v) => acc + v, 0));

// galaxies.forEach((g, i))


