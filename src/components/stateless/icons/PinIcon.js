import './pins.scss';

export const PinIcon = ({children}) => {
    return (<div className="pin">
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 44 44" xmlSpace="preserve">
        <g transform="translate(5 5)"
            className="icon-train">
            <defs>
                <linearGradient id="svgGradient" gradientUnits="userSpaceOnUse" x1="15" y1="29.4209" x2="15" y2="1.1791">
                    <stop  offset="0" style={{stopColor: '#FFFFFF'}}/>
                    <stop  offset="1" style={{stopColor: '#e2e2e2'}}/>
                </linearGradient>
            </defs>
            <polygon className="pin" fill="url('#svgGradient')" points="2.2,0 2.2,25.4 11,25.4 15,29.6 19,25.4 27.8,25.4 27.8,0"/>
        </g>
    </svg>
    <div className="pinicon">
        { children }
    </div>
    </div>)
}