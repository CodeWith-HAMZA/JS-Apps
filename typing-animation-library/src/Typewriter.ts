import { TypeWriterOptions } from "./types";

type CallbackQueueItem<T> = () => Promise<void>;

export default class TypeWriter<T extends string> {
  private text: T;
  private callbackQueue: CallbackQueueItem<() => Promise<void>>[] = [];
  private element: HTMLElement;
  private loop: boolean;
  private typingSpeed: number;
  private deletingSpeed: number;
  static #volume: number = 40;

  constructor(element: HTMLElement, options: TypeWriterOptions) {
    this.element = element;
    this.element.style.whiteSpace = "pre-wrap;";
    this.loop = options.loop;
    this.typingSpeed = options.typingSpeed * TypeWriter.#volume;
    this.deletingSpeed = options.deletingSpeed;
  }

  // Method to type a given text with optional typing speed
  typeText(text: string, typingSpeed: number = this.typingSpeed) {
    const intervalDelay = 12 * TypeWriter.#volume - typingSpeed;

    // Add the typing action to the callback queue
    this.addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) this.element.textContent += text[i];
        else {
          clearInterval(interval);
          resolve();
        }
        i++;
      }, intervalDelay);
    });

    return this;
  }

  // Method to delete a specified number of characters with optional deleting speed
  deleteChars(
    numberOfChars: number,
    deletingSpeed: number = this.deletingSpeed || 140
  ) {
    // Add the deletion action to the callback queue
    this.addToQueue((resolve) => {
      const text = this.element.textContent?.toString();
      let i = 0;
      const interval = setInterval(() => {
        this.element.textContent = <string | null>(
          text?.slice(0, <number>text?.length - i)
        );
        if (i >= numberOfChars) {
          clearInterval(interval);
          resolve();
        }
        i++;
      }, deletingSpeed);
    });

    return this;
  }

  // Method to delete all characters with optional deleting speed
  deleteAllChars(deletingSpeed: number = this.deletingSpeed) {
    // Add the action to delete all characters to the callback queue
    this.addToQueue((resolve) => {
      const text = this.element.textContent?.toString();
      let i = 0;
      const interval = setInterval(() => {
        this.element.textContent = <string | null>(
          text?.slice(0, <number>text?.length - i)
        );
        if (i >= <number>text?.length) {
          clearInterval(interval);
          resolve();
        }
        i++;
      }, deletingSpeed);
    });

    return this;
  }

  // Method to pause for a specified time in milliseconds
  pauseFor(timeInMilli: number) {
    // Add a pause action to the callback queue
    this.addToQueue((resolve) => {
      setTimeout(resolve, timeInMilli);
    });
  }

  // Private method to add a callback to the queue
  private addToQueue(
    callback: (resolve: () => void, reject: () => void) => void
  ) {
    // Wrap the callback in a Promise and add to the callback queue
    this.callbackQueue.push(() => {
      return new Promise(callback);
    });
  }

  // Method to start typing by processing the callback queue
  async startTyping() {
    let currentCallback = this.callbackQueue.shift();
    while (currentCallback != null) {
      // Await the completion of the current callback
      await currentCallback();

      // If looping is enabled, add the current callback back to the end of the queue
      if (this.loop) {
        this.callbackQueue.push(currentCallback);
      }

      // Retrieve the next callback from the queue
      currentCallback = this.callbackQueue.shift();
    }

    // Return the TypeWriter instance for method chaining
    return this;
  }
}
