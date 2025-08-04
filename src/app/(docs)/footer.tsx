import { Egg } from "@/components/icons/egg";

export const Footer = () => {
  return (
    <footer className="border-border border-t">
      <div className="text-foreground-secondary mx-auto max-w-(--breakpoint-2xl) px-2 py-8 md:px-4">
        <Egg className="text-foreground" />
        <p className="mt-4 text-sm">
          Foundations is an opinionated collection of components, patterns and
          guidelines for building consistent and accessible user interfaces.
        </p>
        <p className="text-sm">
          It&apos;s free to use under the{" "}
          <a
            className="text-foreground"
            href="https://www.gnu.org/licenses/gpl-3.0.en.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            GPL-3.0 license
          </a>
          .
        </p>
        <p className="text-sm">
          Built by{" "}
          <a className="text-foreground" href="https://significa.co">
            Significa
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
