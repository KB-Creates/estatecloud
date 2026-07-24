import React from "react";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

export const PaymentInput = React.forwardRef(({ className, id, value, onChange, min, placeholder, required, ...props }, ref) => {
  const { getCurrencySymbol } = useSettings();
  const currency = getCurrencySymbol();

  return (
    <div className="relative flex items-center">
      <div className="absolute left-0 flex items-center justify-center pl-3 pr-2 h-full border-r border-input/50 text-muted-foreground font-medium text-sm pointer-events-none bg-muted/20 rounded-l-md">
        {currency}
      </div>
      <Input
        id={id}
        ref={ref}
        type="number"
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={cn("pl-[3rem]", className)} // adjusted padding for the prefix width
        {...props}
      />
    </div>
  );
});

PaymentInput.displayName = "PaymentInput";
