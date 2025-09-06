import React, { useState, useCallback } from 'react';
import EditorCanvas from './components/EditorCanvas';
import StyleControls from './components/StyleControls';
import ReferenceSidebar from './components/ReferenceSidebar';
import { Paragraph, Reference } from './types';
import { ARTICLE_STRUCTURES } from './constants';
import { generateArticle, modifyParagraph, summarizeText } from './services/geminiService';
import PlusIcon from './components/icons/PlusIcon';

// Simple unique ID generator to avoid adding a dependency
const uuidv4 = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const App: React.FC = () => {
    const [paragraphs, setParagraphs] = useState<Paragraph[]>([
        { id: uuidv4(), title: "Introduction", content: "", explanation: "Introduce the main topic and grab the reader's attention." },
        { id: uuidv4(), title: "Development", content: "", explanation: "Elaborate on the main points, providing details and evidence." },
        { id: uuidv4(), title: "Conclusion", content: "", explanation: "Summarize the key points and provide a concluding thought." },
    ]);
    const [references, setReferences] = useState<Reference[]>([]);
    const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(paragraphs[0]?.id || null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modifyingParagraphId, setModifyingParagraphId] = useState<string | null>(null);
    const [modificationError, setModificationError] = useState<{ [key: string]: string | null }>({});
    const [wordCount, setWordCount] = useState<number>(500);
    const [language, setLanguage] = useState<string>('English');


    const handleApplyStructure = useCallback(async (structurePrompt: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const combinedReferenceText = references.map(r => r.originalContent).join('\n\n---\n\n');
            const generatedParagraphs = await generateArticle(combinedReferenceText, structurePrompt, wordCount, language);
            const newParagraphs = generatedParagraphs.map(p => ({ ...p, id: uuidv4() }));
            setParagraphs(newParagraphs);
            if (newParagraphs.length > 0) {
                setSelectedParagraphId(newParagraphs[0].id);
            } else {
                setSelectedParagraphId(null);
            }
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [references, wordCount, language]);

    const handleSelectParagraph = (id: string) => {
        setSelectedParagraphId(id);
    };

    const handleUpdateParagraph = (id: string, content: string) => {
        setParagraphs(prev =>
            prev.map(p => (p.id === id ? { ...p, content } : p))
        );
    };
    
    const handleDeleteParagraph = (id: string) => {
        setParagraphs(prev => prev.filter(p => p.id !== id));
        if (selectedParagraphId === id) {
            setSelectedParagraphId(null);
        }
    };

    const handleAddParagraph = () => {
        const newParagraph: Paragraph = {
            id: uuidv4(),
            title: "New Paragraph",
            content: "",
            explanation: "Add your content here."
        };
        setParagraphs(prev => [...prev, newParagraph]);
        setSelectedParagraphId(newParagraph.id);
    };
    
    const handleModifyParagraph = async (id: string, prompt: string) => {
        setModifyingParagraphId(id);
        setModificationError(prev => ({ ...prev, [id]: null })); // Clear previous error for this ID
        try {
            const paragraphToModify = paragraphs.find(p => p.id === id);
            if (!paragraphToModify) {
                throw new Error("Paragraph not found.");
            }
            if (!prompt.trim()) {
                return;
            }

            const newContent = await modifyParagraph(paragraphToModify.content, prompt, language);
            handleUpdateParagraph(id, newContent);

        } catch (e: any) {
            setModificationError(prev => ({ ...prev, [id]: e.message || 'An unknown error occurred.' }));
        } finally {
            setModifyingParagraphId(null);
        }
    };

    const handleAddReference = async (content: string) => {
        if (!content.trim()) return;

        const newReference: Reference = {
            id: uuidv4(),
            originalContent: content,
            summary: '',
            isLoading: true,
            error: null,
        };

        setReferences(prev => [newReference, ...prev]);

        try {
            const summary = await summarizeText(content);
            setReferences(prev =>
                prev.map(r =>
                    r.id === newReference.id ? { ...r, summary, isLoading: false } : r
                )
            );
        } catch (e: any) {
            setReferences(prev =>
                prev.map(r =>
                    r.id === newReference.id
                        ? { ...r, error: e.message || 'Failed to summarize', isLoading: false }
                        : r
                )
            );
        }
    };

    const handleDeleteReference = (id: string) => {
        setReferences(prev => prev.filter(r => r.id !== id));
    };


    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200">
            <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            AI Article Structurer
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-8">
                    <ReferenceSidebar 
                        references={references}
                        onAddReference={handleAddReference}
                        onDeleteReference={handleDeleteReference}
                    />
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <EditorCanvas 
                        paragraphs={paragraphs}
                        selectedParagraphId={selectedParagraphId}
                        modifyingParagraphId={modifyingParagraphId}
                        modificationError={modificationError}
                        onSelectParagraph={handleSelectParagraph}
                        onUpdateParagraph={handleUpdateParagraph}
                        onDeleteParagraph={handleDeleteParagraph}
                        onModifyParagraph={handleModifyParagraph}
                    />
                    <div className="flex justify-center">
                        <button
                            onClick={handleAddParagraph}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-900"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            Add Paragraph
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3">
                     <StyleControls 
                        structureOptions={ARTICLE_STRUCTURES}
                        onApplyStructure={handleApplyStructure}
                        isLoading={isLoading}
                        error={error}
                        wordCount={wordCount}
                        onWordCountChange={setWordCount}
                        language={language}
                        onLanguageChange={setLanguage}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;