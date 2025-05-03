import { Logger, LogLevel } from '../utils/logger';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('Logger', () => {
  let logger: Logger;
  const generalLogFilePath = 'log.jsonl';
  const errorLogFilePath = 'error.log.jsonl';
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new Logger();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should log info message when log level is INFO', async () => {
    const message = 'Info message';
    const mockAppendFile = fs.appendFile as jest.Mock;
    mockAppendFile.mockResolvedValue(undefined); 
    await logger.log(message);
    expect(mockAppendFile).toHaveBeenCalledWith('log.jsonl', expect.stringContaining(message));
  });

  it('should log error message when log level is ERROR', async () => {
    const message = 'Error message';
    const mockAppendFile = fs.appendFile as jest.Mock;
    mockAppendFile.mockResolvedValue(undefined); 
    await logger.error(message);
    expect(mockAppendFile).toHaveBeenCalledWith('error.log.jsonl', expect.stringContaining(message));
  });

  it('should not log info message when log level is ERROR', async () => {
    const message = 'This should not be logged as info';
    const errorLogger = new Logger(LogLevel.ERROR);
    const mockAppendFile = fs.appendFile as jest.Mock;
    mockAppendFile.mockResolvedValue(undefined); 
    await errorLogger.log(message);
    expect(mockAppendFile).not.toHaveBeenCalledWith('log.jsonl', expect.stringContaining(message));
  });

  it('should log error message even when log level is ERROR', async () => {
    const message = 'This should be logged as error';
    const errorLogger = new Logger(LogLevel.ERROR);
    const mockAppendFile = fs.appendFile as jest.Mock;
    mockAppendFile.mockResolvedValue(undefined); 
    await errorLogger.error(message);
    expect(mockAppendFile).toHaveBeenCalledWith('error.log.jsonl', expect.stringContaining(message));
  });

  it('should write formatted log to file with timestamp', async () => {
    const message = 'Formatted message with timestamp';
    const mockAppendFile = fs.appendFile as jest.Mock;
    mockAppendFile.mockResolvedValue(undefined); 
    await logger.log(message);
    const argument = mockAppendFile.mock.calls[0][1];
    expect(argument).toMatch(/"timestamp\":\".*\"/);
    expect(argument).toContain(message);
  });
  
  it('should handle failure when writing to general log file', async () => {
    const mockAppendFile = jest.spyOn(fs, 'appendFile').mockRejectedValue(new Error('File write error'));
    await logger.log('This should fail to log');
    expect(mockAppendFile).toHaveBeenCalledWith(
      generalLogFilePath,
      expect.stringContaining('This should fail to log')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to write info log', expect.any(Error));
  });

  it('should handle failure when writing to error log file', async () => {
    const mockAppendFile = jest.spyOn(fs, 'appendFile').mockRejectedValue(new Error('File write error'));
    await logger.error('This should fail to log error');
    expect(mockAppendFile).toHaveBeenCalledWith(
      errorLogFilePath,
      expect.stringContaining('This should fail to log error')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to write error log', expect.any(Error));
  });
});