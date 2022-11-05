import React from 'react';

type TTransformNode = string | number | boolean | null | undefined;
export type TTransformFunction<P> = (node: TTransformNode, props: P) => React.ReactNode | null;

function traverse<P> (transform: TTransformFunction<P>, children: React.ReactNode, props: P): React.ReactElement {
  return (
    <>
      {
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const { children } = child.props;
            return React.cloneElement(child, {}, traverse<P>(transform, children, props));
          }
          return transform(child as TTransformNode, props);
        })
      }
    </>
  );
}

export const withTraverse = <P extends React.PropsWithChildren<{}>> (transform: TTransformFunction<P>) => {
  return (props: P) => {
    const { children } = props;
    return traverse<P>(transform, children, props);
  };
};

