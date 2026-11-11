import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  GearIcon,
  SignOutIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Button } from "#/foundations/ui/button/button.tsx";
import { Menu } from "#/foundations/ui/menu/menu.tsx";

const THEMES = ["Light", "Dark", "System"];
const LANGUAGES = ["English", "Português", "Español"];

export default function MenuViewsPreview() {
  const [view, setView] = useState<"root" | "theme" | "language">("root");
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English");

  return (
    <Menu onOpenChange={(open) => open && setView("root")}>
      <Menu.Trigger asChild>
        <Button variant="outline">Account</Button>
      </Menu.Trigger>
      <Menu.Items>
        {view === "root" && (
          <>
            <Menu.Item>
              <GearIcon />
              Settings
            </Menu.Item>
            <Menu.Item
              onSelect={(e) => {
                e.preventDefault();
                setView("theme");
              }}
            >
              Theme
              <span className="ml-auto text-foreground-secondary">{theme}</span>
              <CaretRightIcon className="text-foreground-secondary" />
            </Menu.Item>
            <Menu.Item
              onSelect={(e) => {
                e.preventDefault();
                setView("language");
              }}
            >
              Language
              <span className="ml-auto text-foreground-secondary">{language}</span>
              <CaretRightIcon className="text-foreground-secondary" />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item variant="destructive">
              <SignOutIcon />
              Sign out
            </Menu.Item>
          </>
        )}
        {view === "theme" && (
          <>
            <Menu.Item
              onSelect={(e) => {
                e.preventDefault();
                setView("root");
              }}
            >
              <CaretLeftIcon />
              Back
            </Menu.Item>
            <Menu.Heading>Theme</Menu.Heading>
            {THEMES.map((option) => (
              <Menu.Item key={option} onSelect={() => setTheme(option)}>
                {option}
                {option === theme && <CheckIcon className="ml-auto" />}
              </Menu.Item>
            ))}
          </>
        )}
        {view === "language" && (
          <>
            <Menu.Item
              onSelect={(e) => {
                e.preventDefault();
                setView("root");
              }}
            >
              <CaretLeftIcon />
              Back
            </Menu.Item>
            <Menu.Heading>Language</Menu.Heading>
            {LANGUAGES.map((option) => (
              <Menu.Item key={option} onSelect={() => setLanguage(option)}>
                {option}
                {option === language && <CheckIcon className="ml-auto" />}
              </Menu.Item>
            ))}
          </>
        )}
      </Menu.Items>
    </Menu>
  );
}
