import { readFile } from 'node:fs/promises';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type z from 'zod';
import { SITE_ORIGIN } from '@/lib/constants';

const markdown = (...lines: string[]) => {
  return lines.join('\n');
};

const link = (text: string, href: string) => {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  const transformedHref = isInternal
    ? `${new URL(SITE_ORIGIN).origin}${href}`
    : href;

  return `[${text}](${transformedHref})`;
};

const code = async (filePath: string) => {
  const raw = await readFile(filePath, 'utf-8');
  const extension = filePath.split('.').pop() || '';

  return `\`\`\`${extension}\n${raw}\`\`\``;
};

type ComponentDefinition<T extends z.ZodType> = {
  name: string;
  props: T;
  parser: (props: z.infer<T>) => string | Promise<string>;
};

const defineComponent = <T extends z.ZodType>(definition: {
  name: string;
  props: T;
  parser: (props: z.infer<T>) => Promise<string> | string;
}): ComponentDefinition<T> => {
  return definition as ComponentDefinition<T>;
};

const createComponentResolver = (
  components: ComponentDefinition<z.ZodType>[]
) => {
  return async (mdxContent: string) => {
    const tree = unified().use(remarkParse).use(remarkMdx).parse(mdxContent);

    let transformedMdx = mdxContent;

    for (const node of tree.children) {
      if (node.type !== 'mdxJsxFlowElement') continue;
      if (!node.name || !/^[A-Z]/.test(node.name)) continue;

      const componentDef = components.find((c) => c.name === node.name);

      if (componentDef) {
        const rawProps = Object.fromEntries(
          node.attributes.map((attr) => {
            if (attr.type === 'mdxJsxAttribute') {
              return [
                attr.name,
                !attr.value
                  ? true
                  : typeof attr.value === 'object'
                    ? new Function(`return ${attr.value.value}`)()
                    : attr.value,
              ];
            }

            return [];
          })
        );

        const props = componentDef.props.safeParse(rawProps);

        if (!props.success) {
          throw new Error(
            `Invalid props for component ${componentDef.name}: ${props.error}.\nReceived: ${JSON.stringify(rawProps)}`
          );
        }

        if (!node.position) {
          throw new Error(
            `Node position is missing for component ${componentDef.name}`
          );
        }

        const rawComponent = mdxContent.slice(
          node.position.start.offset,
          node.position.end.offset
        );

        const parsedComponent = await componentDef.parser(props.data);

        transformedMdx = transformedMdx.replace(rawComponent, parsedComponent);
      }
    }

    return transformedMdx;
  };
};

export { code, createComponentResolver, defineComponent, link, markdown };
