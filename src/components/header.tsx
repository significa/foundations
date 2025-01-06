import { Button } from "@/foundations/ui/button";

import { Egg } from "./icons/egg";
import { Octocat } from "./icons/octocat";
import { ThemeSwitcher } from "./theme-switcher";

export const Header = () => {
  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Egg />
          <div className="font-medium">Foundations</div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" square asChild>
            <a
              href="https://github.com/significa/foundations"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Octocat />
            </a>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};
