import { useMemo, useRef, useState } from "react";


type I_ReactiveObject<T = any> = {
    value: T
}
function canBeProxy(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null;
}

export function useReactiveValue<T>(target: T) {
    const [state, setState] = useState<I_ReactiveObject<T>>({ value: target });
    const proxiedMap = useRef<WeakMap<any, any>>(new WeakMap()).current;
    function addNestedProxy<T>(data: T): T {
        if (!canBeProxy(data)) return data;
        if (proxiedMap.has(data)) {
            return proxiedMap.get(data);
        }
        const ret = new Proxy(data, {
            get(obj, prop, reviver) {
                const ret = Reflect.get(obj, prop, reviver)
                return addNestedProxy(ret);
            },
            set(obj, prop, value, reviver) {

                const oldValue = Reflect.get(obj, prop, reviver);
                if (oldValue === value) return true

                const success = Reflect.set(obj, prop, value, reviver);
                if (success) setState({ ...state })
                return true;
            }
        });
        proxiedMap.set(data, ret);
        return ret;
    }
    return useMemo(() => {
        return addNestedProxy(state)
    }, [state])
}





