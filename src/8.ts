import { isDigit, loadProblem } from "./utils";
// https://adventofcode.com/2023/day/8

const lines = loadProblem("8.txt", "\n\n");

const lrlist = lines[0].split('');

interface Node {
    key: string;
    left: string;
    right: string;
};

const toNode = (s: string): Node => {
    const p = s.replace('(', '').replace(')', '').replace('=', '')?.match(/\b(\w+)\b/g) || ['','','']
    return { key: p[0], left: p[1], right: p[2] };
}

const nodes = lines[1].split('\n').map(toNode);
const nodeMap = new Map<string, Node>(nodes.map(node => [node.key, node]));

const steps = (() => {   
    var current = nodeMap.get('AAA');
    var steps = 0;
    while (current && current?.key != 'ZZZ') {
        const lr = lrlist[steps % lrlist.length];
        current = lr == 'L' ? nodeMap.get(current.left) : nodeMap.get(current.right);
        steps++;
    }
    return steps;
})();
console.log('Part1:', steps);

const steplist2 = (() => {   
    const findLoopCount = (key: string) => {
        var steps = 0;
        var current = nodeMap.get(key);
        while(!current!.key.endsWith('Z')) {
            const lr = lrlist[steps % lrlist.length];
            current = lr == 'L' ? nodeMap.get(current!.left) : nodeMap.get(current!.right);
             ++steps
        }
        return steps;
    };
    const nodes = [...nodeMap.keys()].filter(k => k.endsWith('A'));
    return nodes.map(findLoopCount);
})();

const lcm = (a: number, b: number): number => {
    const gcd = (a: number, b: number): number => {
        if (!b) {
            return a;
        }
        
        return gcd(b, a % b);
    }
    return (a * b) / gcd(a, b);
}

console.log('Part2:', steplist2.reduce((acc, val) => lcm(acc, val), steplist2[0]));
