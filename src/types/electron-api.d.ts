import { Dataset } from "../utils/datasets";
import type { ModelData } from "../constants/models";

export {};

export type ModelData = {
  id: string;
  name: string;
  provider: string;
};

export interface FileData {
    path: string | null;
    name: string | null;
    size: number | null;
}

declare global {
  interface Window {
    electronAPI: {
      getSupportedModelsSync: () => ModelData[];
      openFile: () => Promise<FileData | null>;
      searchDatasets: (query: string, limit: number) => Promise<Dataset[]>;
    };
  }
}