import path from 'path';

const fs: any = jest.genMockFromModule('fs-extra');

let mockFiles: {
  [key: string]: Record<string, string>;
} = {};

fs.__setMockFiles = (newFiles: Record<string, string>) => {
  mockFiles = {};

  for (const file of Object.keys(newFiles)) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = {};
    }

    mockFiles[dir][path.basename(file)] = newFiles[file];
  }
};

fs.__clearFiles = () => {
  mockFiles = {};
};

fs.existsSync = (p: string): boolean => {
  const dir = path.dirname(p);

  if (!mockFiles[dir]) {
    return false;
  }

  return Object.keys(mockFiles[dir]).includes(path.basename(p));
};

fs.readFileSync = (p: string): string => {
  const dir = path.dirname(p);
  const file = path.basename(p);

  if (!mockFiles[dir] || !mockFiles[dir][file]) {
    throw new Error('File does not exist');
  }

  return mockFiles[dir][file];
};

fs.writeFileSync = (p: string, contents: string) => {
  const dir = path.dirname(p);
  const file = path.basename(p);

  if (!mockFiles[dir]) {
    mockFiles[dir] = {};
  }

  mockFiles[dir][file] = contents;
};

export default fs;
