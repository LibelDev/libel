export enum Viewport {
  Small,
  Medium,
  Large
}

enum Breakpoint {
  Medium = 768,
  Large = 1024
};

export const isViewport = (viewport: Viewport) => {
  const { innerWidth: width } = window;
  switch (viewport) {
    case Viewport.Large: {
      return width >= Breakpoint.Large;
    }
    case Viewport.Medium: {
      return width >= Breakpoint.Medium;
    }
    default: {
      return true;
    }
  }
};
