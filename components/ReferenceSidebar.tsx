import React, { useState } from 'react';
import { Reference } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface ReferenceSidebarProps {
    references: Reference[];
    onAddReference: (content: string) => Promise<void>;
    onDeleteReference: (id: string) => void;
}

const ReferenceItem: React.FC<{ reference: Reference; onDelete: (id: string) => void; }> = ({ reference, onDelete }) => {
    if (reference.isLoading) {
        return (
            <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 animate-pulse">
                <p className="text-sm text-slate-500 dark:text-slate-400">AI is summarizing...</p>
            </div>
        );
    }

    if (reference.error) {
        return (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded-r-lg">
                <p className="font-semibold text-sm">Summarization Failed</p>
                <p className="text-xs">{reference.error}</p>
            </div>
        );
    }

    return (
        <div className="group relative bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 pr-10">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{reference.summary}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {reference.originalContent}
            </p>
            <button
                onClick={() => onDelete(reference.id)}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete reference"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
};


const ReferenceSidebar: React.FC<ReferenceSidebarProps> = ({ references, onAddReference, onDeleteReference }) => {
    const [newContent, setNewContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddClick = async () => {
        if (!newContent.trim() || isAdding) return;
        setIsAdding(true);
        await onAddReference(newContent);
        setNewContent('');
        setIsAdding(false);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 space-y-4 sticky top-24">
            <div>
                <h2 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-300 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Reference Materials
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add notes, articles, or any raw text here. The AI will summarize each entry and use them all as context.
                </p>
            </div>

            <div className="space-y-2">
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste your content here to add it as a reference..."
                    className="w-full h-32 p-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-800 dark:text-slate-200"
                    aria-label="New reference text input"
                    disabled={isAdding}
                />
                <button
                    onClick={handleAddClick}
                    disabled={!newContent.trim() || isAdding}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    <PlusIcon className={`-ml-1 mr-2 h-5 w-5 ${isAdding ? 'animate-spin' : ''}`} />
                    {isAdding ? 'Summarizing...' : 'Add Reference'}
                </button>
            </div>
            
            <div className="space-y-3 pt-2">
                <h3 className="text-md font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
                    Collected References
                </h3>
                {references.length === 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                        Your references will appear here.
                    </p>
                ) : (
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                         {references.map(ref => (
                            <ReferenceItem key={ref.id} reference={ref} onDelete={onDeleteReference} />
                         ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferenceSidebar;