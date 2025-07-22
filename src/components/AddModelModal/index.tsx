import { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';

export interface Model {
    id: string;
    name: string;
    provider: string;
}

export const AddModelModal = ({
    isOpen,
    onClose,
    provider,
    onAdd,
}: {
    isOpen: boolean;
    onClose: () => void;
    provider: string;
    onAdd: (model: Model) => void;
}) => {
    const [selectedModel, setSelectedModel] = useState('');

    const supportedModels = window.electronAPI.getSupportedModelsSync();
    
    const availableModels = Object.entries(supportedModels[provider.toLowerCase()] ?? {});
    console.log('Available models for provider:', provider, availableModels);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedModel) {
            const model: Model = {
                id: `${provider}-${selectedModel}-${Date.now()}`,
                name: selectedModel,
                provider: provider,
            };
            onAdd(model);
            setSelectedModel('');
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedModel('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Add ${provider} Model`}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="model" className="form-label">
                        Select Model
                    </label>
                    <select
                        id="model"
                        className="form-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        required
                    >
                        <option value="">Choose a model...</option>
                        {availableModels.map(([modelName, props]) => (
                            <option key={modelName} value={modelName}>
                                {modelName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="modal-actions">
                    <Button 
                        className="button-secondary" 
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!selectedModel}>
                        Add Model
                    </Button>
                </div>
            </form>
        </Modal>
    );
};