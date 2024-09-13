interface ComponentPreviewProps {
  children: React.ReactNode;
}

export function ComponentPreview({ children }: ComponentPreviewProps) {
  return (
    <div className="w-full h-[24rem] mt-6 rounded-[1.5rem] flex justify-center items-center nx-bg-primary-700/5 dark:nx-bg-primary-300/10">
      {children}
    </div>
  );
}
