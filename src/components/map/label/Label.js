import './label.scss';
export const Label = ({
    item, 
    className, 
    strokeScale
}) => {

    return (
        <text 
            className={`${className} destinationLabel`}
            x={item.x + 5/strokeScale}
            y={item.y}
            style={{ fontSize: `${7 / strokeScale}px` }}>
            <tspan>{item.stop_name}</tspan>
        </text>)
}