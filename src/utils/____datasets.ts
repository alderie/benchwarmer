import fs from 'fs';
import path from 'path';

interface ParquetFile {
    filename: string;
    url: string;
    size: number;
}

interface DatasetFilesResponse {
    parquet_files: ParquetFile[];
    error?: string;
}

interface DownloadedFile {
    originalPath: string;
    localPath: string;
    size: number;
    split: string;
}

class HuggingFaceDownloader {
    private baseUrl: string;
    private hfResolveUrl: string;

    constructor() {
        this.baseUrl = 'https://datasets-server.huggingface.co';
        this.hfResolveUrl = 'https://huggingface.co/datasets';
    }

    // Get list of available parquet files for a dataset
    async getDatasetFiles(datasetId: string): Promise<ParquetFile[]> {
        try {
            const response = await fetch(`${this.baseUrl}/parquet?dataset=${datasetId}`);
            const data: DatasetFilesResponse = await response.json();

            if (data.error) {
                throw new Error(`Dataset error: ${data.error}`);
            }

            return data.parquet_files;
        } catch (error) {
            console.error('Error fetching dataset files:', error);
            throw error;
        }
    }

    // Download a specific parquet file
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
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(outputPath, buffer);
            console.log(`Downloaded: ${path.basename(outputPath)}`);

            return outputPath;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }

    // Download entire dataset
    async downloadDataset(datasetId: string, outputDir = './datasets'): Promise<DownloadedFile[]> {
        try {
            console.log(`Downloading dataset: ${datasetId}`);

            const files = await this.getDatasetFiles(datasetId);
            console.log("files to download ", files);
            const downloadedFiles: DownloadedFile[] = [];

            for (const file of files) {
                const filename = file.filename.replace(/\//g, '_'); // Replace slashes
                const outputPath = path.join(outputDir, datasetId.replace('/', '_'), filename);

                console.log(`Downloading ${file.filename} (${file.size} bytes)...`);
                await this.downloadFile(file.url, outputPath);

                downloadedFiles.push({
                    originalPath: file.filename,
                    localPath: outputPath,
                    size: file.size,
                    split: this.extractSplit(file.filename)
                });
            }

            console.log(`✅ Downloaded ${downloadedFiles.length} files for ${datasetId}`);
            return downloadedFiles;

        } catch (error) {
            console.error('Error downloading dataset:', error);
            throw error;
        }
    }

    // Extract split name (train/test/validation) from filename
    private extractSplit(filename: string): string {
        const splits = ['train', 'test', 'validation', 'val'];
        for (const split of splits) {
            if (filename.includes(split)) {
                return split;
            }
        }
        return 'unknown';
    }

    // Load parquet file using a lightweight parquet reader
    async loadParquetFile(filePath: string): Promise<any[]> {
        // You'll need to install: npm install parquetjs
        try {
            const parquet = await import('parquetjs');
            const reader = await parquet.ParquetReader.openFile(filePath);

            const cursor = reader.getCursor();
            const records: any[] = [];

            let record = await cursor.next();
            while (record) {
                records.push(record);
                record = await cursor.next();
            }

            await reader.close();
            return records;
        } catch (error) {
            console.error('Error reading parquet file:', error);
            throw error;
        }
    }
}

export default HuggingFaceDownloader;


export class BenchmarkDataManager {

    private downloader: HuggingFaceDownloader;
    private datasetsDir: string;

    constructor() {
        this.downloader = new HuggingFaceDownloader();
        this.datasetsDir = path.join(process.cwd(), 'datasets');
    }

    // Download GSM8K dataset
    async downloadGSM8K() {
        return await this.downloader.downloadDataset('openai/gsm8k', this.datasetsDir);
    }

    // Download other benchmark datasets
    async downloadHumanEval() {
        return await this.downloader.downloadDataset('openai/humaneval', this.datasetsDir);
    }

    async downloadHellaSwag() {
        return await this.downloader.downloadDataset('Rowan/hellaswag', this.datasetsDir);
    }

    // Load dataset for benchmarking
    async loadDatasetSplit(datasetId: string, split = 'test') {
        try {
            const datasetPath = path.join(this.datasetsDir, datasetId.replace('/', '_'));
            const files = fs.readdirSync(datasetPath);

            // Find the file for the requested split
            const splitFile = files.find(file =>
                file.includes(split) && file.endsWith('.parquet')
            );

            if (!splitFile) {
                throw new Error(`No ${split} split found for ${datasetId}`);
            }

            const filePath = path.join(datasetPath, splitFile);
            return await this.downloader.loadParquetFile(filePath);

        } catch (error) {
            console.error('Error loading dataset split:', error);
            throw error;
        }
    }

    // Get sample data for quick testing
    async getSample(datasetId: string, split = 'test', sampleSize = 10) {
        const data = await this.loadDatasetSplit(datasetId, split);
        return data.slice(0, sampleSize);
    }
}

(async() => {
    const manager = new BenchmarkDataManager();
    await manager.downloadGSM8K();
})()