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
    return [
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
    ].findIndex(matcher => matcher(handBid));
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

const part1 = (() => {
    const cards = 'AKQJT98765432'.split('');
    return loadProblem("7.txt")
        .map(line => parseHandBid(line, cards))
        .sort((a,b) => handBidComparator(a, b, cards))
        .map((handBid, ix) => handBid.bid*(ix+1))
        .reduce((acc, val) => acc + val, 0);
})()

console.log('Part1:', part1);

const part2 = (() => {
    const cards = 'AKQT98765432J'.split('');
    const useJokers = (handBid: HandBid): HandBid => {
        const jokerIndex = handBid.cards.findIndex(card => card.card == 'J');
        if (jokerIndex == 0) {
            if (handBid.cards.length > 1) {
                const head = handBid.cards.shift() || { card: '', count: 0 };   
                handBid.cards[0].count += head.count;
            }
        } else if (jokerIndex > 0) {
            handBid.cards[0].count += handBid.cards[jokerIndex].count;
            handBid.cards.splice(jokerIndex, 1);
        }
        return handBid;
    }
    return loadProblem("7.txt")
        .map(line => parseHandBid(line, cards))
        .map(useJokers)
        .sort((a,b) => handBidComparator(a, b, cards))
        .map((handBid, ix) => handBid.bid*(ix+1))
        .reduce((acc, val) => acc + val, 0);
})();

console.log('Part2:', part2);
