import fs from 'fs/promises';
import path from "path";

const ALLOWED_IMAGE_EXTENSIONS:RegExp  =/(.png|.jpg|.jpeg|.webp)$/
export const checkFileExists = async (path:string):Promise<boolean>=>{
    try{
        const fileExists = await fs.stat(path)
        return fileExists.isFile()
    }catch(error){
        throw new Error(`Error checking file at ${path}. ${error}`)  
    }
}

export const checkFileIsImage = (path:string):boolean=>{
    if (!ALLOWED_IMAGE_EXTENSIONS.test(path)){
        throw new Error ('File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.')
    } 
    return true
}

export const convertImageToBase64DataUrl = async(filePath:string):Promise<string>=>{
    try{
        const imageBuffer = await fs.readFile(filePath)
        const imageBase64 = imageBuffer.toString('base64')
        const imageExt = path.extname(filePath).slice(1)
        return `data:image/${imageExt};base64,${imageBase64}`;
    } catch(error){
        throw new Error(`Error converting file at ${filePath}. ${error}`)
    }
}