import { PlusCircle } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '../Breadcrumb';

export function WithBadge() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/journeys">Journeys</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/journeys/new">New journey</BreadcrumbLink>
        <PlusCircle size={14} />
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
