import { Button } from "@/foundations/ui/button/button";

import { Egg } from "@/components/icons/egg";
import { Octocat } from "@/components/icons/octocat";
import { ThemeSwitcher } from "@/components/theme-switcher";

import { GITHUB_REPO_URL } from "@/lib/constants";

export const Header = () => {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between gap-2 md:px-4 px-2 h-14 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-1.5">
          <Egg />
          <div className="font-medium">Foundations</div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" square asChild>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              <Octocat />
            </a>
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};
