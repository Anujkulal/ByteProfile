import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer active:scale-95 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
  default:
    "bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-md hover:from-blue-800 hover:to-blue-800 transition-colors duration-400",
    
  destructive:
    "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md hover:from-red-700 hover:to-red-700 focus-visible:ring-red-300 dark:focus-visible:ring-red-600 transition-colors duration-400",

  outline:
    "border border-gray-300 bg-gradient-to-r from-white to-gray-100 text-gray-800 shadow-sm hover:from-gray-100 hover:to-gray-200 dark:from-gray-700 dark:to-gray-800 dark:text-white dark:border-gray-600",

  secondary:
    "bg-gradient-to-r from-slate-500 to-slate-800 text-white shadow-md hover:from-slate-800 hover:to-slate-800 transition-colors duration-400",

  ghost:
    "bg-transparent text-primary hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800",

  link:
    "text-blue-600 underline-offset-4 hover:underline hover:text-blue-800",

  generate:
    "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white shadow-md hover:from-green-500 hover:to-purple-700 transition-all duration-400 ease-in-out",
},
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
