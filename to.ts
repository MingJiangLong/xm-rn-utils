
type I_PromiseValue<T = any> = T extends Promise<infer U> ? U : never



/**
 * 
 * @param fn 
 * 
 * @example
 * 
 * async function test(){
 *    const [error,data] = await to(async() => {})()
 * }
 * @returns 
 */
export function to<T extends (...args: any[]) => Promise<any>, E = Error>(fn: T) {
    return async (...args: Parameters<T>) => {
        let toData: any = null;
        let toError: any = null
        try {
            const promise = fn(...args);
            toData = await promise;
        } catch (error) {
            toError = error
        }
        return [toError, toData] as [E | null, I_PromiseValue<ReturnType<T>>]
    }
}
export function toSync<T extends (...args: any) => any, E = Error>(fn: T) {
    let toData: any = null;
    let toError: any = null
    return (...args: Parameters<T>) => {
        try {
            const temp = fn(...args);
            toData = temp;
        } catch (error) {
            toError = error
        }
        return [toError, toData] as [E | null, ReturnType<T>]
    }
}