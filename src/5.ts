import { readFileSync } from "fs";

// https://adventofcode.com/2023/day/5

interface Range {
    dest: number;
    source: number;
    len: number;
}

const toMap = (value: string) => {
    const p = value.split(':');
    const name = p[0].split(' ')[0];
    const ranges = p[1]
      .trim()
      .split("\n")
      .map((value: string): Range => {
        const p = value.split(" ");
        return { dest: +p[0], source: +p[1], len: +p[2] };
      });
    return { name, ranges };
};

const data = readFileSync("data/5.txt", "utf8")
  .split("\n\n")
  .filter((v) => v.length);
const seeds1 = data[0].split(':')[1].trim().split(' ').map(v => +v);
const metaMap = new Map(data.splice(1).map(toMap).map(o => [o.name, o.ranges]));

const lookupValue = (ranges: Range[], value: number): number => {
    const range = ranges.find(r => r.source <= value && value < r.source + r.len);
    if (range) {
        return range.dest + value - range.source;
    }
    return value;
};

const getLocation = (seed: number): number => {
    const soil = lookupValue(metaMap.get('seed-to-soil') || [], seed);
    const fertilizer = lookupValue(metaMap.get('soil-to-fertilizer') || [], soil);
    const water = lookupValue(metaMap.get('fertilizer-to-water') || [], fertilizer);
    const light = lookupValue(metaMap.get('water-to-light') || [], water);
    const temperature = lookupValue(metaMap.get('light-to-temperature') || [], light);
    const humidity = lookupValue(metaMap.get('temperature-to-humidity') || [], temperature);
    const location = lookupValue(metaMap.get('humidity-to-location') || [], humidity);
    return location;
};

const value1 = seeds1.map(getLocation).reduce((acc, val) => Math.min(acc,val), Number.MAX_VALUE);
console.log("Part1:", value1);

const groupPairWise = (arr: number[]) => {
    const result: number[][] = [];
    for (var ix = 0; ix < arr.length; ix += 2) {
        result.push([arr[ix], arr[ix+1]]);
    }
    return result;
}
const seeds2 = groupPairWise(seeds1);

const res = seeds2.map(([start, len]) => {
    function* rangeIterator(start: number, length: number): Iterable<number> {
        let current = start;
        for (let i = 0; i < length; i++) {
            yield current;
            current++;
        }
    }
    var minLoc = Number.MAX_VALUE;
    for (var seed of rangeIterator(start, len)) {
        minLoc = Math.min(minLoc, getLocation(seed));
    };
    return minLoc;
});

console.log("Part2", res.reduce((acc, val) => Math.min(acc,val), Number.MAX_VALUE));
