import { loadEnv } from "../utils/loader";
import fs from 'fs/promises';

jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>

describe('loadEnv', ()=>{ 
    const originalEnv = {...process.env}
    //so that process.env will be empty before each test
    beforeEach(()=>{
        process.env = {...originalEnv}
    })
    test('loads valid environment variables from .env.local', async () => {
        const mockedEnvFIleContent = 'API_KEY=1234872\nPASSWORD=password\nLOGIN=user'
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent) 
        await loadEnv('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env.PASSWORD).toBe(`password`);
        expect(process.env.LOGIN).toBe('user');
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
      });
    test('returns nothing from empty env file', async ()=>{
        mockedFs.readFile.mockResolvedValueOnce("") 
        await loadEnv('.env.local');
        expect(process.env).toEqual(originalEnv)
    })
    test('Does not include comments in process.env variable', async ()=>{
        const mockedEnvFIleContent = 'API_KEY=1234872\n#comment\nLOGIN=user'
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent) 
        await loadEnv('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env.LOGIN).toBe('user');
        expect(process.env).not.toHaveProperty('comment');
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    })
    test('Does not include duplicate keys', async ()=>{
        const mockedEnvFIleContent = 'API_KEY=1234872\nAPI_KEY=234321'
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent) 
        await loadEnv('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    })
    test('Does not include malformed lines', async ()=>{
        const mockedEnvFIleContent = 'API_KEY=1234872\nWRONG\n'
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent) 
        await loadEnv('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env).not.toHaveProperty('WRONG');
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    })
    test('Trimms lines with spaces', async ()=>{
        const mockedEnvFIleContent = 'API_KEY  =  1234872\n PASSWORD  = password'
        mockedFs.readFile.mockResolvedValueOnce(mockedEnvFIleContent) 
        await loadEnv('.env.local');
        expect(process.env.API_KEY).toBe("1234872");
        expect(process.env.PASSWORD).toBe("password");
        expect(mockedFs.readFile).toHaveBeenCalledWith('.env.local', "utf-8");
    })
    test('throws an error if file is nonexisting', async()=>{
        mockedFs.readFile.mockRejectedValueOnce(new Error('File not found')); 
        await expect(loadEnv('.env.local')).rejects.toThrow(/Failed to load the environment from .env.local file./) 
    })
})
