"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, onError, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    // Reset error state when src changes
    React.useEffect(() => {
        setHasError(false)
    }, [src])

    if (!src || src === "") {
        return null
    }

    if (hasError) {
        return null
    }

    return (
        <img
            ref={ref}
            src={src}
            className={cn("aspect-square h-full w-full object-cover", className)}
            onError={(e) => {
                setHasError(true)
                if (onError) onError(e)
            }}
            {...props}
        />
    )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-xs uppercase",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
