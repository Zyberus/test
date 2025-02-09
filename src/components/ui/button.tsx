import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none",
          "bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2",
          "disabled:bg-blue-800/50 disabled:text-white/50",
          "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
          "dark:disabled:bg-blue-800/50 dark:disabled:text-white/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button } 