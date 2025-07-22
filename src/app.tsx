import { createRoot } from 'react-dom/client';
import { Button } from './components/Button';
import { AddLLMModal } from './components/AddLLMModal';
import { useState } from 'react';
import type { FileData } from './types/electron-api';
import { Provider } from './components/Provider';
import type { Model } from './components/AddModelModal';

const App = () => {

    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [isAddLLMModalOpen, setIsAddLLMModalOpen] = useState(false);
    const [llmProviders, setLlmProviders] = useState<Array<{ provider: string, apiKey: string }>>([]);
    const [models, setModels] = useState<Model[]>([]);

    const openFilePicker = async () => {
        const file = await window.electronAPI.openFile();
        console.log('Selected file:', file);
        setSelectedFile(file);
    }

    const handleAddLLM = (provider: string, apiKey: string) => {
        setLlmProviders(prev => [...prev, { provider, apiKey }]);
        console.log('Added LLM provider:', provider);
    }

    const handleAddModel = (model: Model) => {
        setModels(prev => [...prev, model]);
        console.log('Added model:', model);
    }

    const handleRemoveModel = (modelId: string) => {
        setModels(prev => prev.filter(model => model.id !== modelId));
        console.log('Removed model:', modelId);
    }

    const getModelsForProvider = (providerName: string) => {
        return models.filter(model => model.provider.toLowerCase() === providerName.toLowerCase());
    }

    return (
        <div className='app-container'>
            <div className='app-header'>
                <div className='title-group'>
                    <h1>LLM Benchmarker</h1>
                    <p className='subtitle'>Automated benchmark suite for LLM APIs</p>
                </div>
                <div className='benchmark-group'>
                    <div className='button-row'>
                        <Button onClick={openFilePicker}>
                            {selectedFile ? <>{selectedFile.name}</> : <>Import Benchmark File <span className='subtext' style={{ marginLeft: 5 }}>(accepts .json, .jsonl, .txt, .csv, .parquet)</span></>}
                        </Button>
                    </div>
                    {selectedFile && (
                        <div className='file-info'>
                            <p>Path: {selectedFile.path}</p>
                            <p>Size: {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'Unknown'}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className='app-content'>
                <div className='content-header'>
                    <Button onClick={() => setIsAddLLMModalOpen(true)}>
                        Add LLM
                    </Button>
                </div>
                <div className='llm-providers'>
                    {llmProviders.length > 0 ? (
                        llmProviders.map((provider, index) => (
                            <Provider
                                key={index}
                                name={provider.provider}
                                className='llm-provider'
                                models={getModelsForProvider(provider.provider)}
                                onAddModel={handleAddModel}
                                onRemoveModel={handleRemoveModel}
                            />
                        ))
                    ) : (
                        <h4 className='app-splash'>No LLM Providers Configured</h4>
                    )}
                </div>
            </div>
            <AddLLMModal
                isOpen={isAddLLMModalOpen}
                onClose={() => setIsAddLLMModalOpen(false)}
                onAdd={handleAddLLM}
            />
        </div>
    );
}


const root = createRoot(document.body);
root.render(<App />);