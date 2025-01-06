export const ComponentPreview = ({ slug }: { slug: string }) => {
  return (
    <iframe
      className="w-full h-[400px] rounded-xl border border-border"
      src={`/preview/${slug}`}
    />
  );
};
