import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import './AddModelsModal.css';

import openaiIcon from '../../assets/icons/openai.png';
import anthropicIcon from '../../assets/icons/anthropic.png';
import googleIcon from '../../assets/icons/gemini-color.png';
import groqIcon from '../../assets/icons/groq.png';
import cohereIcon from '../../assets/icons/cohere-color.png';
import ollamaIcon from '../../assets/icons/ollama.png';
import metaIcon from '../../assets/icons/meta-color.png';
import { Search } from 'lucide-react';

type Model = {
    id: string;
    name: string;
    provider: 'anthropic' | 'openai' | 'google' | 'groq' | 'cohere' | 'ollama' | 'meta';
}

const providerIcons: Record<string, string> = {
    anthropic: anthropicIcon,
    openai: openaiIcon,
    google: googleIcon,
    groq: groqIcon,
    cohere: cohereIcon,
    ollama: ollamaIcon,
    meta: metaIcon,
};

interface AddModelsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddModels?: (models: Model[]) => void;
}

export const AddModelsModal = ({
    isOpen,
    onClose,
    onAddModels,
}: AddModelsModalProps) => {
    const [allModels, setAllModels] = useState<Model[]>([]);
    const [availableModels, setAvailableModels] = useState<Model[]>([]);
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen) {
            // Fetch available models using IPC
            const models = window.electronAPI.getSupportedModelsSync() || [];
            setAllModels(models);
            setAvailableModels(models);
        }
    }, [isOpen]);

    const handleFilterModels = (query: string) => {

        if (query.trim().length === 0) {
            // Reset to all models if query is empty
            setAvailableModels(allModels);
            return;
        }

        const filteredModels = availableModels.filter(model =>
            model.name.toLowerCase().includes(query.toLowerCase()) ||
            model.provider.toLowerCase().includes(query.toLowerCase())
        );
        setAvailableModels(filteredModels);
    };

    const handleModelToggle = (modelId: string) => {
        const newSelected = new Set(selectedModels);
        if (newSelected.has(modelId)) {
            newSelected.delete(modelId);
        } else {
            newSelected.add(modelId);
        }
        setSelectedModels(newSelected);
    };

    const handleAddModels = () => {
        const modelsToAdd = availableModels.filter(model => selectedModels.has(model.id));
        onAddModels?.(modelsToAdd);
        setSelectedModels(new Set());
        onClose();
    };

    const handleCancel = () => {
        setSelectedModels(new Set());
        onClose();
    };

    return (
        <Modal isOpen={isOpen} title="Add Models to Benchmark" onClose={handleCancel}>
            <div className="add-models-modal-content">
                <div className="form-group">
                    <label className="form-label">Select Models</label>
                    <div className="models-list-container">
                        <div className='models-list-header'>
                            <Search className='icon' />
                            <input
                                type="text"
                                className="model-search-input"
                                placeholder="Search models..."
                                onChange={(e) => {
                                    handleFilterModels(e.target.value);
                                }}
                            />
                        </div>
                        <div className='models-list'>
                            {availableModels.map((model) => (
                                <div
                                    key={model.id}
                                    className={`model-item ${selectedModels.has(model.id) ? 'selected' : ''}`}
                                    onClick={() => handleModelToggle(model.id)}
                                >
                                    <div className="model-info">
                                        <img 
                                            src={providerIcons[model.provider]} 
                                            alt={`${model.provider} Icon`} 
                                            className="model-provider-icon" 
                                        />
                                        <span className="model-name">{model.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button 
                        onClick={handleAddModels} 
                        className="accent"
                        disabled={selectedModels.size === 0}
                    >
                        Add {selectedModels.size} Model{selectedModels.size !== 1 ? 's' : ''}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};