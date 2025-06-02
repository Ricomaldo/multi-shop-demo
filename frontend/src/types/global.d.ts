/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: Record<string, unknown>;
    }
  }
}

export { };

