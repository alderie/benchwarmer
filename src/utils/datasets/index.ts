import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

export type Dataset = {
    id: string;
    name: string;
    description: string;
    url: string;
}

export type DatasetFile = {
    filename: string;
    url: string;
    size: number;
    metadata?: {
        split?: string;
        config?: string;
    };
}

export interface BenchmarkDataProvider {
    name: string;
    searchDatasets(query: string, limit: number): Promise<Dataset[]>;
    getDatasetDetails(datasetId: string): Promise<DatasetFile[]>;
}

class HuggingFaceProvider implements BenchmarkDataProvider {
    name = 'HuggingFace';
    async searchDatasets(query: string, limit = 5): Promise<Dataset[]> {
        const response = await fetch(`https://huggingface.co/api/datasets?search=${encodeURIComponent(query)}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch datasets: ${response.statusText}`);
        }
        const data = await response.json();

        return data.map((item: any) => ({
            id: item.id,
            name: item.id,
            description: item.description || 'No description available',
            url: `https://huggingface.co/datasets/${item.id}`
        })) as Dataset[];
    }

    async getDatasetDetails(datasetId: string): Promise<DatasetFile[]> {
        const response = await fetch(`https://datasets-server.huggingface.co/parquet?dataset=${encodeURIComponent(datasetId)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch dataset details: ${response.statusText}`);
        }
        const data = await response.json();

        return data.parquet_files.map((item: any) => ({
            filename: item.filename,
            url: item.url,
            size: item.size,
            metadata: item.split && item.config ? {
                split: item.split,
                config: item.config
            } : undefined
        })) as DatasetFile[];
    }
}

export class DatasetManager {
    private providerMap: Map<string, BenchmarkDataProvider>;

    constructor(providers: Record<string, BenchmarkDataProvider>, private datasetDirectory: string) {
        const directory = path.join(app.getPath('userData'), 'datasets');
        
        this.datasetDirectory = datasetDirectory ?? directory;

        // Ensure the dataset directory exists
        if (!existsSync(this.datasetDirectory)) {
            mkdirSync(this.datasetDirectory, { recursive: true });
        }

        this.providerMap = new Map<string, BenchmarkDataProvider>(Object.entries(providers));
    }

    searchDatasets(query: string, limit = 5): Promise<Dataset[]> {
        const promises = Array.from(this.providerMap.values())
            .map(provider => provider.searchDatasets(query, limit));
        return Promise.allSettled(promises)
            .then(results => results.filter(response => response.status === 'fulfilled').flatMap(result => result.value));
    }


    getProvider(name: string): BenchmarkDataProvider | undefined {
        return this.providerMap.get(name);
    }

    async downloadFile(url: string, outputPath: string): Promise<string> {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Ensure directory exists
            const dir = path.dirname(outputPath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            writeFileSync(outputPath, buffer);

            return outputPath;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }
}

export const datasetManager = new DatasetManager({
    'HuggingFace': new HuggingFaceProvider(),
}, path.join(app.getPath('userData'), 'datasets'));

export default datasetManager;