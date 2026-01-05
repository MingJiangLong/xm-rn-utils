import { TimeoutError } from "./error"
import { addTimeout } from "./add-timeout"
export interface I_LocationInfo {
    latitude: number
    longitude: number
    is_current: boolean
}

type BasicModule = {
    setRNConfiguration: (...args: any[]) => void
    getCurrentPosition: (...args: any[]) => void
}


export function createLocationBuilder<T extends BasicModule>(module: T) {

    const { setRNConfiguration, getCurrentPosition } = module;

    if (!getCurrentPosition) return undefined
    function getLocation() {
        const fetchLocationPromise = new Promise<I_LocationInfo>((s, e) => {
            setRNConfiguration({ skipPermissionRequests: true })
            getCurrentPosition(
                (info: any) => {
                    s({
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude,
                        is_current: true
                    })
                },
                (error: any) => {
                    const code = error?.code;
                    if (code == 2) return e(new TimeoutError(error))
                    e(error)
                },
                { timeout: 10000, enableHighAccuracy: false },
            );
        })
        return addTimeout(() => fetchLocationPromise)()
    }


    const fetchLocationDescUrl = function (latitude: number, longitude: number) {
        return `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    }

    const getCurrentLocationStr = addTimeout(
        async function () {
            const location = await getLocation();
            let url = fetchLocationDescUrl(location.latitude, location.longitude)
            const res = await fetch(url, { method: "GET" })
            const tempData = await res.text()
            const resJson = JSON.parse(tempData)
            return {
                ...resJson?.address,
                ...location
            } as {
                city: string
                state: string
                country: string
                postcode: string
                province?: string
            }
        }
    )

    return {
        getLocation,
        getCurrentLocationStr
    }
}







