import { useRef } from 'react';
import { TableOfContents } from '@/foundations/components/TableOfContents';

export function TableOfContentsNesting() {
  const scope = useRef(null);

  return (
    <div className="absolute inset-0 overflow-scroll p-10 grid grid-cols-2">
      <TableOfContents scope={scope} className="sticky top-0 h-fit" />
      <div ref={scope}>
        <h2 className="text-lg font-semibold mt-10">Introduction</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel erat a felis pharetra
          vehicula nec eget eros. Mauris accumsan diam a malesuada consequat.
        </p>
        <h3 className="text-md font-semibold mt-6">Background</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Cras tempor quam
          sit amet feugiat sollicitudin. Proin gravida mauris justo, sed viverra libero dapibus a.
          Donec vel facilisis libero. Vivamus et nisi vel leo tincidunt gravida vel nec metus.
        </p>
        <h4 className="text-sm font-semibold mt-4">Detailed Background</h4>
        <p>
          Aliquam erat volutpat. Integer non turpis eu metus pulvinar aliquet. Sed malesuada, libero
          a elementum tempus, erat erat tristique neque, in luctus dolor magna sed nulla. Vivamus a
          arcu augue. Nunc vulputate elit at sapien congue aliquam.
        </p>
        <h4 className="text-sm font-semibold mt-4">Additional Data</h4>
        <p>
          Vestibulum in lorem viverra, fringilla nisi id, tincidunt erat. Donec auctor massa vel
          congue sollicitudin. Pellentesque in diam facilisis, tempor ipsum in, ullamcorper ex.
          Morbi ac metus et leo efficitur tincidunt.
        </p>
        <h3 className="text-md font-semibold mt-6">Analysis</h3>
        <p>
          Curabitur sit amet congue lectus. Nam luctus dui nec est posuere auctor. Phasellus
          convallis erat ac tortor finibus, eget malesuada libero vehicula. Integer accumsan felis
          nec arcu accumsan, sed laoreet mauris pharetra. Nulla facilisi. Praesent at vehicula
          libero. Etiam sollicitudin tellus quis gravida consequat.
        </p>
        <h4 className="text-sm font-semibold mt-4">In-depth Analysis</h4>
        <p>
          Maecenas vehicula sapien orci, sit amet pretium augue vulputate id. Nunc et congue orci,
          et cursus velit. Morbi tristique sapien ac nisi cursus, vel tempus metus pharetra. Vivamus
          maximus quam sit amet nulla suscipit, nec posuere libero auctor.
        </p>
        <h2 className="text-lg font-semibold mt-10">Conclusion</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Cras a nibh sed
          augue tristique posuere ut at lorem. Nam ornare gravida leo at feugiat.
        </p>
        <h2 className="text-lg font-semibold mt-10">Future Work</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis imperdiet, turpis vel
          tincidunt lobortis, leo risus finibus libero, at malesuada mi turpis sit amet risus.
          Quisque a sapien malesuada, convallis orci nec, interdum ligula.
        </p>
        <h3 className="text-md font-semibold mt-6">Further Research</h3>
        <p className="mb-24">
          Vestibulum in lorem viverra, fringilla nisi id, tincidunt erat. Donec auctor massa vel
          congue sollicitudin. Pellentesque in diam facilisis, tempor ipsum in, ullamcorper ex.
          Morbi ac metus et leo efficitur tincidunt.
        </p>
      </div>
    </div>
  );
}
