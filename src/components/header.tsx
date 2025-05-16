import { ModeToggle } from './mode-toggle'

interface HeaderProps {
  title: string
}

export function Header({ title }: Readonly<HeaderProps>) {
  return (
    <div className="flex items-center justify-between py-2 mx-3">
      <div className="flex items-center gap-5">
        <h1>{title}</h1>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  )
}
