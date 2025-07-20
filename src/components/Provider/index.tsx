import './Provider.css';

// Import SVGs directly as modules
import openaiIcon from '../../assets/icons/openai.png';
import anthropicIcon from '../../assets/icons/anthropic.png';
import googleIcon from '../../assets/icons/gemini-color.png';
import groqIcon from '../../assets/icons/groq.png';
import cohereIcon from '../../assets/icons/cohere-color.png';
import ollamaIcon from '../../assets/icons/ollama.png';
import metaIcon from '../../assets/icons/meta-color.png';
import { Button } from '../Button';

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
}: {
    name: string;
    className?: string;
}) => {
    const iconSrc = ModelIcons[name.toLowerCase()];
    
    // Capitalize first letter of provider name for display
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    
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
                <Button onClick={() => {}}>Add Model</Button>
            </div>
            <div className='model-selection'>
                <div className='model-item'>
                    <select className='model-list'>
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                        <option value="gpt-4">gpt-4</option>
                        <option value="gpt-4o">gpt-4o</option>
                    </select>
                </div>
            </div>
        </div>
    );
}