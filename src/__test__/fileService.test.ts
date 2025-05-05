import {checkFileIsImage, checkFileExists, convertImageToBase64DataUrl} from '../services/fileService'

describe('checkFileExists', ()=>{
    
    test('returns true when file exists', async () => {
        const result = await checkFileExists(__dirname+'/test_images/image_with_text.png');
        expect(result).toBe(true);
      });
    test('throws an error if file is nonexisting', async()=>{
        await expect(checkFileExists('missingfile')).rejects.toThrow(/Error checking file at missingfile./) 
    })
})

describe('checkFileIsImage', ()=>{
    test('Returns true for supported image files', ()=>{
        expect(checkFileIsImage('image.jpg')).toBe(true);
        expect(checkFileIsImage('image.jpeg')).toBe(true);
        expect(checkFileIsImage('image.png')).toBe(true);
        expect(checkFileIsImage('image.webp')).toBe(true);
    })
    test('Throws error for unsupported file types', ()=>{
        expect(()=>checkFileIsImage('image.json')).toThrow("File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.")
        expect(()=>checkFileIsImage('image.txt')).toThrow("File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.")
        expect(()=>checkFileIsImage('image')).toThrow("File is not an image or its type is not supported. Please submit images with .jpg, .jpeg, .png or .webp extensions.")
    })
})

describe('convertImageToBase64DataUrl', ()=>{ 
    test('returns data url with file converted to base64 string if file exists', async () => {
        const result = await convertImageToBase64DataUrl(__dirname+'/test_images/image_with_text.png');
        expect(result).toMatch(/data:image\/png;base64,/)
      });
    test('throws an error if file is nonexisting', async()=>{
        await expect(convertImageToBase64DataUrl('missingfile')).rejects.toThrow(/Error converting file at missingfile./) 
    })
})