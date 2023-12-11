import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/10

interface Cell {
    N: boolean;
    E: boolean;
    S: boolean;
    W: boolean;
};


const makeCell = (s: string): Cell => {
    return { N: s.includes("N"), E: s.includes("E"), S: s.includes("S"), W: s.includes("W") };
}
  
const keyToCell: { [key: string]: Cell } = { 
    '|': makeCell("NS"), // is a vertical pipe connecting north and south.
    '-': makeCell("EW"), // is a horizontal pipe connecting east and west.
    'L': makeCell("NE"), // is a 90-degree bend connecting north and east.
    'J': makeCell("NW"), // is a 90-degree bend connecting north and west.
    '7': makeCell("SW"), // is a 90-degree bend connecting south and west.
    'F': makeCell("SE"), // is a 90-degree bend connecting south and east.
    '.': makeCell(""), // is ground; there is no pipe in this tile.
    'S': makeCell("EW"), // Assum connected to all sides
};

const lines = loadProblem("10.txt");

const values1 = lines.map(s => s.split(''));

const row = values1.findIndex(row => row.includes('S'));
const col = values1[row].findIndex(c => c == 'S');


const cells = lines.map(s => s.split('')).map(r => r.map(c => keyToCell[c]));

const calculateDistances = (cells: Cell[][], startRow: number, startCol: number) => {
    const rows = cells.length;
    const cols = cells[0].length;
    const distances: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Number.MAX_VALUE));
    const queue: [number, number][] = [];
    
    distances[startRow][startCol] = 0;
    queue.push([startRow, startCol]);
    
    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      const currentDistance = distances[row][col];
      
      // Navigate in each possible direction
      if (cells[row][col].N && row > 0 && currentDistance + 1 < distances[row - 1][col]) {
        distances[row - 1][col] = currentDistance + 1;
        queue.push([row - 1, col]);
      }
      if (cells[row][col].E && col < cols - 1 && currentDistance + 1 < distances[row][col + 1]) {
        distances[row][col + 1] = currentDistance + 1;
        queue.push([row, col + 1]);
      }
      if (cells[row][col].S && row < rows - 1 && currentDistance + 1 < distances[row + 1][col]) {
        distances[row + 1][col] = currentDistance + 1;
        queue.push([row + 1, col]);
      }
      if (cells[row][col].W && col > 0 && currentDistance + 1 < distances[row][col - 1]) {
        distances[row][col - 1] = currentDistance + 1;
        queue.push([row, col - 1]);
      }
    }
    
    let furthestDistance = 0;
    
    // Find the maximum distance in the distances matrix
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (distances[i][j] !== Number.MAX_VALUE) {
         furthestDistance = Math.max(furthestDistance, distances[i][j]);
        }
      }
    }
    
    return furthestDistance;
}

console.log('Part1:', calculateDistances(cells, row, col));

