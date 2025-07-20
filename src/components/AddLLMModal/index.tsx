import { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';

const MODEL_PROVIDERS = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'google', label: 'Google Generative AI' },
    { value: 'groq', label: 'Groq' },
    { value: 'together', label: 'Together AI' },
    { value: 'azure-openai', label: 'Azure OpenAI' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'cohere', label: 'Cohere' },
    { value: 'openrouter', label: 'OpenRouter' },
];

export const AddLLMModal = ({
    isOpen,
    onClose,
    onAdd,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (provider: string, apiKey: string) => void;
}) => {
    const [selectedProvider, setSelectedProvider] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProvider && apiKey.trim()) {
            onAdd(selectedProvider, apiKey.trim());
            setSelectedProvider('');
            setApiKey('');
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedProvider('');
        setApiKey('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add LLM Provider">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="provider" className="form-label">
                        Model Provider
                    </label>
                    <select
                        id="provider"
                        className="form-select"
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        required
                    >
                        <option value="">Select a provider...</option>
                        {MODEL_PROVIDERS.map((provider) => (
                            <option key={provider.value} value={provider.value}>
                                {provider.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="apiKey" className="form-label">
                        API Key
                    </label>
                    <input
                        id="apiKey"
                        type="text"
                        className="form-input"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key..."
                        required
                    />
                </div>

                <div className="modal-actions">
                    <Button 
                        className="button-secondary" 
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!selectedProvider || !apiKey.trim()}>
                        Add Provider
                    </Button>
                </div>
            </form>
        </Modal>
    );
};