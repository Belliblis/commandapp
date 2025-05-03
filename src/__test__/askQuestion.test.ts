import { askQuestion } from '../utils/askQuestion';
import readline from 'readline';

jest.mock('readline');

describe('askQuestion', () => {
  it('should resolve with the correct answer', async () => {
    const mockQuestion = jest.fn((_: string, callback: (answer: string) => void) => {
      callback('mock answer'); 
    });
    (readline.createInterface as jest.Mock) = jest.fn().mockReturnValue({
      question: mockQuestion,
      close: jest.fn(),
    });
    const prompt = 'What is your name?';
    const result = await askQuestion(prompt);
    expect(result).toBe('mock answer');
    expect(mockQuestion).toHaveBeenCalledWith(prompt, expect.any(Function));
  });
});
