// src/components/admin/PDFUploader.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Drag-and-drop PDF upload component. On upload, calls /api/admin/ingest-pdf
// and hands the resulting draft events to the parent via onDraftsReady.

import { useCallback, useState } from 'react';
import { FileText, Upload, AlertTriangle } from 'lucide-react';
import type { DraftEvent } from '../../types';
import { ingestPDF } from '../../services/eventService';

interface Props {
  onDraftsReady: (drafts: DraftEvent[]) => void;
}

export default function PDFUploader({ onDraftsReady }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be smaller than 10 MB.');
      return;
    }

    setFileName(file.name);
    setError(null);
    setIsUploading(true);

    try {
      const drafts = await ingestPDF(file);
      onDraftsReady(drafts);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(message ?? 'Failed to process PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onDraftsReady]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 
                    rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-150
                    ${isDragging
                      ? 'border-maroon-800 bg-maroon-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }
                    ${isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}
                  `}
        onClick={() => document.getElementById('pdf-file-input')?.click()}
        role="button"
        aria-label="Upload PDF"
        tabIndex={0}
      >
        <input
          id="pdf-file-input"
          type="file"
          accept=".pdf"
          className="sr-only"
          onChange={handleFileInput}
          disabled={isUploading}
        />

        {isUploading ? (
          <>
            <svg className="h-8 w-8 animate-spin text-maroon-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-maroon-800">Analyzing with AI...</p>
              <p className="text-xs text-gray-500 mt-0.5">{fileName}</p>
            </div>
          </>
        ) : fileName && !error ? (
          <>
            <FileText className="h-8 w-8 text-maroon-700" />
            <div>
              <p className="text-sm font-medium text-gray-700">{fileName}</p>
              <p className="text-xs text-gray-500 mt-0.5">Click or drop a different PDF to replace</p>
            </div>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Drop your PDF here</p>
              <p className="text-xs text-gray-500 mt-0.5">or click to browse · Max 10 MB</p>
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 rounded-md bg-amber-50 border border-amber-100">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Tip:</strong> Upload any college circular, schedule PDF, or notice. 
          The AI will extract all events for your review before they are published.
        </p>
      </div>
    </div>
  );
}
