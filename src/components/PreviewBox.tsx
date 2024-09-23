interface PreviewBoxProps {
  children: React.ReactNode;
}

export function PreviewBox({ children }: PreviewBoxProps) {
  return (
    <div className="relative w-full h-[24rem] p-10 mt-6 first:mt-0 nx-rounded-xl flex justify-center items-center nx-bg-primary-700/5 dark:nx-bg-primary-300/10">
      {children}
    </div>
  );
}
