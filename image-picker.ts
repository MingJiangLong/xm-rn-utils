const IMAGE_DEFAULT_OPTION = {
    mediaType: 'photo',
    maxHeight: 1920,
    maxWidth: 1080,
    includeBase64: true,
    quality: .5,
} as const


type BasicModule = {
    launchCamera: (...args: any[]) => Promise<any>
    launchImageLibrary: (...args: any[]) => Promise<any>
}

/**
 * 避免出现依赖问题
 * @param module 
 * @returns 
 */
export function createImagePickerBuilder<T extends BasicModule>(module: T) {
    const { launchCamera, launchImageLibrary } = module ?? {};
    return {
        openCamera: async (options?: Parameters<typeof launchCamera>[0]) => {

            if (!launchCamera) return undefined
            const result = await launchCamera({
                ...IMAGE_DEFAULT_OPTION,
                presentationStyle: "fullScreen",
                ...options,
            })
            const assets = result?.assets
            const imageInfo = assets?.[0];
            if (!imageInfo) return undefined;
            return {
                mimeType: imageInfo.type,
                base64: imageInfo.base64,
                uri: imageInfo.uri,
                name: imageInfo.fileName,
            } as const
        },
        openGallery: async (options?: Parameters<typeof launchImageLibrary>[0]) => {
            if (!launchImageLibrary) return undefined
            const result = await launchImageLibrary({
                ...IMAGE_DEFAULT_OPTION,
                presentationStyle: "fullScreen",
                ...options
            })
            const assets = result?.assets
            const imageInfo = assets?.[0]
            if (!imageInfo) return undefined;
            return {
                base64: `${imageInfo?.base64}`,
                uri: imageInfo.uri,
                name: imageInfo?.fileName,
                mimeType: imageInfo?.type,
            } as const
        },
    }
}