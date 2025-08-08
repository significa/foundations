import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/foundations/ui/avatar/avatar";

export default function AvatarPreview() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/pdrbrnd.png" />
      <AvatarFallback>Pedro Brandão</AvatarFallback>
    </Avatar>
  );
}
