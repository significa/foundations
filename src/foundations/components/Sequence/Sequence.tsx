import {
  useLayoutEffect,
  useId,
  useRef,
  useState,
  useContext,
  createContext,
  type HTMLAttributes
} from 'react';
import { useTicker } from '@/foundations/hooks/useTicker';
import { useIntersectionObserver } from '@/foundations/hooks/useIntersectionObserver';
import { clamp } from '@/foundations/utils/clamp';

const SequenceContext = createContext<{
  id: string;
  value: string;
  setValue: (value: string) => void;
  getValueState: (value: string) => { isActive: boolean; hasPlayed: boolean };
}>({
  id: null,
  value: null,
  setValue: () => {},
  getValueState: () => ({ isActive: false, hasPlayed: false })
});

function getComponentId(componentName: string, rootId: string, value: string) {
  return `${rootId}-${componentName}-${value.replace(/[^a-zA-Z ]/g, '')}`;
}

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type SequenceRootProps = HTMLAttributes<HTMLDivElement> & {
  values: string[];
  stepDuration: number;
};

function SequenceRoot({ stepDuration, values, className, children, ...rest }: SequenceRootProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>();
  const [value, setValue] = useState(values[0]);
  const valueRef = useRef(value);
  const progress = useRef(0);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  const duration = stepDuration * values.length;
  const ticker = useTicker((_, delta) => {
    const numValues = values.length;

    progress.current = clamp(0, progress.current + delta / duration, 1);

    const activeIndex = clamp(0, ~~(progress.current * numValues), numValues - 1);
    setValue(values[activeIndex]);

    // checks if the current state value has been rendered to the DOM, if not, we skip the --progress update
    // prevents --progress from jumping back to 0 before the triggers render the inactive attributes (which can cause layout flickers)
    const isValueRendered = valueRef.current === values[activeIndex];

    if (ref.current && isValueRendered) {
      const itemProgress = (progress.current - activeIndex / numValues) / (1 / numValues);
      ref.current.style.setProperty('--progress', clamp(0, itemProgress, 1).toString());
      ref.current.style.setProperty('--active-index', activeIndex.toString());
    }

    return progress.current < 1;
  });

  useIntersectionObserver(ref, {
    onIntersection: (isIntersecting) => {
      if (isIntersecting) {
        ticker.start();
      } else {
        ticker.stop();
      }
    }
  });

  function valueSetter(newValue: string) {
    setValue(newValue);

    const newIndex = values.indexOf(newValue);
    progress.current = newIndex / values.length;
    ticker.start();
  }

  function getValueState(itemValue: string) {
    const itemIndex = values.indexOf(itemValue);
    const activeIndex = values.indexOf(value);

    return {
      isActive: itemIndex === activeIndex,
      hasPlayed: itemIndex < activeIndex
    };
  }

  return (
    <SequenceContext.Provider value={{ id, value, setValue: valueSetter, getValueState }}>
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
    </SequenceContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type SequenceTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

function SequenceTrigger({ value, children, ...rest }: SequenceTriggerProps) {
  const context = useContext(SequenceContext);
  const { isActive, hasPlayed } = context.getValueState(value);

  return (
    <button
      {...rest}
      id={getComponentId('trigger', context.id, value)}
      role="tab"
      aria-selected={isActive}
      aria-controls={getComponentId('content', context.id, value)}
      data-state={isActive ? 'active' : 'inactive'}
      data-has-played={hasPlayed}
      onClick={() => context.setValue(value)}
      style={!isActive ? { '--progress': +hasPlayed } : {}}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type SequenceContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  hideOnInactive?: boolean;
};

function SequenceContent({
  value,
  hideOnInactive = true,
  children,
  style = {},
  ...rest
}: SequenceContentProps) {
  const context = useContext(SequenceContext);
  const { isActive, hasPlayed } = context.getValueState(value);

  return (
    <div
      {...rest}
      id={getComponentId('content', context.id, value)}
      role="tabpanel"
      aria-labelledby={getComponentId('trigger', context.id, value)}
      data-state={isActive ? 'active' : 'inactive'}
      tabIndex={0}
      data-has-played={hasPlayed}
      style={hideOnInactive ? { visibility: isActive ? 'visible' : 'hidden', ...style } : style}
      hidden={hideOnInactive && !isActive}
      // @ts-ignore
      inert={isActive ? undefined : ''}
    >
      {children}
    </div>
  );
}

export const Sequence = {
  Root: SequenceRoot,
  Trigger: SequenceTrigger,
  Content: SequenceContent
};
