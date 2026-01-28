import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Enhanced FormFieldWrapper with complete ARIA labels
 * Ensures WCAG AA compliance for all form fields
 */

export interface FormFieldWrapperProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormFieldWrapper = React.forwardRef<
  HTMLDivElement,
  FormFieldWrapperProps
>(({ label, htmlFor, required, error, description, children, className }, ref) => {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const descriptionId = description ? `${htmlFor}-description` : undefined;

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id: htmlFor,
              "aria-invalid": error ? "true" : "false",
              "aria-describedby": cn(descriptionId, errorId)
                .trim()
                .split(" ")
                .filter(Boolean)
                .join(" ") || undefined,
              "aria-required": required ? "true" : "false",
            } as any);
          }
          return child;
        })}
      </div>

      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
          role="note"
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm font-medium text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
});

FormFieldWrapper.displayName = "FormFieldWrapper";
