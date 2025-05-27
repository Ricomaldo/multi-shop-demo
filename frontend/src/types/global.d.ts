/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
  interface ReactNode {}
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
