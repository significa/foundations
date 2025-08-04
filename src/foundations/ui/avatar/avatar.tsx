"use client";

import { UserIcon } from "@phosphor-icons/react";
import { VariantProps } from "cva";

import { cn, cva } from "@/lib/utils";

const getInitials = (name: string | undefined) => {
  if (!name) return "";

  if (name.length === 1 || name.length === 2) return name;

  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const avatarStyle = cva({
  base: "bg-muted-foreground/10 shadow-[inset_0_0_0_1px_--alpha(var(--color-foreground)/8%)] backdrop-blur-sm flex items-center justify-center overflow-hidden text-foreground/80 font-semibold relative",
  variants: {
    variant: {
      circle: "rounded-full",
      square: "rounded-md",
    },
    size: {
      "2xs": "size-4 text-2xs",
      xs: "size-6 text-2xs",
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-12 text-base",
      xl: "size-14 text-lg",
      "2xl": "size-16 text-xl",
      "3xl": "size-20 text-3xl",
    },
  },
});

interface AvatarProps extends React.ComponentPropsWithRef<"div"> {
  size?: VariantProps<typeof avatarStyle>["size"];
  variant?: VariantProps<typeof avatarStyle>["variant"];
}

const Avatar = ({
  className,
  variant = "circle",
  size = "md",
  children,
  ...props
}: AvatarProps) => {
  return (
    <div className={cn(avatarStyle({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
};

interface AvatarImageProps extends React.ComponentPropsWithRef<"img"> {
  src: string;
}

const AvatarImage = ({ className, src, ...props }: AvatarImageProps) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("absolute inset-0 z-1 object-cover", className)}
      src={src}
      alt=""
      {...props}
    />
  );
};

interface AvatarFallbackProps extends React.ComponentPropsWithRef<"div"> {
  children?: string;
}

const AvatarFallback = ({
  className,
  children,
  ...props
}: AvatarFallbackProps) => {
  return (
    <div className={cn("opacity-80", className)} {...props}>
      {getInitials(children) || <UserIcon weight="bold" />}
    </div>
  );
};

export { Avatar, AvatarFallback, AvatarImage };
