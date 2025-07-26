// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Model methods
  getSupportedModelsSync: () => ipcRenderer.sendSync('models:supported'),

  // File methods
  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  // Dataset methods
  searchDatasets: (query: string, limit: number) => ipcRenderer.invoke('datasets:search', query, limit),
  getDatasetDetails: (datasetId: string) => ipcRenderer.invoke('datasets:details', datasetId),
  downloadDatasetFile: (url: string, outputPath: string) => ipcRenderer.invoke('datasets:download', url, outputPath),
});