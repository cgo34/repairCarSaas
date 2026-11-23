import type { InjectionKey } from 'vue';
import type { IDownloadService } from '@/shared/application/ports/IDownloadService';

export const DOWNLOAD_SERVICE_KEY: InjectionKey<IDownloadService> = Symbol('DownloadService');
