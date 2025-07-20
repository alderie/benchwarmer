export {};

export interface FileData {
    path: string | null;
    name: string | null;
    size: number | null;
}

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<FileData | null>;
    };
  }
}