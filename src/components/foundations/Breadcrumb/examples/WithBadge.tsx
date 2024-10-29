import { PlusCircle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '../Breadcrumb';

export function WithBadge() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/journeys">Journeys</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/journeys/new">New journey</BreadcrumbLink>
          <PlusCircle size={14} />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
