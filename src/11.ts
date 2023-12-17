import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/11


const galaxyMap = loadProblem("11.txt").map(s => s.split(''));

const emptyRows: number[] = Array.from({ length: galaxyMap.length }, (_, i) => i)
    .filter(r =>  -1 === galaxyMap[r].findIndex(c => c === '#'));

const emptyCols: number[] = Array.from({ length: galaxyMap[0].length }, (_, i) => i)
    .filter(c =>  -1 === galaxyMap.findIndex(r => r[c] === '#'));

interface Coord {
    r: number,
    c: number,
};

const galaxies: Coord[] = (() => {
    return galaxyMap.flatMap((r, rix) => r.map((c, cix) => c === "#" ? {r: rix, c: cix} as Coord: undefined).filter(v => !!v)) as Coord[];
})();

const uniquePairs = (numbers: Coord[]) => numbers.flatMap((num, index) => numbers.slice(index + 1).map((nextNum) => [num, nextNum]));

const calcDistance = (gp: Coord[], multiplier: number) => {
    const [lr, hr] = [Math.min(gp[0].r, gp[1].r), Math.max(gp[0].r, gp[1].r)];
    const [lc, hc] = [Math.min(gp[0].c, gp[1].c), Math.max(gp[0].c, gp[1].c)];
    const rowgaps = emptyRows.filter(r => r > lr && r < hr).length;
    const colgaps = emptyCols.filter(c=> c > lc && c < hc).length;
    const dr = rowgaps * multiplier + (hr - lr - rowgaps);
    const dc = colgaps * multiplier + (hc - lc - colgaps);
    return dr + dc;
};

const distances1 = uniquePairs(galaxies).map(gp => calcDistance(gp, 2))
    .reduce((acc,v) => acc + v, 0);
   
console.log('Part1:', distances1);

const distances2 = uniquePairs(galaxies).map(gp => calcDistance(gp, 1000000))
    .reduce((acc,v) => acc + v, 0);
   
console.log('Part2:', distances2);
