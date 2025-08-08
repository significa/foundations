import { Avatar, AvatarFallback } from "@/foundations/ui/avatar/avatar";

export default function AvatarOnTopOfMediaPreview() {
  return (
    <div
      className="relative size-32 overflow-hidden rounded-lg bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80)",
      }}
    >
      <div className="flex h-full items-center justify-center">
        <Avatar>
          <AvatarFallback>Pedro Brandão</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
