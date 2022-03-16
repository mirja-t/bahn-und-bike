import { svg_scale } from '../../../../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const VelorouteStop = ({activeSpot, item, fn}) => {
    const strokeScale = 1;

    return (<g>
        { activeSpot===item.stop_id && (
                <text className="veloroute destinationLabel"
                    x={item.x * xFactor + xOffset + '5px'}
                    y={ - item.y * yFactor + yOffset}
                    style={{ fontSize: `${7 / strokeScale}px` }}>
                    <tspan>{item.stop_name}</tspan>
                </text>)}
        <circle
            className='veloroute-stop'
            cx={item.x * xFactor + xOffset}
            cy={ - item.y * yFactor + yOffset}
            r={2}
            onMouseEnter={e => fn(e, item.stop_id)}
            onMouseLeave={fn}
            style={{ 
                transformOrigin: `${item.x * xFactor + xOffset}px ${ - item.y * yFactor + yOffset}px`
            }}/>
    </g>)
}