/**
 * WhatsApp Web Clone - Meta AI Icon
 * The gradient ring icon used for Meta AI features.
 * Extracted as a separate component to keep JSX clean where it's used.
 */
const MetaAIIcon = ({ size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="url(#paint0_linear)"
            strokeWidth="4"
        />
        <defs>
            <linearGradient
                id="paint0_linear"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#3652AD" />
                <stop offset="0.5" stopColor="#31E1F7" />
                <stop offset="1" stopColor="#00FFAB" />
            </linearGradient>
        </defs>
    </svg>
);

export default MetaAIIcon;