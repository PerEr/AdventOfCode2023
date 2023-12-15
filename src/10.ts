import { assert } from "console";
import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/10

interface Cell {
    N: boolean;
    E: boolean;
    S: boolean;
    W: boolean;
};

const emptyCell: Cell = { 
  N: false, 
  E: false, 
  S: false, 
  W: false,
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
    'S': makeCell("NEWS"), // Assum connected to all sides
    'O': makeCell(""),
    'I': makeCell(""),
};

const lines = loadProblem("10.txt");

const values1 = lines.map(s => s.split(''));

const startRow = values1.findIndex(row => row.includes('S'));
const startCol = values1[startRow].findIndex(c => c == 'S');

const cells = lines.map(s => s.split('')).map(r => r.map(c => keyToCell[c]));

const calculateDistances = (cells: Cell[][], startRow: number, startCol: number): number[][]  => {
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
    return distances;    
}

const findConnectingCellType = 

cells[startRow][startCol] = ((row: number, col: number): Cell => {
  const north = row > 0 ? cells[row - 1][col] : emptyCell;
  const east = col < cells[row].length - 1 ? cells[row][col + 1] : emptyCell;
  const south = row < cells.length - 1 ? cells[row + 1][col] : emptyCell;
  const west = col > 0 ? cells[row][col - 1] : emptyCell; 
  return {
    N: north.S,
    E: east.W,
    S: south.N,
    W: west.E,
  }
})(startRow, startCol);

const pruneDanglingCells = (cells: Cell[][]):number => {
  // Loop over each row
  var modified = 0;
  for (let row = 0; row < cells.length; row++) {
    // Loop over each cell in the row
    const cols = cells[row].length;
    for (let col = 0; col < cols; col++) {
      const cell = cells[row][col];
      const north = row > 0 ? cells[row - 1][col] : emptyCell;      // Do something with the cell
      const east = col < cols - 1 ? cells[row][col + 1] : emptyCell;      // Do something with the cell
      const south = row < cells.length - 1 ? cells[row + 1][col] : emptyCell;      // Do something with the cell
      const west = col > 0 ? cells[row][col - 1] : emptyCell; 
      var connections = 0;
      if (cell.N || cell.E || cell.S || cell.W) {
        if (cell.N && north.S) {
          ++connections;
        }
        if (cell.E && east.W) {
          ++connections;
        }
        if (cell.S && south.N) {
          ++connections;
        }
        if (cell.W && west.E) {
          ++connections;
        }
        assert(connections <= 2);
        if (connections != 2) {
          cells[row][col] = emptyCell;
          ++modified;
        } 
      }
    }
  }
  return modified;
}

while(pruneDanglingCells(cells));

const distances = calculateDistances(cells, startRow, startCol);
let furthestDistance = 0;
    
for (let row = 0; row < distances.length; row++) {
  for (let col = 0; col < distances[row].length; col++) {
    if (distances[row][col] !== Number.MAX_VALUE) {
     furthestDistance = Math.max(furthestDistance, distances[row][col]);
    }
  }
}

console.log('Part1:', furthestDistance);

// Prune disconnected loops too.
for (var r=0 ; r<distances.length; r++) {
  for(var c=0; c<distances[r].length; c++) {
    if (distances[r][c] === Number.MAX_VALUE) {
      cells[r][c] = emptyCell;
    }
  }
}
/*
const drawMaze = (cells: Cell[][]) => {
  for (let row = 0; row < cells.length; row++) {
    var line = '';
    for (let col = 0; col < cells[row].length; col++) {
      const v = Object.entries(keyToCell).find(kv => {
        return JSON.stringify(kv[1]) === JSON.stringify(cells[row][col]);
      })?.[0];
      line += v;
    }
    console.log(line)
  }
}

drawMaze(cells);
*/



const countCrossings = (cells: Cell[][], row: number, col: number, dr: number, dc: number): number => {
  var crossings = 0;
  var candidate = false;
  enum Direction {
    N,
    E,
    S,
    W,
    Any,
  };
  var next: Direction = Direction.Any;

  while (true) {
    row += dr;
    col += dc;
    if (row < 0 || (row >= cells.length)) {
      break;
    }
    if (col < 0 || (col >= cells[row].length)) {
      break;
    }
    const cell = cells[row][col];
    if (dr ) {
      if (candidate) {
        if (cell.E || cell.W) {
          if (next === Direction.E) {
            crossings = cell.E ? crossings + 1 : crossings;
          } else if (next === Direction.W) {
            crossings = cell.W ? crossings + 1 : crossings;
          }
          candidate = false;
          next = Direction.Any;
        }
      } else {
        if (cell.E && cell.W) {
          ++crossings
        } else if (cell.E || cell.W) {
          candidate = true;
          next = cell.E ? Direction.W : Direction.E;
        }
      }
    }
    if (dc) {
      if (candidate) {
        if (cell.N || cell.S) {
          if (next === Direction.N) {
            crossings = cell.N ? crossings + 1 : crossings;
          } else if (next === Direction.S) {
            crossings = cell.S ? crossings + 1 : crossings;
          }
          candidate = false;
          next = Direction.Any;
        }
      } else {
        if (cell.N && cell.S) {
          ++crossings
        } else if (cell.N || cell.S) {
          candidate = true;
          next = cell.N ? Direction.S : Direction.N;
        }
      }    }
  }
  return crossings;
}

var insideTiles = 0;

for (let row = 0; row < cells.length; row++) {
  for (let col = 0; col < cells[row].length; col++) {
    if (distances[row][col] === Number.MAX_VALUE) {
      const cell = cells[row][col];
      if (cell.N || cell.E || cell.S || cell.W) {
        const cn = countCrossings(cells, row, col, -1, 0);
        const ce = countCrossings(cells, row, col, 0, 1);
        const cs = countCrossings(cells, row, col, 1, 0);
        const cw = countCrossings(cells, row, col, 0, -1);
        // Check if all of cn, ce, cs, cw individually are odd
        // console.log('testing:', row, col, '---', cn, ce, cs, cw);
        const up = (cn % 2) + (cs % 2)  === 2;
        const side = + (cw % 2) + (ce % 2)  === 2; 
        if ((cn % 2) + (cs % 2) + (cw % 2) + (ce % 2) > 0) {
          // console.log('Part2:', row, col);
          ++insideTiles
        }
      } else {
        const cn = countCrossings(cells, row, col, -1, 0);
        const ce = countCrossings(cells, row, col, 0, 1);
        const cs = countCrossings(cells, row, col, 1, 0);
        const cw = countCrossings(cells, row, col, 0, -1);
        // Check if all of cn, ce, cs, cw individually are odd
        // console.log('testing:', row, col, '---', cn, ce, cs, cw);
        const up = (cn % 2) + (cs % 2)  === 2;
        const side = + (cw % 2) + (ce % 2)  === 2; 
        if ((cn % 2) + (cs % 2) + (cw % 2) + (ce % 2) === 4) {
          // console.log('Part2:', row, col);
          ++insideTiles
        }
      }
    }
  }
}

console.log('Part2:', insideTiles);


