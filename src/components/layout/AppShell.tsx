import React, { useState, useEffect, Fragment } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Dialog, Transition, Menu } from '@headlessui/react';
import {
  LayoutDashboard,
  FolderKanban,
  Menu as MenuIcon,
  X,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Search,
  Keyboard,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Footer } from './Footer';
import { CommandPalette } from '../ui/CommandPalette';
import { KeyboardShortcutsModal } from '../ui/KeyboardShortcutsModal';

export const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // ? or Shift+/ (when not typing in an input)
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if (!isInput && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      to: '/',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: 'Projects',
      to: '/projects',
      icon: <FolderKanban className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col glass-mesh-bg text-slate-900">
      {/* Skip to Main Content accessible anchor */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Top Header with Frosted Glass */}
      <header className="sticky top-0 z-30 h-16 border-b border-white/60 bg-white/70 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Open navigation menu"
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Logo & Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-tight">
                Axionix
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600">
                Task Tracker
              </span>
            </div>
          </NavLink>
        </div>

        {/* Search, Shortcuts & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Command Palette Button */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/60 shadow-xs transition-all text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open command palette (Command + K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Search or jump to...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-600 shadow-2xs ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <Menu as="div" className="relative">

            <Menu.Button
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              aria-label="User profile options"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/60 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs shadow-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || 'Demo User'}
                </span>
                <span className="text-[11px] text-slate-500">{user?.role || 'Team Member'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl glass-panel-opaque p-1.5 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50">
                <div className="px-3 py-2 border-b border-slate-100/80 mb-1">
                  <p className="text-xs font-medium text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-rose-600 transition-colors ${
                        active ? 'bg-rose-50 text-rose-700' : ''
                      }`}
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>Sign out</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Main Navigation"
          className="hidden md:flex flex-col w-64 p-4 border-r border-white/60 bg-white/30 backdrop-blur-md shrink-0"
        >
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        <Transition show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            id="mobile-navigation-drawer"
            className="relative z-50 md:hidden"
            onClose={() => setMobileMenuOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 shadow-xl">
                  <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                        A
                      </div>
                      <span className="font-bold text-slate-900">Axionix Menu</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Close navigation menu"
                    >
                      <X className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>

                  <nav className="mt-4 flex-1 px-3 space-y-1">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`
                        }
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </nav>

                  <div className="border-t border-slate-100 p-4">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 focus:outline-none overflow-x-hidden"
        >
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Global Keyboard Shortcuts Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

