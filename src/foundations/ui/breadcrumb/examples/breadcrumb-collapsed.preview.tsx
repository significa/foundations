import { Breadcrumb } from "@/foundations/ui/breadcrumb/breadcrumb";
import { Menu } from "@/foundations/ui/menu/menu";

export default function BreadcrumbCollapsedPreview() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Menu>
            <Menu.Trigger asChild>
              <button
                type="button"
                aria-label="More breadcrumbs"
                className="cursor-pointer hover:text-foreground"
              >
                <Breadcrumb.Ellipsis />
              </button>
            </Menu.Trigger>
            <Menu.Items>
              <Menu.Item>Components</Menu.Item>
              <Menu.Item>Navigation</Menu.Item>
              <Menu.Item>Lists</Menu.Item>
            </Menu.Items>
          </Menu>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Breadcrumb</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Collapsed</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
