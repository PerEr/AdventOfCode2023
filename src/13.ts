import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/13

const processPattern = (pattern: string) => {
    const lines = pattern.split('\n').filter(v => v.length);
    const isColMirror = (col: number) => {
        var offs = 0;
        const isMirrorChar = (line: string, col: number, offs: number) => {
            return line[col - offs - 1] != line[col + offs]
        };
        while (true) {
            if (lines.find(line => isMirrorChar(line, col, offs)))
                return false
            ++offs;
            if (col - offs < 1 || col + offs >= lines[0].length)
                break;
        }
        return true;
    };
    const isRowMirror = (row: number) => {
        var offs = 0;
        while (true) {
            if (lines[row - offs - 1] != lines[row + offs])
                return false
            ++offs;
            if (row - offs < 1 || row + offs >= lines.length)
                break;
        }
        return true;
    };
    const cols = Array.from({length: lines[0].length - 1}, (_, index) => index + 1)
        .filter(isColMirror);
    const rows = Array.from({length: lines.length - 1}, (_, index) => index + 1)
        .filter(isRowMirror);

    return cols.reduce((acc, col) => acc + col, 0) + 100 * rows.reduce((acc, row) => acc + row, 0);
}

console.log('Part1:', loadProblem("13.txt", "\n\n")
    .map(processPattern)
    .reduce((acc, v) => acc + v, 0));
