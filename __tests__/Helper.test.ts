import { capitalizeFirstLetterOfEachWordInArray, fieldTextValidation, firstLetterInUpperCase, generateUsernameAndPassword, transformArray, transformLabel } from '@/utils/Helper';
import { State } from '@/utils/Interfaces';
import { Role } from '@/utils/app.constant';
import '@testing-library/jest-dom';

describe('generateUsernameAndPassword', () => {
  // Mock Date to control current year
  const mockDate = new Date(2024, 7, 3);
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate username and password for a valid role and state code', () => {
    const stateCode = 'CA';
    const role = Role.TEACHER;
    const result = generateUsernameAndPassword(stateCode, role);

    expect(result).not.toBeNull();
    expect(result?.username).toMatch(/^FSCCA24\d{5}$/); // Match FSC, CA, 24 (year), and 5 random digits
    expect(result?.password).toMatch(/^\d{5}$/); // Match 5 random digits
  });

  it('should return null and log a warning for an invalid role', () => {
    const stateCode = 'NY';
    const role = 'INVALID_ROLE';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = generateUsernameAndPassword(stateCode, role);

    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(`Unknown role: ${role}`);
  });

  it('should generate a 5-digit random password', () => {
    const stateCode = 'TX';
    const role = Role.STUDENT;
    const result = generateUsernameAndPassword(stateCode, role);

    expect(result?.password).toMatch(/^\d{5}$/);
  });

  it('should generate username with correct prefix for TEACHER role', () => {
    const stateCode = 'FL';
    const role = Role.TEACHER;
    const result = generateUsernameAndPassword(stateCode, role);

    expect(result?.username).toMatch(/^FSCFL24\d{5}$/); // Match FSC, FL, 24 (year), and 5 random digits
  });

  it('should generate username with correct prefix for STUDENT role', () => {
    const stateCode = 'NV';
    const role = Role.STUDENT;
    const result = generateUsernameAndPassword(stateCode, role);

    expect(result?.username).toMatch(/^SCNV24\d{5}$/); // Match SC, NV, 24 (year), and 5 random digits
  });

  it('should generate username with correct prefix for TEAM_LEADER role', () => {
    const stateCode = 'OH';
    const role = Role.TEAM_LEADER;
    const result = generateUsernameAndPassword(stateCode, role);

    expect(result?.username).toMatch(/^TLOH24\d{5}$/); // Match TL, OH, 24 (year), and 5 random digits
  });
});


describe('fieldTextValidation', () => {
    it('should return true for a valid text containing only alphabets and spaces', () => {
      expect(fieldTextValidation('Hello World')).toBe(true);
      expect(fieldTextValidation('This is a Test')).toBe(true);
      expect(fieldTextValidation('OpenAI ChatGPT')).toBe(true);
    });
  
    it('should return false for text containing numbers', () => {
      expect(fieldTextValidation('Hello123')).toBe(false);
      expect(fieldTextValidation('2024')).toBe(false);
      expect(fieldTextValidation('Text with 123 numbers')).toBe(false);
    });
  
    it('should return false for text containing special characters', () => {
      expect(fieldTextValidation('Hello@World')).toBe(false);
      expect(fieldTextValidation('Test!')).toBe(false);
      expect(fieldTextValidation('Hello#')).toBe(false);
    });
  
    it('should return true for text with mixed case alphabets', () => {
      expect(fieldTextValidation('Hello')).toBe(true);
      expect(fieldTextValidation('hello')).toBe(true);
      expect(fieldTextValidation('HELLO')).toBe(true);
    });
  
    it('should return true for text with leading and trailing spaces', () => {
      expect(fieldTextValidation('   Leading')).toBe(true);
      expect(fieldTextValidation('Trailing   ')).toBe(true);
      expect(fieldTextValidation('   Both   ')).toBe(true);
    });
  
    it('should return false for empty string', () => {
      expect(fieldTextValidation('')).toBe(false);
    });
  
    it('should return true for single space', () => {
      expect(fieldTextValidation(' ')).toBe(true);
    });
  
    it('should return true for multiple spaces', () => {
      expect(fieldTextValidation('     ')).toBe(true);
    });
  
    it('should return true for strings with only alphabetic characters', () => {
      expect(fieldTextValidation('abc')).toBe(true);
      expect(fieldTextValidation('ABC')).toBe(true);
      expect(fieldTextValidation('AbC')).toBe(true);
    });
  
    it('should return false for strings with underscores or hyphens', () => {
      expect(fieldTextValidation('Hello_World')).toBe(false);
      expect(fieldTextValidation('Hello-World')).toBe(false);
    });
  });

  describe('capitalizeFirstLetterOfEachWordInArray', () => {
    it('should capitalize the first letter of each word in every string of the array', () => {
      const input = ['hello world', 'this is a test', 'openai chatgpt'];
      const expectedOutput = ['Hello World', 'This Is A Test', 'Openai Chatgpt'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle single word strings', () => {
      const input = ['hello', 'world'];
      const expectedOutput = ['Hello', 'World'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle empty strings within the array', () => {
      const input = ['', 'hello world', ''];
      const expectedOutput = ['', 'Hello World', ''];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle arrays with single character words', () => {
      const input = ['a b c', 'd e f'];
      const expectedOutput = ['A B C', 'D E F'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle strings with multiple spaces between words', () => {
      const input = ['hello    world', 'this  is    a   test'];
      const expectedOutput = ['Hello    World', 'This  Is    A   Test'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should not affect already capitalized words', () => {
      const input = ['Hello World', 'Already Capitalized'];
      const expectedOutput = ['Hello World', 'Already Capitalized'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle strings with special characters', () => {
      const input = ['hello-world', 'openai@chatgpt'];
      const expectedOutput = ['Hello-World', 'Openai@Chatgpt'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle mixed case words', () => {
      const input = ['hElLo WoRlD', 'OpEnAi ChAtGpT'];
      const expectedOutput = ['HElLo WoRlD', 'OpEnAi ChAtGpT'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an empty array', () => {
      const input: string[] = [];
      const expectedOutput: string[] = [];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an array with empty strings only', () => {
      const input = ['', '', ''];
      const expectedOutput = ['', '', ''];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle arrays with non-alphabetic characters', () => {
      const input = ['123 abc', '$%^ abc', '123'];
      const expectedOutput = ['123 Abc', '$%^ Abc', '123'];
      expect(capitalizeFirstLetterOfEachWordInArray(input)).toEqual(expectedOutput);
    });
  });

  describe('firstLetterInUpperCase', () => {
    it('should capitalize the first letter of each word in a single-word string', () => {
      expect(firstLetterInUpperCase('hello')).toBe('Hello');
      expect(firstLetterInUpperCase('world')).toBe('World');
    });
  
    it('should capitalize the first letter of each word in a multi-word string', () => {
      expect(firstLetterInUpperCase('hello world')).toBe('Hello World');
      expect(firstLetterInUpperCase('this is a test')).toBe('This Is A Test');
      expect(firstLetterInUpperCase('openai chatgpt')).toBe('Openai Chatgpt');
    });
  
    it('should return null for an empty string', () => {
      expect(firstLetterInUpperCase('')).toBeNull();
    });
  
    it('should handle strings with leading and trailing spaces', () => {
      expect(firstLetterInUpperCase('   leading')).toBe('   Leading');
      expect(firstLetterInUpperCase('trailing   ')).toBe('Trailing   ');
      expect(firstLetterInUpperCase('   both   ')).toBe('   Both   ');
    });
  
    it('should handle strings with multiple spaces between words', () => {
      expect(firstLetterInUpperCase('hello    world')).toBe('Hello    World');
      expect(firstLetterInUpperCase('this  is    a   test')).toBe('This  Is    A   Test');
    });
  
    it('should not affect already capitalized words', () => {
      expect(firstLetterInUpperCase('Hello World')).toBe('Hello World');
      expect(firstLetterInUpperCase('Already Capitalized')).toBe('Already Capitalized');
    });
  
    it('should handle mixed case words', () => {
      expect(firstLetterInUpperCase('hElLo WoRlD')).toBe('HElLo WoRlD');
      expect(firstLetterInUpperCase('OpEnAi ChAtGpT')).toBe('OpEnAi ChAtGpT');
    });
  
    it('should handle single-character words', () => {
      expect(firstLetterInUpperCase('a b c')).toBe('A B C');
      expect(firstLetterInUpperCase('x y z')).toBe('X Y Z');
    });
  
    it('should return null for a null input', () => {
      expect(firstLetterInUpperCase(null as unknown as string)).toBeNull();
    });
  
    it('should handle strings with numbers', () => {
      expect(firstLetterInUpperCase('hello 123 world')).toBe('Hello 123 World');
      expect(firstLetterInUpperCase('2024 is a year')).toBe('2024 Is A Year');
    });
  
    it('should handle an empty word array', () => {
      expect(firstLetterInUpperCase('   ')).toBe('   ');
    });
  
    it('should handle strings with non-alphabetic characters', () => {
      expect(firstLetterInUpperCase('123 abc')).toBe('123 Abc');
      expect(firstLetterInUpperCase('$%^ abc')).toBe('$%^ Abc');
      expect(firstLetterInUpperCase('123')).toBe('123');
    });
  });

  describe('transformLabel', () => {
    it('should transform a label with underscores to capitalized words', () => {
      expect(transformLabel('hello_world')).toBe('Hello World');
      expect(transformLabel('this_is_a_test')).toBe('This Is A Test');
      expect(transformLabel('openai_chatgpt')).toBe('Openai Chatgpt');
    });
  
    it('should transform a label with mixed casing', () => {
      expect(transformLabel('hELLo_wOrLD')).toBe('Hello World');
      expect(transformLabel('tHiS_iS_A_tEsT')).toBe('This Is A Test');
    });
  
    it('should handle labels with spaces instead of underscores', () => {
      expect(transformLabel('hello world')).toBe('Hello World');
      expect(transformLabel('this is a test')).toBe('This Is A Test');
    });
  
    it('should transform a single word label', () => {
      expect(transformLabel('hello')).toBe('Hello');
      expect(transformLabel('WORLD')).toBe('World');
    });
  
    it('should return an empty string if the label is empty', () => {
      expect(transformLabel('')).toBe('');
    });

    it('should handle labels with numbers', () => {
      expect(transformLabel('hello_123_world')).toBe('Hello 123 World');
      expect(transformLabel('2024_is_a_year')).toBe('2024 Is A Year');
    });
  
    it('should handle labels with multiple underscores', () => {
      expect(transformLabel('hello___world')).toBe('Hello   World');
      expect(transformLabel('this__is___a_test')).toBe('This  Is   A Test');
    });
  
    it('should handle labels with leading and trailing underscores', () => {
      expect(transformLabel('_hello_world_')).toBe(' Hello World ');
      expect(transformLabel('__this_is_a_test__')).toBe('  This Is A Test  ');
    });
  
    it('should handle labels with leading and trailing spaces', () => {
      expect(transformLabel('   hello world   ')).toBe('   Hello World   ');
    });
  });
  
  describe('transformArray', () => {
    it('should transform an array of State objects', () => {
      const input: State[] = [
        { value: '1', label: 'hello_world' },
        { value: '2', label: 'this_is_a_test' },
        { value: '3', label: 'openai_chatgpt' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: 'Hello World' },
        { value: '2', label: 'This Is A Test' },
        { value: '3', label: 'Openai Chatgpt' },
      ];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an empty array', () => {
      const input: State[] = [];
      const expectedOutput: State[] = [];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an array with a single State object', () => {
      const input: State[] = [{ value: '1', label: 'single_word' }];
      const expectedOutput: State[] = [{ value: '1', label: 'Single Word' }];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an array with mixed casing in labels', () => {
      const input: State[] = [
        { value: '1', label: 'hELLo_wOrLD' },
        { value: '2', label: 'tHiS_iS_A_tEsT' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: 'Hello World' },
        { value: '2', label: 'This Is A Test' },
      ];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an array with numbers in labels', () => {
      const input: State[] = [
        { value: '1', label: 'hello_123_world' },
        { value: '2', label: '2024_is_a_year' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: 'Hello 123 World' },
        { value: '2', label: '2024 Is A Year' },
      ];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an array with leading and trailing underscores in labels', () => {
      const input: State[] = [
        { value: '1', label: '_hello_world_' },
        { value: '2', label: '__this_is_a_test__' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: ' Hello World ' },
        { value: '2', label: '  This Is A Test  ' },
      ];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle an array with leading and trailing spaces in labels', () => {
      const input: State[] = [
        { value: '1', label: '   hello world   ' },
        { value: '2', label: '   this is a test   ' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: '   Hello World   ' },
        { value: '2', label: '   This Is A Test   ' },
      ];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should handle arrays with labels containing multiple underscores', () => {
      const input: State[] = [
        { value: '1', label: 'hello___world' },
        { value: '2', label: 'this__is___a_test' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: 'Hello   World' },
        { value: '2', label: 'This  Is   A Test' },
      ];
  
      expect(transformArray(input)).toEqual(expectedOutput);
    });
  
    it('should return a new array without modifying the original array', () => {
      const input: State[] = [
        { value: '1', label: 'hello_world' },
        { value: '2', label: 'this_is_a_test' },
      ];
  
      const expectedOutput: State[] = [
        { value: '1', label: 'Hello World' },
        { value: '2', label: 'This Is A Test' },
      ];
  
      const result = transformArray(input);
  
      expect(result).toEqual(expectedOutput);
      expect(input).toEqual([
        { value: '1', label: 'hello_world' },
        { value: '2', label: 'this_is_a_test' },
      ]); // Ensure original array is unchanged
    });
  });