import React from 'react';
import { StructureOption } from '../types';
import WandIcon from './icons/WandIcon';

interface StructureControlsProps {
  structureOptions: StructureOption[];
  onApplyStructure: (structurePrompt: string) => void;
  isLoading: boolean;
  error: string | null;
  wordCount: number;
  onWordCountChange: (count: number) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const StructureControls: React.FC<StructureControlsProps> = ({
  structureOptions,
  onApplyStructure,
  isLoading,
  error,
  wordCount,
  onWordCountChange,
  language,
  onLanguageChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-700 dark:text-slate-300">
          Generation Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="word-count" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Word Count: <span className="font-bold text-indigo-600 dark:text-indigo-400">{wordCount}</span>
            </label>
            <input
              id="word-count"
              type="range"
              min="100"
              max="2000"
              step="50"
              value={wordCount}
              onChange={(e) => onWordCountChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800"
              disabled={isLoading}
              aria-label="Article word count"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onLanguageChange('English')}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed ${
                  language === 'English'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('Chinese')}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed ${
                  language === 'Chinese'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-700 dark:text-slate-300">
          Article Structures
        </h3>
        <div className="space-y-3">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4 text-sm" role="alert">
              <p className="font-bold">Generation Failed</p>
              <p>{error}</p>
            </div>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400 pb-2">
            Select a structure to generate a new draft or rewrite your existing article.
          </p>
          {structureOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => onApplyStructure(option.prompt)}
              disabled={isLoading}
              className="group flex items-center w-full p-3 text-left rounded-lg transition-colors duration-200 text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <WandIcon className={`w-5 h-5 mr-3 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-12'}`} />
              <span className="flex-1 font-medium">{option.label}</span>
            </button>
          ))}
          {isLoading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-4 animate-pulse">
              AI is crafting the article...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructureControls;