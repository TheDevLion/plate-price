import type { ReactNode } from "react";

type FieldBlockProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export const FieldBlock = ({ label, children, className }: FieldBlockProps) => {
  return (
    <div className={className}>
      <div className="text-[10px] uppercase tracking-wide text-grape-700">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
};
