export interface TypeWriterOptions {
  typingSpeed: 2 | 4 | 6 | 8 | 10;
  deletingSpeed: number;
  deleteDelay: number;
  loop: boolean;
}

export interface TypeWriterProps {
  element: HTMLElement;
  options: TypeWriterOptions;
}
