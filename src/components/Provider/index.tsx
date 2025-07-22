import './Provider.css';
import { useState } from 'react';

// Import SVGs directly as modules
import openaiIcon from '../../assets/icons/openai.png';
import anthropicIcon from '../../assets/icons/anthropic.png';
import googleIcon from '../../assets/icons/gemini-color.png';
import groqIcon from '../../assets/icons/groq.png';
import cohereIcon from '../../assets/icons/cohere-color.png';
import ollamaIcon from '../../assets/icons/ollama.png';
import metaIcon from '../../assets/icons/meta-color.png';
import { Button } from '../Button';
import { AddModelModal, type Model } from '../AddModelModal';

const ModelIcons: Record<string, string> = {
    openai: openaiIcon,
    anthropic: anthropicIcon,
    google: googleIcon,
    'google-generative-ai': googleIcon,
    groq: groqIcon,
    together: metaIcon,
    'together-ai': metaIcon,
    'azure-openai': openaiIcon,
    mistral: metaIcon,
    cohere: cohereIcon,
    ollama: ollamaIcon,
}

export const Provider = ({
    name,
    className = '',
    models = [],
    onAddModel,
    onRemoveModel,
}: {
    name: string;
    className?: string;
    models?: Model[];
    onAddModel?: (model: Model) => void;
    onRemoveModel?: (modelId: string) => void;
}) => {
    const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
    const iconSrc = ModelIcons[name.toLowerCase()];
    
    // Capitalize first letter of provider name for display
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    
    const handleAddModel = (model: Model) => {
        onAddModel?.(model);
    };
    
    const handleRemoveModel = (modelId: string) => {
        onRemoveModel?.(modelId);
    };
    
    return (
        <div className={`provider ${className}`}>
            <div className='provider-header'>
                {iconSrc && (
                    <img
                        src={iconSrc}
                        alt={`${name} icon`}
                        className="provider-icon"
                    />
                )}
                <span className="provider-name">{displayName}</span>
                <code className="api-key">API Key: ••••••••</code>
                <Button onClick={() => setIsAddModelModalOpen(true)}>Add Model</Button>
            </div>
            
            {models.length > 0 && (
                <div className='provider-models'>
                    <div className="models-list">
                        {models.map((model) => (
                            <div key={model.id} className="model-item">
                                <span className="model-name">{model.name}</span>
                                {model.reasoning && <span>reasoning</span> }
                                <button 
                                    className="model-remove-btn"
                                    onClick={() => handleRemoveModel(model.id)}
                                    title="Remove model"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <AddModelModal
                isOpen={isAddModelModalOpen}
                onClose={() => setIsAddModelModalOpen(false)}
                provider={name}
                onAdd={handleAddModel}
            />
        </div>
    );
}