import React from 'react';
import { Paragraph } from '../types';
import ParagraphBlock from './ParagraphBlock';

interface EditorCanvasProps {
  paragraphs: Paragraph[];
  selectedParagraphId: string | null;
  modifyingParagraphId: string | null;
  modificationError: { [key: string]: string | null };
  onSelectParagraph: (id: string) => void;
  onUpdateParagraph: (id:string, content: string) => void;
  onDeleteParagraph: (id: string) => void;
  onModifyParagraph: (id: string, prompt: string) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ 
  paragraphs, 
  selectedParagraphId,
  modifyingParagraphId,
  modificationError,
  onSelectParagraph, 
  onUpdateParagraph, 
  onDeleteParagraph,
  onModifyParagraph,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 space-y-6">
      {paragraphs.map((p) => (
        <ParagraphBlock
          key={p.id}
          paragraph={p}
          isSelected={selectedParagraphId === p.id}
          isModifying={modifyingParagraphId === p.id}
          modificationError={modificationError[p.id] || null}
          onSelect={onSelectParagraph}
          onUpdate={onUpdateParagraph}
          onDelete={onDeleteParagraph}
          onModify={onModifyParagraph}
        />
      ))}
    </div>
  );
};

export default EditorCanvas;