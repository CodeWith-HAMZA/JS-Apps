import TypeWriter from "./Typewriter";
import "./style.css";
import { TypeWriterOptions } from "./types";
const element = document.getElementById("root")!;
const options: TypeWriterOptions = {
  loop: true,
  deleteDelay: 1000,
  deletingSpeed: 1244,
  typingSpeed: 10,
};

const t = new TypeWriter(element, options);

t.typeText("Muhammad hamza Shaikh is the greatest programmer");
t.deleteChars(2, 100);
t.typeText("Muhammad hamza Shaikh is the greatest programmer");
t.deleteChars(2, 300).pauseFor(1000);
t.deleteAllChars(100);

t.startTyping();
