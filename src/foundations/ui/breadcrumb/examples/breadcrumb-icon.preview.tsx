import { HouseIcon } from "@phosphor-icons/react/dist/ssr";

import { Breadcrumb } from "@/foundations/ui/breadcrumb/breadcrumb";

export default function BreadcrumbIconPreview() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#" aria-label="Home" className="inline-flex items-center">
            <HouseIcon className="size-4" />
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}
