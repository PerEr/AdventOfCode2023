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
/*
const t = [[0,0], [1,1], [48,48], [49,49],[50,52],[51,53],[96,98],[97,99],[98,50],[99,51]]];
t.forEach(([seed, soil]) => {
    const value = lookupValue(metaMap.get('seed-to-soil') || [], seed);;
    console.log(seed, soil, value, value === soil ? "OK" : "FAIL");
});
*/
const value1 = seeds1.map(getLocation).reduce((acc, val) => Math.min(acc,val), Number.MAX_VALUE);
console.log("Part1:", value1);