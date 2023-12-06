import { readFileSync } from "fs";
import * as path from 'path';

export const isDigit = (char: string) => char >= '0' && char <= '9';

export function* rangeIterator(start: number, length: number): Iterable<number> {
    let current = start;
    for (let i = 0; i < length; i++) {
        yield current;
        current++;
    }
}

export const loadProblem = (name: string, delim = '\n') => {
    return readFileSync(path.join("data", name), "utf8").split(delim).filter((v) => v.length);
}