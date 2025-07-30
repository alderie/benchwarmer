import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai'
import modelList from './modelList.json';


export const getSupportedModelList = () => {
    return modelList.models;
}