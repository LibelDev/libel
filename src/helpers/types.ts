export type MappedHTMLAttributes<K extends keyof JSX.IntrinsicElements> = (
  JSX.IntrinsicElements[K] extends React.DetailedHTMLProps<infer A, any> ? (
    A
  ) : never
);
