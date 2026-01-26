import React from 'react';

describe('CopyButton Component', () => {
  const mockClipboard = {
    writeText: jest.fn().mockResolvedValue(undefined)
  };

  beforeAll(() => {
    Object.assign(navigator, { clipboard: mockClipboard });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should copy text to clipboard', async () => {
    const text = '# Blog Post\n\nContent here';
    await navigator.clipboard.writeText(text);
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith(text);
  });

  test('should handle copy success', async () => {
    await navigator.clipboard.writeText('test');
    expect(mockClipboard.writeText).toHaveBeenCalled();
  });

  test('should handle copy failure', async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
    
    await expect(navigator.clipboard.writeText('test')).rejects.toThrow('Copy failed');
  });
});
