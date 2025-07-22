import './ModelCard.css';
import type { Model } from '../AddModelModal';

export const ModelCard = ({
    model,
    onRemove,
}: {
    model: Model;
    onRemove: (modelId: string) => void;
}) => {
    return (
        <div className="model-card">
            <div className="model-info">
                <span className="model-name">{model.name}</span>
                <span className="model-provider-label">from {model.provider}</span>
            </div>
            <button 
                className="model-remove-btn"
                onClick={() => onRemove(model.id)}
                title="Remove model"
            >
                ×
            </button>
        </div>
    );
};