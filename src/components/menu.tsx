import { differenceInDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/foundations/ui/badge/badge';
import { Disclosure } from '@/foundations/ui/disclosure/disclosure';
import { cn } from '@/lib/utils/classnames';
import type { NavigationItem } from '@/lib/utils/navigation';

type MenuProps = {
  currentPath?: string;
  items: NavigationItem[];
};

export const Menu = ({ items, currentPath: initialPath }: MenuProps) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath || '');

  useEffect(() => {
    const onPageLoad = () => {
      setCurrentPath(window.location.pathname);
    };

    document.addEventListener('astro:page-load', onPageLoad);

    return () => {
      document.removeEventListener('astro:page-load', onPageLoad);
    };
  }, []);

  return (
    <>
      {items.map((item) => (
        <Disclosure key={item.title} defaultOpen className="mb-4">
          <Disclosure.Trigger
            className={cn(
              'sticky top-0 flex w-full cursor-pointer items-center justify-between bg-background px-3 py-2 font-medium text-foreground-secondary text-sm capitalize',
              'before:absolute before:bottom-full before:left-0 before:h-4 before:w-full before:bg-background'
            )}
          >
            <h3>{item.title}</h3>
            <Disclosure.Chevron />
          </Disclosure.Trigger>
          <Disclosure.Content className="flex flex-col gap-0.5">
            {item.children.map((child) => (
              <MenuItem
                key={child.href}
                item={child}
                isActive={child.href === currentPath}
              />
            ))}
          </Disclosure.Content>
        </Disclosure>
      ))}
    </>
  );
};

type MenuItemProps = {
  item: NavigationItem['children'][number];
  isActive?: boolean;
};

const MenuItem = ({ item, isActive }: MenuItemProps) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tag, setTag] = useState<'new' | 'updated' | undefined>(undefined);

  useEffect(() => {
    const createdAt = ref.current?.dataset.createdAt;
    const updatedAt = ref.current?.dataset.updatedAt;

    const isNew =
      createdAt && differenceInDays(new Date(), new Date(createdAt)) < 30;
    if (isNew) return setTag('new');

    const isUpdated =
      updatedAt && differenceInDays(new Date(), new Date(updatedAt)) < 15;
    if (isUpdated) return setTag('updated');
  }, []);

  return (
    <a
      ref={ref}
      data-created-at={item.createdAt}
      data-updated-at={item.updatedAt}
      href={item.href}
      className={cn(
        'flex h-8 shrink-0 items-center gap-1 overflow-hidden rounded-lg px-3 text-sm leading-none hover:bg-background-secondary',
        isActive && 'bg-background-secondary'
      )}
    >
      <span className="truncate py-0.5">{item.title}</span>
      {tag && (
        <Badge size="xs" variant={tag === 'new' ? 'success' : 'info'}>
          {tag.toUpperCase()}
        </Badge>
      )}
    </a>
  );
};
