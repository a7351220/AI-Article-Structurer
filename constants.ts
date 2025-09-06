import { StructureOption } from './types';

export const ARTICLE_STRUCTURES: StructureOption[] = [
    { 
        label: '基本敘事結構', 
        prompt: 'Restructure the text into a basic narrative with an introduction, a development/body, and a conclusion. The introduction should grab the reader\'s attention. The body should elaborate on the main points. The conclusion should summarize and leave a lasting impression.' 
    },
    { 
        label: '問題－分析－解決方案', 
        prompt: 'Restructure the text to follow a "Problem-Analysis-Solution" format. The first paragraph should clearly state a problem. The second should analyze the causes and effects of this problem. The third should propose a concrete solution.' 
    },
    { 
        label: '故事化結構', 
        prompt: 'Rewrite the text using a "Storytelling Structure". Start with a relatable story or anecdote. Introduce a conflict or turning point in the middle. End with a key takeaway or moral from the story.' 
    },
    { 
        label: '資訊型結構', 
        prompt: 'Organize the text into an "Informational Structure". The first paragraph must provide necessary background context. The middle paragraph should detail the key facts or main points clearly. The final paragraph should offer a forward-looking perspective or discuss future implications.' 
    },
    { 
        label: '對比結構', 
        prompt: 'Reformat the text to follow a "Contrast Structure". The first paragraph should describe the current situation or a common problem. The second paragraph should paint a picture of an ideal, improved state. The third paragraph must outline the steps or bridge needed to get from the current state to the ideal state.' 
    },
    { 
        label: 'BAB 結構', 
        prompt: 'Before (undesired state); P2 = After (ideal outcome + quantified); P3 = Bridge (the single key step/tool).' 
    },
];
