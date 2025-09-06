export interface StructureOption {
    label: string;
    prompt: string;
}

export interface Paragraph {
  id: string;
  title: string;
  content: string;
  explanation: string;
}

export interface Reference {
  id: string;
  originalContent: string;
  summary: string;
  isLoading: boolean;
  error: string | null;
}
