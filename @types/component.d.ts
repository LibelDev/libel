declare type TComponentPropsWithoutRef<T extends React.ElementType, P = any> = (
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>
);

declare type TComponentPropsWithoutRefWithAs<T extends React.ElementType, P = any> = (
  TComponentPropsWithoutRef<T, P> & {
    as?: T;
  }
);
