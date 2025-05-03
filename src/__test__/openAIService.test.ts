import OpenAI from "openai";
import { exctractTextFromImage } from "../services/openAIService";

jest.mock('openai');

const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>

describe('exctractTextFromImage', ()=>{
    const mockCreate = jest.fn()

    beforeAll(()=>{
        MockedOpenAI.mockClear()
        MockedOpenAI.mockImplementation(() => ({
            apiKey:'test_key',
            chat: {
              completions: {
                create: mockCreate
              }
            }
          }) as any);
    })

    test('Returns text response from a valid image file', async()=>{
        const fakeContent = 'Текст, обнаруженный на изображении: Hello World';
        mockCreate.mockResolvedValueOnce({
          choices: [
            {
              message: {
                content: fakeContent
              }
            }
          ]
        });
        const result = await exctractTextFromImage('data:image/png;base64,fakeImage', 'test-key');
        expect(result).toBe(fakeContent);
        expect(MockedOpenAI).toHaveBeenCalledWith({ apiKey: 'test-key' });
        expect(mockCreate).toHaveBeenCalled();
    });

    test('Throws error when OpenAI returns no content', async () => {
        mockCreate.mockResolvedValueOnce({ choices: [{}] });
        await expect(exctractTextFromImage('data:image/png;base64,fakeImage', 'test-key')).rejects.toThrow(/No valid content returned from OpenAi/);
      });
    
    test('Throws error on OpenAI failure', async () => {
        mockCreate.mockRejectedValueOnce(new Error('API failure'));
        await expect(exctractTextFromImage('data:image/png;base64,fakeImage', 'test-key')).rejects.toThrow(/Failed to exctract text from image/);
      });
})