import React, { useRef, useEffect, useState } from 'react';
import { Paragraph } from '../types';
import TrashIcon from './icons/TrashIcon';
import InfoIcon from './icons/InfoIcon';
import WandIcon from './icons/WandIcon';

interface ParagraphBlockProps {
  paragraph: Paragraph;
  isSelected: boolean;
  isModifying: boolean;
  modificationError: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onModify: (id: string, prompt: string) => void;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ 
  paragraph, 
  isSelected, 
  isModifying,
  modificationError,
  onSelect, 
  onUpdate, 
  onDelete,
  onModify
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [modificationPrompt, setModificationPrompt] = useState('');

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [paragraph.content]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(paragraph.id, e.target.value);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(paragraph.id);
  };

  const handleModifyClick = () => {
    if (modificationPrompt.trim() && !isModifying) {
        onModify(paragraph.id, modificationPrompt);
    }
  };

  const containerClasses = `relative group p-4 rounded-lg border-2 transition-all duration-200 ${
    isSelected
      ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700/50'
      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
  }`;

  return (
    <div
      className={containerClasses}
      onClick={() => onSelect(paragraph.id)}
    >
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{paragraph.title}</h3>
      
      <div className="bg-slate-100 dark:bg-slate-900/50 rounded-md p-3 mb-4 flex items-start space-x-3 text-sm">
        <InfoIcon className="w-5 h-5 mt-0.5 text-slate-400 flex-shrink-0" />
        <p className="text-slate-600 dark:text-slate-400">{paragraph.explanation}</p>
      </div>

      <div className="relative">
        <textarea
          ref={textAreaRef}
          value={paragraph.content}
          onChange={handleTextChange}
          className="w-full bg-transparent resize-none focus:outline-none p-2 leading-relaxed text-slate-800 dark:text-slate-200 cursor-text"
          rows={1}
          placeholder="Start writing..."
        />
        <button
          onClick={handleDelete}
          className="absolute top-0 right-0 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete paragraph"
          style={{ opacity: isSelected ? 1 : undefined }}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 border-t border-slate-200 dark:border-slate-600 pt-4">
        <div className="flex items-center mb-2">
            <WandIcon className="w-5 h-5 mr-2 text-indigo-400" />
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Rewrite this paragraph</h4>
        </div>
        <div className="pl-7">
            <textarea
                value={modificationPrompt}
                onChange={(e) => setModificationPrompt(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent card selection when clicking textarea
                placeholder="e.g., 'Make this more persuasive' or 'Simplify the language...'"
                className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent dark:text-slate-200"
                rows={2}
                disabled={isModifying}
                aria-label="Paragraph modification prompt"
            />
             {modificationError && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1" role="alert">
                    {modificationError}
                </p>
             )}
            <div className="flex justify-end mt-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card selection
                        handleModifyClick();
                    }}
                    disabled={isModifying || !modificationPrompt.trim()}
                    className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    <WandIcon className={`w-4 h-4 mr-2 ${isModifying ? 'animate-spin' : ''}`} />
                    <span>{isModifying ? 'Rewriting...' : 'Rewrite'}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParagraphBlock;