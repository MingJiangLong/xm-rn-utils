import { TimeoutError } from "./error";


/**
 * Wraps a function with a timeout. If the function does not return within the specified `timeout` (in milliseconds), a `TimeoutError` is thrown.
 * @param fn the function to wrap
 * @param timeout the timeout in milliseconds. Defaults to 3000.
 * @param timeoutMessage the message for the `TimeoutError`. Defaults to `undefined`.
 * @returns a function that wraps `fn` with a timeout
 */
export default function addTimeout<T extends (...args: any[]) => any>(
    fn: T,
    timeout = 3000,
    timeoutMessage?: string
) {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    return (...args: Parameters<T>) => {
        const timeoutTimer = new Promise<ReturnType<T>>((_, reject) => {
            timeoutId = setTimeout(() => reject(new TimeoutError(timeoutMessage)), timeout);
        });
        try {
            return Promise.race([fn(...args), timeoutTimer]) as ReturnType<T>;
        } finally {
            if (timeoutId != undefined) {
                clearTimeout(timeoutId);
                timeoutId = undefined
            };
        }
    }
}

