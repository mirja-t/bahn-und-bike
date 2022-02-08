import {useTransition, animated} from 'react-spring';

export const ActiveDestination = ({activeDestination, item, strokeScale}) => {

    const transitions = useTransition(activeDestination===item.lastStation.stop_id ? item : [], {
        from: { opacity: 0, scale: 0, x: item.lastStation.x - 1/strokeScale, y: item.lastStation.y - 1/strokeScale },
        enter: { opacity: 1, scale: 1/strokeScale, x: item.lastStation.x - 15/strokeScale, y: item.lastStation.y - 36/strokeScale },
        leave: { opacity: 0, scale: 0, x: item.lastStation.x - 1/strokeScale, y: item.lastStation.y - 1/strokeScale }
      })

      return transitions(
        (styles, item) => item && (<animated.g 
            style={styles}
            className="icon-train">
            <defs>
                <linearGradient id="svgGradient" gradientUnits="userSpaceOnUse" x1="15" y1="29.4209" x2="15" y2="1.1791">
                    <stop  offset="0" style={{stopColor: '#FFFFFF'}}/>
                    <stop  offset="1" style={{stopColor: '#e2e2e2'}}/>
                </linearGradient>
            </defs>
            <polygon className="trainpin" fill="url('#svgGradient')" points="2.2,0 2.2,25.4 11,25.4 15,29.6 19,25.4 27.8,25.4 27.8,0"/>
            <rect x="5.5" y="3.2" fill="#4a366a" width="18.8" height="18.8"/>
            <path fill="white" d="M19.7,7c-0.3-0.3-1.9-1.4-4.7-1.4S10.6,6.7,10.3,7S9.9,7.6,9.9,8v7.3c0,0.4,0.2,0.7,0.4,1s0.6,0.4,1,0.4h7.3
                c0.4,0,0.7-0.2,1-0.4s0.4-0.6,0.4-1V8C20.1,7.6,19.9,7.3,19.7,7z M12.2,15.1c-0.5,0-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9
                s0.9,0.4,0.9,0.9S12.7,15.1,12.2,15.1z M17.8,15.1c-0.5,0-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9s0.9,0.4,0.9,0.9S18.2,15.1,17.8,15.1z
                M19.1,11.1c0,0.2-0.2,0.4-0.4,0.4h-7.4c-0.2,0-0.4-0.2-0.4-0.4V8c0-0.1,0.1-0.3,0.2-0.3C11.6,7.4,13,6.6,15,6.6s3.4,0.8,3.9,1.1
                C19,7.7,19.1,7.9,19.1,8V11.1z"/>
            <polygon fill="white" points="11.5,19.2 12.5,19.2 13.5,17.3 12.5,17.3 	"/>
            <polygon fill="white" points="16.5,17.3 17.5,19.2 18.5,19.2 17.5,17.3 	"/>
        </animated.g>))
}