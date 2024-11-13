import { Parallax } from '@/foundations/components/Parallax';

export function ParallaxImageWindow() {
  return (
    <div className="relative py-[100vh]">
      <div className="absolute top-0 left-0 w-full p-12 text-center text-sm opacity-60">
        Scroll ↓
      </div>
      <figure className="relative overflow-hidden bg-foreground rounded-sm">
        <Parallax speed={0.8}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ayuntamiento_de_Oporto%2C_Portugal%2C_2012-05-09%2C_DD_03.JPG/2560px-Ayuntamiento_de_Oporto%2C_Portugal%2C_2012-05-09%2C_DD_03.JPG"
            alt="Sample Image"
            className="w-[55vw] h-[70vh] object-cover object-top opacity-95"
            style={{ transform: 'scale(1.1)' }}
          />
        </Parallax>
        <figcaption className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-[13vh] text-background font-bold -tracking-[0.02em]">Porto</p>
        </figcaption>
      </figure>
      <div className="absolute bottom-0 left-0 w-full p-12 text-center text-sm opacity-60">
        Scroll ↑
      </div>
    </div>
  );
}
