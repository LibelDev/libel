declare type TComponentPropsWithoutRef<T extends React.ElementType, P> = (
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>
);

declare type TComponentPropsWithoutRefWithAs<T extends React.ElementType, P> = (
  TComponentPropsWithoutRef<T, P> & {
    as?: T;
  }
);
