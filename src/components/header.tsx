import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <div className="flex items-center justify-between py-2 mx-3">
      <div className="flex items-center gap-5">
        <h1>Chat Support</h1>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}
