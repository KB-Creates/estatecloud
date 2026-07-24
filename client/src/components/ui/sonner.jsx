import React, { useState, useEffect } from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';

// Import official sonner native stacking layout style sheets
import 'sonner/dist/styles.css';

// Export official programmatic emitter directly for standard compatible calls
export const toast = sonnerToast;

export const Toaster = ({ position = 'bottom-right', ...props }) => {
  const [activePos, setActivePos] = useState(position);

  // Dynamic window listener to seamlessly coordinate positional shifts from the playground on the fly
  useEffect(() => {
    const handlePositionChange = (e) => {
      if (e.detail) {
        setActivePos(e.detail);
      }
    };
    window.addEventListener('sonner-position-change', handlePositionChange);
    return () => {
      window.removeEventListener('sonner-position-change', handlePositionChange);
    };
  }, []);

  return (
    <SonnerToaster
      theme="dark"
      position={activePos}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast !bg-popover !border !border-border !text-foreground !px-4 !py-3 !rounded-xl !shadow-lg !flex !gap-2.5 !items-center !select-none !w-fit !mx-auto !font-sans',
          title: '!text-xs !font-medium !text-foreground !m-0',
          description: '!text-[10px] !text-muted-foreground !leading-normal !mt-0.5',
          actionButton: '!px-2 !py-0.5 !bg-accent hover:!bg-accent/80 !border !border-border !text-[10px] !font-bold !text-accent-foreground !rounded-md !transition-colors !shrink-0',
          cancelButton: '!px-2 !py-0.5 !bg-muted !border !border-border !text-[10px] !text-muted-foreground !rounded-md',
        },
      }}
      icons={{
        success: <CheckCircle2 size={19} className="text-emerald-500 shrink-0" />,
        error: <AlertCircle size={19} className="text-destructive shrink-0" />,
        warning: <AlertTriangle size={19} className="text-amber-500 shrink-0" />,
        info: <Info size={19} className="text-primary shrink-0" />,
        loading: <Loader2 size={19} className="text-primary animate-spin shrink-0" />
      }}
      expand={false}
      {...props}
    />
  );
};
