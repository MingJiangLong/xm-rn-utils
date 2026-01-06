import { TimeoutError } from "./error"
import { addTimeout } from "./add-timeout"
import Location2 from '@react-native-community/geolocation'
export interface I_LocationInfo {
    latitude: number
    longitude: number
    is_current: boolean
}

export function getCurrentPosition() {
    const fetchLocationPromise = new Promise<I_LocationInfo>((s, e) => {
        Location2.setRNConfiguration({ skipPermissionRequests: true })
        Location2.getCurrentPosition(
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
const getCurrentPositionDetail = addTimeout(
    async function () {
        const location = await getCurrentPosition();
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

export const Location = {
    getCurrentPosition,
    getCurrentPositionDetail
}







