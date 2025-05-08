import { loadImage, Image } from "canvas";

export async function convertFileToImage(file: File): Promise<Image> {
    const buff = await file.arrayBuffer();
    const img = await loadImage(Buffer.from(buff));
    return img;
}

export function simplifyObject(obj: Object) {
    return JSON.parse(JSON.stringify(obj));
}
