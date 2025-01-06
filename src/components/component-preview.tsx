export const ComponentPreview = ({ slug }: { slug: string }) => {
  return (
    <iframe className="w-full h-full min-h-[400px]" src={`/preview/${slug}`} />
  );
};
