import React from 'react';
import { useApp } from '../context/AppContext';
import { SchoolProfileSettings } from './SchoolProfileSettings';
import { X, Building2 } from 'lucide-react';

export const SchoolProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen } = useApp();

  if (!isProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Update Web App Profile & Replace Logo
              </h2>
              <p className="text-xs text-gray-500">
                Dewey Childcare House Administration Control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50/30">
          <SchoolProfileSettings 
            isModal={true} 
            onSuccess={() => setIsProfileModalOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
};
