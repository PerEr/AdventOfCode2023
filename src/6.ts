import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/6

interface Race {
    time: number;
    distance: number;
}

const races = ((): Race[] => {
    const [timestr, diststr] = loadProblem("6.txt");
    const parseNumbers = (value: string): number[] => { 
        return value.split(':')[1].trim().match(/\b(\w+)\b/g)?.map((s) => +s.trim()) || [];
    }
    const times = parseNumbers(timestr);
    const distances = parseNumbers(diststr);
    
    return times.map((time, ix) => ({time, distance: distances[ix]}));
})();

const countWaysToWin = (r: Race) => {
    // Distance t(T-t)
    const distance = (t: number, T: number): number => t*(T-t);
    var wins = 0;
    for (var t = 0; t <= r.time; t++) {
        const d = distance(t, r.time);
        if (d > r.distance) {
            ++wins;
        }
    }
    return wins;
};

console.log('Part1:', races.map(countWaysToWin).reduce((acc, val) => acc * val, 1));
