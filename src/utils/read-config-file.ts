import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';

export default function readConfigFile(filePath: string): any {
  const fileExt = path.extname(filePath);

  if (fileExt === '.yaml' || fileExt === '.yml') {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'));
  }

  return fs.readJsonSync(filePath);
}
