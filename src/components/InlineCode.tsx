import React from 'react';

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-neutral-100 border-2 border-neutral-200 p-1 rounded-md text-sm text-neutral-500">
      {children}
    </code>
  );
}

export default InlineCode;
