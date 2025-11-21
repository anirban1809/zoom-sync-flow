interface LogoProps {
    showText?: boolean;
    size?: "sm" | "md" | "lg";
}

export function Logo({ showText = true, size = "md" }: LogoProps) {
    const dimensions = {
        sm: { width: 32, height: 32 },
        md: { width: 40, height: 40 },
        lg: { width: 64, height: 64 },
    };

    const { width, height } = dimensions[size];

    return (
        <div className="flex items-center gap-2">
            <svg
                width={width}
                height={height}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Rounded square container */}
                <rect
                    x="8"
                    y="8"
                    width="48"
                    height="48"
                    rx="14"
                    stroke="hsl(158 48% 53%)"
                    strokeWidth="4"
                    fill="none"
                />

                {/* Wave 1 (top) */}
                <path
                    d="
                        M16 24
                        C20 20, 28 20, 32 24
                        C36 28, 44 28, 48 24
                    "
                    fill="none"
                    stroke="hsl(158 48% 53%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Wave 2 (middle) */}
                <path
                    d="
                        M16 32
                        C20 28, 28 28, 32 32
                        C36 36, 44 36, 48 32
                    "
                    fill="none"
                    stroke="hsl(158 48% 53%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Wave 3 (bottom) */}
                <path
                    d="
                        M16 40
                        C20 36, 28 36, 32 40
                        C36 44, 44 44, 48 40
                    "
                    fill="none"
                    stroke="hsl(158 48% 53%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {showText && (
                <span className="font-semibold text-foreground text-xl">
                    luminote.ai
                </span>
            )}
        </div>
    );
}
