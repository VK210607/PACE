// src/pages/AdminDashboard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin page with two tabs: Manual Event Form | PDF Upload + Draft Review.

import { useState } from 'react';
import { FilePlus, Upload } from 'lucide-react';
import type { DraftEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import EventForm from '../components/admin/EventForm';
import PDFUploader from '../components/admin/PDFUploader';
import DraftReview from '../components/admin/DraftReview';

type Tab = 'manual' | 'pdf';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('manual');
  const [drafts,    setDrafts]    = useState<DraftEvent[] | null>(null);

  const handleDraftsReady = (newDrafts: DraftEvent[]) => {
    setDrafts(newDrafts);
  };

  const handleDraftsConfirmed = () => {
    setDrafts(null);
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Logged in as <span className="font-medium text-gray-600">{user?.full_name || 'Admin'}</span>
        </p>
      </div>

      <div className="px-6 py-5 max-w-2xl">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card px-4 py-3">
            <p className="text-xs text-gray-400">Publish New Event</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">Via form or PDF upload</p>
          </div>
          <div className="card px-4 py-3">
            <p className="text-xs text-gray-400">AI Ingestion</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">Gemini · Structured Output</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-md border border-gray-200 overflow-hidden mb-5">
          <button
            id="tab-manual"
            onClick={() => { setActiveTab('manual'); setDrafts(null); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
              ${activeTab === 'manual'
                ? 'bg-maroon-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <FilePlus className="h-4 w-4" />
            Manual Entry
          </button>
          <button
            id="tab-pdf"
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-l border-gray-200
              ${activeTab === 'pdf'
                ? 'bg-maroon-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Upload className="h-4 w-4" />
            Upload PDF
          </button>
        </div>

        {/* Tab panels */}
        <div className="card p-5">
          {activeTab === 'manual' && (
            <>
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Create Event Manually</h2>
              <EventForm />
            </>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1">AI-Powered PDF Ingestion</h2>
                <p className="text-xs text-gray-500">
                  Upload any college circular or schedule PDF. The AI will extract all events for you to review before publishing.
                </p>
              </div>

              {!drafts ? (
                <PDFUploader onDraftsReady={handleDraftsReady} />
              ) : (
                <>
                  {/* Back button */}
                  <button
                    onClick={() => setDrafts(null)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2"
                  >
                    ← Upload a different PDF
                  </button>
                  <DraftReview drafts={drafts} onConfirmed={handleDraftsConfirmed} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
