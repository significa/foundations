import { useRef } from 'react';
import { TableOfContents } from '@/foundations/components/TableOfContents';

export function TableOfContentsCustomSelectors() {
  const scope = useRef(null);

  return (
    <div className="absolute inset-0 overflow-scroll p-10 grid grid-cols-2">
      <TableOfContents
        headingSelectors={{ h2: '.role-h2', h3: '.role-h3' }}
        scope={scope}
        className="sticky top-0 h-fit"
      />
      <div ref={scope}>
        <p className="role-h2 text-lg font-semibold mt-10">Overview</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed est vel eros
          malesuada mollis in a tortor.
        </p>
        <p className="role-h3 text-sm font-semibold mt-4">Key Insights</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies lorem ut odio
          malesuada, ut ultricies orci congue. Cras sed lorem sit amet nulla feugiat pretium. Nam in
          urna turpis. Sed nec lorem urna. In vitae facilisis magna. Aenean vulputate lacinia nisi,
          in mollis lorem interdum ut. Etiam a enim et sapien interdum consequat vel id lorem.
        </p>
        <p className="role-h3 text-sm font-semibold mt-4">Challenges</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius sapien ut magna
          dictum, vitae congue purus fermentum. Curabitur non lacinia risus. In viverra velit vel
          cursus scelerisque. Duis eu nisl et mauris eleifend efficitur. Nullam fermentum turpis nec
          turpis placerat, id cursus dolor ullamcorper. Nulla sed viverra elit, vitae interdum
          felis. Donec scelerisque nisl nec est tempor, id ultricies odio efficitur.
        </p>
        <p className="role-h2 text-lg font-semibold mt-10">Discussion</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at augue nec sapien
          pharetra tempor vel at mauris. Etiam eget gravida libero. Sed id erat purus. Nullam in
          justo sit amet dolor facilisis consectetur a at arcu.
        </p>
        <p className="role-h2 text-lg font-semibold mt-10">Conclusions</p>
        <p className="mb-24">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Phasellus ut
          aliquet nunc. Integer nec nisl eros. Ut vehicula risus at nibh maximus, id pharetra elit
          viverra. Maecenas tincidunt libero magna, eget pretium est facil
        </p>
      </div>
    </div>
  );
}
