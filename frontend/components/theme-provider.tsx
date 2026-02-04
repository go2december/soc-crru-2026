"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Since next-themes types might be slightly different depending on version,
// we map the props loosely but safely.
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
