import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const DropdownContext = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children }: { children: ReactNode }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;
  const toggle = () => ctx.setOpen(!ctx.open);

  // If asChild, expect child to be a button-like element and clone it with onClick
  const child = React.Children.only(children) as React.ReactElement;
  const props = { onClick: toggle } as any;
  return React.cloneElement(child, props);
}

export function DropdownMenuContent({ children, align = 'start', className = '' }: { children: ReactNode; align?: 'start' | 'end'; className?: string }) {
  const ctx = useContext(DropdownContext);
  if (!ctx) return null;
  if (!ctx.open) return null;
  const alignClass = align === 'end' ? 'right-0' : 'left-0';
  return (
    <div className={`absolute z-50 mt-2 ${alignClass} bg-card border rounded-md shadow-lg p-2 ${className}`}>{children}</div>
  );
}

export function DropdownMenuItem({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const ctx = useContext(DropdownContext);
  const handle = () => {
    if (onClick) onClick();
    if (ctx) ctx.setOpen(false);
  };
  return (
    <button onClick={handle} className={`w-full text-left px-3 py-2 rounded-sm hover:bg-muted/5 ${className}`}> {children} </button>
  );
}

export default DropdownMenu;
