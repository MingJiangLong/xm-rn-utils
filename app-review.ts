import { Linking, Platform } from "react-native"
import appReview from 'react-native-in-app-review'
import { to } from "./to";

const goToSupermarket = to(
    async (url?: string) => {
        const urlStr = `${url ?? ""}`
        if (urlStr.length == 0) throw new Error("url is empty");
        await Linking.openURL(urlStr)
    }
)
const goToReview = to(
    async () => {
        if (!appReview.isAvailable()) throw new Error("not supported app review")
        const result = await appReview.RequestInAppReview()
        if (result == false) throw new Error("not supported app review")
    }
)
const reviewWhenIos = async (fetchSupermarketStr: () => Promise<string>) => {
    const [error1, url] = await fetchSupermarketStr();
    if (error1) return;
    const [error,] = await goToSupermarket(url)
    if (!error) return;
    await goToReview()
}

const reviewWhenAndroid = async (fetchSupermarketStr: () => Promise<string>) => {
    const [error,] = await goToReview()
    if (!error) return;
    const [error1, url] = await fetchSupermarketStr();
    if (error1) return;
    await goToSupermarket(url)
}


export const goToAppReview = (fetchSupermarketStr: () => Promise<string>) => {
    const callback = Platform.select({
        android: reviewWhenAndroid,
        ios: reviewWhenIos
    })
    if (!callback) return;
    callback(fetchSupermarketStr)
}


