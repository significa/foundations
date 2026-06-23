import { SidebarLayout } from '@/foundations/blocks/sidebar-layout/sidebar-layout';

export const meta = {
  layout: 'fullscreen',
  mode: 'iframe',
  size: 'block',
} as const;

export default function SidebarLayoutPreview() {
  return <SidebarLayout />;
}
