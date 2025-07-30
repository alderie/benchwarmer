import React, { useState } from 'react';
import { BenchmarkData } from "../BenchmarkModal";
import './BenchmarkItem.css';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { DownloadIcon, Pause } from 'lucide-react';
import { AddModelsModal } from '../AddModelsModal';

import openaiIcon from '../../assets/icons/openai.png';
import anthropicIcon from '../../assets/icons/anthropic.png';
import googleIcon from '../../assets/icons/gemini-color.png';
import groqIcon from '../../assets/icons/groq.png';
import cohereIcon from '../../assets/icons/cohere-color.png';
import ollamaIcon from '../../assets/icons/ollama.png';
import metaIcon from '../../assets/icons/meta-color.png';
import { Tooltip } from '../Tooltip';

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

export const MiniCircularLoader = ({ progress = 0, size = 24, strokeWidth = 5, color = '#00FF6B', style }: {
    progress?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    style?: React.CSSProperties;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} style={style}>
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke="#454545ff"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s' }}
      />
    </svg>
  );
};

export const BenchmarkItem = ({
    benchmark,
}: {
    benchmark: BenchmarkData;
}) => {

    const [models, setModels] = useState<Model[]>([{
        id: '1',
        name: 'claude-4-sonnet-20240229',
        provider: 'anthropic',
    },{
        id: '2',
        name: 'gpt-4o',
        provider: 'openai',
    }]); // Placeholder for models, replace with actual model data

    const [isAddModelsModalOpen, setIsAddModelsModalOpen] = useState(false);

    const handleAddModels = (newModels: Model[]) => {
        // Add new models to the existing list, avoiding duplicates
        const existingIds = new Set(models.map(m => m.id));
        const uniqueNewModels = newModels.filter(m => !existingIds.has(m.id));
        setModels(prev => [...prev, ...uniqueNewModels]);
    };


    return (
        <div className="benchmark-item">
            <div className='benchmark-controls'>
                <Button onClick={() => {}}>Start</Button>
                <Button onClick={() => setIsAddModelsModalOpen(true)} style={{ marginLeft: '0.5rem' }} variant='flat'>Add Models</Button>
                <div className='dataset-info' style={{ marginLeft: 'auto' }}>
                    <IconButton icon={DownloadIcon} onClick={() => {}} className='download-dataset-button' />
                    <span className='dataset-name'>{benchmark.dataset?.name}</span>
                </div>
            </div>
            <div className='model-list'>
                {models.map((model, index) => (
                    <div key={index} className='model-item'>
                        <IconButton icon={Pause} onClick={() => {}} className='pause-model-button' />
                        <div className='model-data-chip'>
                            <MiniCircularLoader size={20} progress={70} style={{
                                marginRight: '0.6rem',
                            }} />
                            <div className='model-completed-items'>
                                <span className='completed-items-count'>700</span>
                                <span className='completed-items-total'> /1000</span>
                            </div>
                        </div>
                        <div className='model-data-chip'>
                            <img src={providerIcons[model.provider]} alt={`${model.provider} Icon`} className='model-provider-icon' />
                            <span className='model-name'>{model.name}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <AddModelsModal 
                isOpen={isAddModelsModalOpen}
                onClose={() => setIsAddModelsModalOpen(false)}
                onAddModels={handleAddModels}
            />
        </div>
    );
}