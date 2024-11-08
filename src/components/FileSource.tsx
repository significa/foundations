import { INDEX, type RegistryEntry } from '../../__registry__/index';
import { Box } from '@/components/Box';

interface FileSourceProps {
  path: RegistryEntry;
  filename?: string;
}

export function FileSource({ path, filename }: FileSourceProps) {
  if (Object.hasOwn(INDEX, path) && INDEX[path]) {
    const Component = INDEX[path];

    return (
      <div className="relative nx-mt-6 first:nx-mt-0 [&>.nextra-code-block>pre]:max-h-[48rem]">
        {filename && (
          <div className="[&+*>pre]:pt-12 [&+*>div]:top-8 backdrop-blur-[6px] nx-absolute nx-top-0 nx-z-[1] nx-w-full nx-truncate nx-rounded-t-xl nx-bg-primary-700/5 nx-py-2 nx-px-4 nx-text-xs nx-text-gray-700 dark:nx-bg-primary-300/10 dark:nx-text-gray-200">
            {filename}
          </div>
        )}
        <Component />
      </div>
    );
  } else {
    return (
      <Box>
        <div className="opacity-60 text-sm">Unable to load file code</div>
      </Box>
    );
  }
}

// ———————————————————————————————————————————————————————————————————
// NOTE: Deprecated custom implementation

// import { cn } from '@/lib/tailwind';
// import { Box } from '@/components/Box';
// import { Highlight, themes } from 'prism-react-renderer';
// import { CopyToClipboard } from '@/components/CopyToClipboard';

// type CodeProps = React.HTMLAttributes<HTMLElement> & {
//   code: string;
//   lang: string;
// };

// function getShikiColor(token) {
//   const cssvar = (key) => `var(--shiki-${key})`;

//   switch (token.types[0]) {
//     case 'keyword':
//     case 'operator':
//       return cssvar`token-keyword`;
//     case 'string':
//       return cssvar`token-string-expression`;
//     case 'plain':
//       return cssvar`token-constant`;
//     case 'function':
//     case 'generic-function':
//       return cssvar`token-function`;
//     case 'comment':
//       return cssvar`token-comment`;
//     default:
//       return cssvar`color-text`;
//   }
// }

// export const SyntaxHighlighter = ({ code, lang, style: propStyle = {} }: CodeProps) => {
//   return (
//     <Highlight code={code} language={lang} theme={themes.vsLight}>
//       {({ className, style, tokens, getLineProps, getTokenProps }) => (
//         <pre
//           className={className}
//           style={{
//             ...style,
//             ...propStyle
//           }}
//         >
//           {tokens.map((line, i) => (
//             <div {...getLineProps({ line })} key={i}>
//               {line.map((token, key) => {
//                 return (
//                   <span
//                     key={key}
//                     {...getTokenProps({ token })}
//                     style={{ color: getShikiColor(token) }}
//                   />
//                 );
//               })}
//             </div>
//           ))}
//         </pre>
//       )}
//     </Highlight>
//   );
// };
// export const Code = ({ code, lang, className }: CodeProps) => {
//   return (
//     <Box className={cn('group p-0 h-auto', className)}>
//       <div className="w-full max-h-[clamp(384px,66vh,900px)] overflow-scroll [&>*]:w-full">
//         <SyntaxHighlighter
//           code={code}
//           lang={lang}
//           style={{
//             backgroundColor: 'transparent',
//             padding: '1rem',
//             fontSize: '0.85rem',
//             WebkitFontSmoothing: 'auto'
//           }}
//         />
//       </div>
//       <CopyToClipboard
//         value={code}
//         className="absolute right-3 top-3 opacity-0 group-hover:opacity-100"
//       />
//     </Box>
//   );
// };

// import { useState, useEffect } from 'react';
// import { Code } from '@/components/Code';
// import { Box } from '@/components/Box';
// import { Spinner } from '@/foundations/components/Spinner';
// import { pseudoDynamicImport } from '@/lib/pseudoDynamicImport';

// type FileSourceProps = {
//   path: string;
// };

// const useFileSource = (path: string) => {
//   const [source, setSource] = useState(null);
//   const [extension, setExtension] = useState(null);
//   const [status, setStatus] = useState(null);

//   useEffect(() => {
//     setStatus('loading');

//     try {
//       pseudoDynamicImport(path, true)
//         .then((m) => {
//           setStatus('complete');
//           setSource(m.default);
//           setExtension(m.extension);
//         })
//         .catch(() => setStatus('error'));
//     } catch (e) {
//       console.error(e);

//       setStatus('error');
//     }
//   }, [path]);

//   return { source, extension, status };
// };

// const EXTENSION_ALIASES = {
//   cjs: 'js',
//   mjs: 'js'
// };

// export const FileSource = ({ path }: FileSourceProps) => {
//   const { source, extension, status } = useFileSource(path);

//   if (source && extension) {
//     return <Code code={source} lang={EXTENSION_ALIASES[extension] ?? extension} />;
//   }

//   return (
//     <Box>
//       {!status && <Spinner />}
//       {status === 'error' && <div className="opacity-70">Could not load file source</div>}
//     </Box>
//   );
// };
