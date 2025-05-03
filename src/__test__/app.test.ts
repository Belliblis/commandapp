import { imageToTextCommand } from '../commands/imageToText';

// Mock yargs methods
jest.mock('yargs', () => {
  const commandMock = jest.fn().mockReturnThis();
  const demandCommandMock = jest.fn().mockReturnThis();
  const strictMock = jest.fn().mockReturnThis();
  const helpMock = jest.fn().mockReturnThis();
  const parseMock = jest.fn();

  return {
    __esModule: true,
    default: () => ({
      command: commandMock,
      demandCommand: demandCommandMock,
      strict: strictMock,
      help: helpMock,
      parse: parseMock,
    }),
    commandMock,
    demandCommandMock,
    strictMock,
    helpMock,
    parseMock,
  };
});

// Import app AFTER mocks
import '../app';

describe('app.ts CLI setup', () => {
  const { commandMock, demandCommandMock, strictMock, helpMock, parseMock } = jest.requireMock('yargs');

  it('registers the imageToTextCommand and sets up yargs correctly', () => {
    expect(commandMock).toHaveBeenCalledWith(imageToTextCommand);
    expect(demandCommandMock).toHaveBeenCalled();
    expect(strictMock).toHaveBeenCalled();
    expect(helpMock).toHaveBeenCalled();
    expect(parseMock).toHaveBeenCalled();
  });
});
