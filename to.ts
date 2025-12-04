
type I_PromiseFunction<P extends any[] = any[], R extends Promise<any> = Promise<any>> = (...args: P) => R
type I_PromiseFunctionReturn<T> = T extends I_PromiseFunction<any[], infer U> ? U : never
type I_PromiseFunctionParams<T> = T extends I_PromiseFunction<infer U> ? U : never
type I_PromiseValue<T = any> = T extends Promise<infer U> ? U : never

export function to<T extends (...args: any[]) => Promise<any>, E = Error>(fn: T) {
    return async (...args: I_PromiseFunctionParams<T>) => {
        let toData: any = null;
        let toError: any = null
        try {
            const promise = fn(...args);
            toData = await promise;
        } catch (error) {
            toError = error
        }
        return [toError, toData] as [E | null, I_PromiseValue<I_PromiseFunctionReturn<T>>]
    }

}
export function toSync<T extends (...args: any) => any, E = Error>(fn: T) {
    let toData: any;
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


