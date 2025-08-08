import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/foundations/ui/avatar/avatar";

export default function AvatarBrokenImagePreview() {
  return (
    <Avatar>
      <AvatarImage src="broken-image-url" />
      <AvatarFallback>Pedro Brandão</AvatarFallback>
    </Avatar>
  );
}
