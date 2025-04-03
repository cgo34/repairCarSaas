// @infrastructure/download/BrowserDownloadService.ts

import { IDownloadService } from '@/@domain/services/IDownloadService';
import { injectable } from 'inversify';

@injectable()
export class BrowserDownloadService implements IDownloadService {
  download(blobUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
