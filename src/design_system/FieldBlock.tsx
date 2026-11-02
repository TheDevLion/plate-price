import type { ReactNode } from "react";

type FieldBlockProps = {
  label: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
};

export const FieldBlock = ({ label, children, className, htmlFor }: FieldBlockProps) => {
  return (
    <div className={className}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-xs font-medium text-grape-700">{label}</label>
      ) : (
        <div className="text-xs font-medium text-grape-700">{label}</div>
      )}
      <div className="mt-1">{children}</div>
    </div>
  );
};
