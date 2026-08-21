/**
 * Shared number-theory helpers for the HCF and LCM lesson.
 */

/** All factors of a positive whole number, in ascending order. */
export const getFactors = (value: number): number[] => {
    const factors: number[] = [];
    for (let candidate = 1; candidate <= value; candidate += 1) {
        if (value % candidate === 0) factors.push(candidate);
    }
    return factors;
};

/** Prime factors of a number, repeated and in ascending order (36 -> [2,2,3,3]). */
export const getPrimeFactors = (value: number): number[] => {
    const primeFactors: number[] = [];
    let remaining = Math.max(2, Math.floor(value));
    let divisor = 2;
    while (divisor * divisor <= remaining) {
        while (remaining % divisor === 0) {
            primeFactors.push(divisor);
            remaining /= divisor;
        }
        divisor += 1;
    }
    if (remaining > 1) primeFactors.push(remaining);
    return primeFactors;
};

/** Counts how many times each prime appears (36 -> { 2: 2, 3: 2 }). */
export const getPrimePowers = (value: number): Record<number, number> => {
    const powers: Record<number, number> = {};
    getPrimeFactors(value).forEach((prime) => {
        powers[prime] = (powers[prime] ?? 0) + 1;
    });
    return powers;
};

/** Highest common factor of two positive whole numbers. */
export const getHighestCommonFactor = (first: number, second: number): number => {
    let larger = Math.max(first, second);
    let smaller = Math.min(first, second);
    while (smaller > 0) {
        const remainder = larger % smaller;
        larger = smaller;
        smaller = remainder;
    }
    return larger;
};

/** Lowest common multiple of two positive whole numbers. */
export const getLowestCommonMultiple = (first: number, second: number): number =>
    (first * second) / getHighestCommonFactor(first, second);

/** Renders a prime factorisation as a readable index-form string (36 -> "2^2 x 3^2"). */
export const formatPrimeFactorisation = (value: number): string => {
    const powers = getPrimePowers(value);
    return Object.entries(powers)
        .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : prime))
        .join(' \\times ');
};

/**
 * Splits the prime factors of two numbers into the three regions of an
 * overlap diagram: only in the first, shared by both, only in the second.
 */
export const splitPrimeFactors = (
    first: number,
    second: number,
): { firstOnly: number[]; shared: number[]; secondOnly: number[] } => {
    const firstPowers = getPrimePowers(first);
    const secondPowers = getPrimePowers(second);
    const allPrimes = Array.from(
        new Set([...Object.keys(firstPowers), ...Object.keys(secondPowers)]),
    )
        .map(Number)
        .sort((left, right) => left - right);

    const firstOnly: number[] = [];
    const shared: number[] = [];
    const secondOnly: number[] = [];

    allPrimes.forEach((prime) => {
        const inFirst = firstPowers[prime] ?? 0;
        const inSecond = secondPowers[prime] ?? 0;
        const inBoth = Math.min(inFirst, inSecond);
        for (let index = 0; index < inBoth; index += 1) shared.push(prime);
        for (let index = 0; index < inFirst - inBoth; index += 1) firstOnly.push(prime);
        for (let index = 0; index < inSecond - inBoth; index += 1) secondOnly.push(prime);
    });

    return { firstOnly, shared, secondOnly };
};
