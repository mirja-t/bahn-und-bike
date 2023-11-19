import './pins.scss';

export const PinIcon = ({children, size}) => {
    return (<div className={size==='small' ? 'pin small' : 'pin'}>
        <div className="pinicon">
            { children }
        </div>
    </div>)
}