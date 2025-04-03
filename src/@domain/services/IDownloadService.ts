// @domain/services/IDownloadService.ts

export interface IDownloadService {
  download(blobUrl: string, filename: string): void;
}
