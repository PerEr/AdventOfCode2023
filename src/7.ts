import { loadProblem } from "./utils";

// https://adventofcode.com/2023/day/7

interface CardCount {
    card: string;
    count: number;
};

interface HandBid {
    hand: string;
    bid: number;
    cards: CardCount[];
};


const countCards = (hand: string, cards: string[]): CardCount[] => {
    var res: CardCount[] = [];
    cards.forEach(card => {
        const count = hand.split('').filter(c => c == card).length;
        if (count > 0) {
            res.push({ card, count });
        }
    });
    res.sort((a, b) => b.count - a.count || cards.indexOf(a.card) - cards.indexOf(b.card));
    return res;
}

const parseHandBid = (line: string, cards: string[]): HandBid => {
    const p = line.split(" ");
    return { hand: p[0], bid: +p[1], cards: countCards(p[0], cards) };
}


const lookupMatch = (handBid: HandBid): number => {
    const handMatchers = [
        (handBid: HandBid) => {
            return handBid.cards[0].count == 5;
        }, 
        (handBid: HandBid) => {
            return handBid.cards[0].count == 4;
        }, 
        (handBid: HandBid) => {
            return handBid.cards[0].count == 3 && handBid.cards[1].count == 2;
        }, 
        (handBid: HandBid) => {
            return handBid.cards[0].count == 3 && handBid.cards[1].count == 1;
        }, 
        (handBid: HandBid) => {
            return handBid.cards[0].count == 2 && handBid.cards[1].count == 2;
        }, 
        (handBid: HandBid) => {
            return handBid.cards[0].count == 2;
        },
        (handBid: HandBid) => {
            return true;
        },
    ];
    return handMatchers.findIndex(matcher => matcher(handBid));
};

const handBidComparator = (a: HandBid, b: HandBid, cards: string[]) => {
    const cardCompare = (a: string, b: string) => {
        while (a.length > 0 && b.length > 0) {
            const aix = cards.indexOf(a[0]);
            const bix = cards.indexOf(b[0]);
            if (aix != bix) {
                return bix - aix;
            }
            a = a.substring(1);
            b = b.substring(1);
        }
        return 0;
    };
    return lookupMatch(b) - lookupMatch(a) || cardCompare(a.hand, b.hand);
};

const cards1 = 'AKQJT98765432'.split('');
const value1 = loadProblem("7.txt")
    .map(line => parseHandBid(line, cards1))
    .sort((a,b) => handBidComparator(a, b, cards1))
    .map((handBid, ix) => handBid.bid*(ix+1))
    .reduce((acc, val) => acc + val, 0);


console.log('Part1:', value1);


