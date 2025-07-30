import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic';
import modelList from './modelList.json';


export const getSupportedModelList = () => {
    return modelList.models;
}