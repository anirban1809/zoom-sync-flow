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
                <rect
                    x="4"
                    y="4"
                    width="56"
                    height="56"
                    rx="16"
                    stroke="hsl(158 48% 53%)"
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    d="M14 48 L26 30 L38 38 L50 20"
                    fill="none"
                    stroke="hsl(158 48% 53%)"
                    strokeWidth="4"
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
