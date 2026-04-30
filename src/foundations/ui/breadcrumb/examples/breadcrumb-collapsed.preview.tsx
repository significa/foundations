import { Breadcrumb } from '@/foundations/ui/breadcrumb/breadcrumb';
import { Dropdown } from '@/foundations/ui/dropdown/dropdown';

export default function BreadcrumbCollapsedPreview() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Dropdown>
            <Dropdown.Trigger asChild>
              <button
                type="button"
                aria-label="More breadcrumbs"
                className="cursor-pointer hover:text-foreground"
              >
                <Breadcrumb.Ellipsis />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Items>
              <Dropdown.Item>Components</Dropdown.Item>
              <Dropdown.Item>Navigation</Dropdown.Item>
              <Dropdown.Item>Lists</Dropdown.Item>
            </Dropdown.Items>
          </Dropdown>
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
