import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import { useState } from 'react';
import type { FileData } from './types/electron-api';

const App = () => {

    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);


    const openFilePicker = async () => {
        const file = await window.electronAPI.openFile();
        console.log('Selected file:', file);
        setSelectedFile(file);
    }

    return (
        <div className='app-container'>
            <div className='app-header'>
                <div className='title-group'>
                    <h1>LLM Benchmarker</h1>
                    <p className='subtitle'>Automated benchmark suite for LLM APIs</p>
                </div>
                <div className='benchmark-group'>
                    <Button onClick={openFilePicker}>
                        {selectedFile ? <>{selectedFile.name}</> : <>Import Benchmark File <span className='subtext' style={{ marginLeft: 5 }}>(accepts .json, .jsonl, .txt, .csv, .parquet)</span></>}
                    </Button>
                    {selectedFile && (
                        <div className='file-info'>
                            <p>Path: {selectedFile.path}</p>
                            <p>Size: {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'Unknown'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


const root = createRoot(document.body);
root.render(<App />);