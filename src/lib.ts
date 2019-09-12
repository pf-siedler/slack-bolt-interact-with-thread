import { isNull } from 'util';

function isNotUndefined<T>(x?: T): x is T {
    return typeof x !== 'undefined';
}

function isNotNull<T>(x: T | null): x is T {
    return !isNull(x);
}

export function extractURL(
    fallbacks: Array<string | undefined>,
): string | null {
    const pattern = new RegExp(
        /link\[<(https?:\/\/example\.com\/api\/id\/[0-9a-z\-]+)>\]/,
    );
    const endPoints = fallbacks
        .filter(isNotUndefined)
        .map(fallback => fallback.match(pattern))
        .filter(isNotNull)
        .map(regExpMatchArray => regExpMatchArray[1]);

    return endPoints.length === 0 ? null : endPoints[0];
}
