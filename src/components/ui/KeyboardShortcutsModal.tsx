import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const sections: ShortcutSection[] = [
    {
      title: 'Global Navigation',
      shortcuts: [
        { keys: ['⌘', 'K'], description: 'Open Global Command Palette' },
        { keys: ['?'], description: 'Show keyboard shortcuts cheat sheet' },
        { keys: ['Esc'], description: 'Close modal or dismiss active view' },
      ],
    },
    {
      title: 'Task Management',
      shortcuts: [
        { keys: ['C'], description: 'Open "Add Task" modal (on Project page)' },
        { keys: ['/'], description: 'Focus search input instantly' },
        { keys: ['1'], description: 'Switch to Table view' },
        { keys: ['2'], description: 'Switch to Kanban Board view' },
      ],
    },
    {
      title: 'Accessibility & Selection',
      shortcuts: [
        { keys: ['Tab'], description: 'Cycle through accessible interactive elements' },
        { keys: ['Shift', 'Tab'], description: 'Cycle backwards through interactive elements' },
        { keys: ['Space'], description: 'Toggle task selection / activate button' },
      ],
    },
  ];

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg transform rounded-2xl glass-panel-opaque border border-white/80 shadow-2xl p-6 transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Keyboard className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-bold text-slate-900 leading-tight">
                      Keyboard Shortcuts
                    </Dialog.Title>
                    <p className="text-xs text-slate-500">Power-user navigation and workflows</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Close shortcuts modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((sec) => (
                  <div key={sec.title}>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                      {sec.title}
                    </h4>
                    <div className="space-y-2">
                      {sec.shortcuts.map((sc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-white/60 border border-slate-200/50 text-sm"
                        >
                          <span className="text-xs text-slate-700 font-medium">
                            {sc.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {sc.keys.map((k, kIdx) => (
                              <kbd
                                key={kIdx}
                                className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded border border-slate-300/80 shadow-xs"
                              >
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>Tip: Press <kbd className="px-1 py-0.5 bg-slate-100 rounded border text-slate-700 font-semibold">?</kbd> anywhere to open</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition-colors"
                >
                  Got it
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
