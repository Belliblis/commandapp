import fs from 'fs/promises';

export enum LogLevel{
    INFO = 'info', 
    ERROR = 'error'
}

export class Logger{
    private logLevel:LogLevel;
    private generalLogFilePath:string;
    private errorLogFilePath:string;

    constructor(logLevel:LogLevel=LogLevel.INFO, generalLogFilePath:string = "log.jsonl", errorLogFilePath:string = "error.log.jsonl"){
        this.logLevel = logLevel
        this.generalLogFilePath = generalLogFilePath
        this.errorLogFilePath = errorLogFilePath
    }

    public async log(message:string|null){
        if (message){
            const logAccessGranted = this.logAllowed(LogLevel.INFO) 
        if (logAccessGranted)
            await this.logToFile(message, LogLevel.INFO)
        }
        
    }

    public async error(message:string){
        const logAccessGranted = this.logAllowed(LogLevel.ERROR) 
        if (logAccessGranted)
            await this.logToFile(message, LogLevel.ERROR)
    }

    private logAllowed(level:LogLevel){
        const levels: LogLevel[] = [LogLevel.INFO, LogLevel.ERROR]
        return levels.indexOf(level)>=levels.indexOf(this.logLevel)
    }

    private async logToFile(message:string, level:LogLevel){
        const formatedMessage = this.formatLogMessageToJSON(message, level)
        try{
            if (level===LogLevel.INFO){
                await fs.appendFile(this.generalLogFilePath, formatedMessage)
            }else if(level===LogLevel.ERROR){
                await fs.appendFile(this.errorLogFilePath, formatedMessage)
            }
        } catch (error) {
            console.error(`Failed to write ${level} log`, error)
        }
        
    }

    private formatLogMessageToJSON(message:string, level:LogLevel){
        return JSON.stringify({ type: level, 'message' : message, timestamp : new Date().toISOString()})+"\n"
    }
}