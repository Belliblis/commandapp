import { imageToTextCommand } from '../commands/imageToText';
import * as envLoader from '../utils/loader';
import * as fileService from '../services/fileService';
import * as openAIService from '../services/openAIService';
import * as askQuestionModule from '../utils/askQuestion';
import { Logger } from '../utils/logger';


jest.mock('../utils/loader');
jest.mock('../services/fileService');
jest.mock('../services/openAIService');
jest.mock('../utils/askQuestion');

describe('imageToTextCommand', () => {
  jest.mocked(envLoader.loadEnv);
  const mockedCheckFileExists = jest.mocked(fileService.checkFileExists);
  const mockedCheckFileIsImage = jest.mocked(fileService.checkFileIsImage);
  const mockedConvertImageToBase64DataUrl = jest.mocked(fileService.convertImageToBase64DataUrl);
  const mockedExctractTextFromImage = jest.mocked(openAIService.exctractTextFromImage);
  const mockedAskQuestion = jest.mocked(askQuestionModule.askQuestion);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.API_KEY = 'fake-api-key';
  });
  it('runs successfully and logs the extracted text', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn());
    const mockPath = 'path/to/image.png';
    const mockBase64 = 'data:image/png;base64,abc123';
    const mockExtractedText = 'This is the text from the image';
    (askQuestionModule.askQuestion as jest.Mock).mockResolvedValue(mockPath);
    (fileService.checkFileExists as jest.Mock).mockResolvedValue(true);
    (fileService.checkFileIsImage as jest.Mock).mockReturnValue(true);
    (fileService.convertImageToBase64DataUrl as jest.Mock).mockResolvedValue(mockBase64);
    (openAIService.exctractTextFromImage as jest.Mock).mockResolvedValue(mockExtractedText);
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(askQuestionModule.askQuestion).toHaveBeenCalled();
    expect(fileService.checkFileExists).toHaveBeenCalledWith(mockPath);
    expect(fileService.checkFileIsImage).toHaveBeenCalledWith(mockPath);
    expect(fileService.convertImageToBase64DataUrl).toHaveBeenCalledWith(mockPath);
    expect(openAIService.exctractTextFromImage).toHaveBeenCalledWith(mockBase64, 'fake-api-key');
    expect(logSpy).toHaveBeenCalledWith(mockExtractedText);
    expect(consoleLogSpy).toHaveBeenCalledWith(mockExtractedText);

    consoleLogSpy.mockRestore();
  });
  it('logs an error when no API key is present', async () => {
    process.env.API_KEY = '';
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn());
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("Error: No API key found in your env file!"));
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('logs error when file does not exist', async () => {
    process.env.API_KEY = '';
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn());
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    mockedAskQuestion.mockResolvedValue('path/to/image.png');
    mockedCheckFileExists.mockResolvedValue(false);
    mockedCheckFileIsImage.mockReturnValue(true);
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('No API key found in your env file!'));
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
    errorSpy.mockRestore();
    expect(mockedExctractTextFromImage).not.toHaveBeenCalled();
  });

  it('logs error when file is not an image', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn());
    mockedAskQuestion.mockResolvedValue('path/to/image.txt');
    mockedCheckFileExists.mockResolvedValue(true);
    mockedCheckFileIsImage.mockReturnValue(false);
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
    expect(mockedExctractTextFromImage).not.toHaveBeenCalled();
  });

  it('handles error during image conversion', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    mockedAskQuestion.mockResolvedValue('path/to/image.png');
    mockedCheckFileExists.mockResolvedValue(true);
    mockedCheckFileIsImage.mockReturnValue(true);
    mockedConvertImageToBase64DataUrl.mockRejectedValue(new Error('Conversion failed'));
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Conversion failed'));
    errorSpy.mockRestore();
  });

  it('handles error during text extraction', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    mockedAskQuestion.mockResolvedValue('path/to/image.png');
    mockedCheckFileExists.mockResolvedValue(true);
    mockedCheckFileIsImage.mockReturnValue(true);
    mockedConvertImageToBase64DataUrl.mockResolvedValue('data:image/png;base64,fakebase64');
    mockedExctractTextFromImage.mockRejectedValue(new Error('Extraction failed'));
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Extraction failed'));
    errorSpy.mockRestore();
  });

  it('handles error when logger.log fails', async () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(jest.fn());
    mockedAskQuestion.mockResolvedValue('path/to/image.png');
    mockedCheckFileExists.mockResolvedValue(true);
    mockedCheckFileIsImage.mockReturnValue(true);
    mockedConvertImageToBase64DataUrl.mockResolvedValue('data:image/png;base64,fakebase64');
    mockedExctractTextFromImage.mockResolvedValue('Extracted text');
    logSpy.mockRejectedValue(new Error('Log write failed'));
    await imageToTextCommand.handler({ _: [], $0: '' });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Log write failed'));
    errorSpy.mockRestore();
  });
});
