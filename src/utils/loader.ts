import fs from 'fs/promises';

export const loadEnv = async (envFilePath:string = '.env.local')=>{
    try{
        const envFile = await fs.readFile(envFilePath, 'utf-8');
        envFile.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if(!trimmedLine || trimmedLine.startsWith("#")) return;
            const [key, value] = trimmedLine.split("=");
            if (!key || !value || process.env[key.trim()]) return;
            process.env[key.trim()] = value.trim();
            
    });
    }catch (error){
        throw new Error(`Failed to load the environment from ${envFilePath} file. ${error}`)
    }
}


