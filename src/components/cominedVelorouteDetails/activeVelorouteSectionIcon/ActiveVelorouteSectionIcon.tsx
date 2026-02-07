import "./activeVelorouteSectionIcon.scss";

interface ActiveVelorouteSectionIconProps {
    num: number;
}

export const ActiveVelorouteSectionIcon = ({
    num,
}: ActiveVelorouteSectionIconProps) => {
    return (
        <div className="veloroutesection-icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 30 30"
                xmlSpace="preserve"
            >
                <g>
                    <path
                        className="veloroute-pin-outer"
                        fill="white"
                        d="M27.64,12.64C27.64,5.66,21.98,0,15,0S2.36,5.66,2.36,12.64c0,5.75,3.84,10.6,9.1,12.13L15,30l3.54-5.23
        C23.8,23.24,27.64,18.39,27.64,12.64z"
                    />
                    <circle
                        className="veloroute-pin-inner"
                        cx="15"
                        cy="12.64"
                        r="9.52"
                    />
                    <text className="veloroute-pin-text" x={12} y={17}>
                        {num}
                    </text>
                </g>
            </svg>
        </div>
    );
};
