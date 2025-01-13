import { Button } from "@/foundations/ui/button/button";

import { Egg } from "@/components/icons/egg";
import { Octocat } from "@/components/icons/octocat";
import { ThemeSwitcher } from "@/components/theme-switcher";

import { GITHUB_REPO_URL } from "@/lib/constants";

export const Header = () => {
  return (
    <div className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-2 md:px-4">
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
