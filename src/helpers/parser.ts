import { IncomingMessage } from 'http';

export const parseUrl = (url: string): string => {
  return url
    .split('/')
    .filter((urlPart) => !!urlPart)
    .join('/');
};

export const parseBody = (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body: string = '';
    req
      .on('data', (chunk) => (body += chunk.toString()))
      .on('end', () => resolve(body))
      .on('error', (err) => reject(err));
  });
};
