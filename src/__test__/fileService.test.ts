import {checkFileIsImage, checkFileExists, convertImageToBase64DataUrl} from '../services/fileService'
import fs from 'fs/promises';
import { Stats } from 'fs';

jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('checkFileExists', ()=>{
    
    test('returns true when file exists', async () => {
        mockedFs.stat.mockResolvedValueOnce({
            isFile: () => true,
          } as unknown as Stats); 
        const result = await checkFileExists('some/file/path.txt');
        expect(result).toBe(true);
        expect(mockedFs.stat).toHaveBeenCalledWith('some/file/path.txt');
      });
    test('throws an error if file is nonexisting', async()=>{
        mockedFs.stat.mockRejectedValueOnce(new Error('File not found')); 
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
        const fakedBuffer = Buffer.from('fake image')
        mockedFs.readFile.mockResolvedValueOnce(fakedBuffer) 
        const result = await convertImageToBase64DataUrl('path/to/image.png');
        const expectedBase64URL = fakedBuffer.toString('base64')
        expect(result).toBe(`data:image/png;base64,${expectedBase64URL}`);
        expect(mockedFs.readFile).toHaveBeenCalledWith('path/to/image.png');
      });
    test('throws an error if file is nonexisting', async()=>{
        mockedFs.readFile.mockRejectedValueOnce(new Error('File not found')); 
        await expect(convertImageToBase64DataUrl('missingfile')).rejects.toThrow(/Error converting file at missingfile./) 
    })
})