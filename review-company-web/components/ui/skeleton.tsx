import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-gray-200/80",
        shimmer && [
          "before:absolute before:inset-0",
          "before:translate-x-[-100%]",
          "before:animate-[shimmer_2s_infinite]",
          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-white/60",
          "before:to-transparent",
        ],
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
