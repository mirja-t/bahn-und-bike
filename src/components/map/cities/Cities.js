import './cities.scss';
import { useTransition, animated } from 'react-spring';


export const Cities = ({zoom, value}) => {
    
    const transition = useTransition(value > 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    });

    return transition((styles, item) => item && (
    <animated.div id="cities">
        <svg xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1920 1080" xmlSpace="preserve">
        <g id="stadtstaaten">
            <text transform="matrix(1 0 0 1 898.4815 240.849)" className="city-name stadtstaat" style={{ fontSize: `${16 / zoom.scale}px`}}>Hamburg</text>
            <text transform="matrix(1 0 0 1 775.4852 296.3399)" className="city-name stadtstaat" style={{ fontSize: `${16 / zoom.scale}px`}}>Bremen</text>
            <text transform="matrix(1 0 0 1 1252.1469 379.5518)" className="city-name stadtstaat" style={{ fontSize: `${16 / zoom.scale}px`}}>Berlin</text>
        </g>
        {/*
        <g id="staedte">
            <circle cx="1238" cy="385" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 1240.0715 389.0768)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Potsdam</text>
            <circle cx="1062" cy="215.3" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 1069.0852 219.3783)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Schwerin</text>
            <circle cx="939.5" cy="126.5" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 946.6217 130.5751)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Kiel</text>
            <circle cx="901.9" cy="381" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 908.9871 385.0264)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Hannover</text>
            <circle cx="1082.8" cy="422.9" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 1089.9015 426.9641)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Magdeburg</text>
            <circle cx="1303.7" cy="553" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 1310.8455 557.0646)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Dresden</text>
            <circle cx="1032.8" cy="563.4" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 1039.8971 567.4708)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Erfurt</text>
            <circle cx="742.4" cy="685" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 749.534 689.0306)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Wiesbaden</text>
            <circle cx="735.5" cy="693.5" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 742.6415 697.5751)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Mainz</text>
            <circle cx="584.6" cy="523.1" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 591.7006 527.1119)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Düsseldorf</text>
            <circle cx="841" cy="836.7" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 848.0843 840.7504)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Stuttgart</text>
            <circle cx="1090.1" cy="915.1" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 1097.2172 919.1589)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>München</text>
            <circle cx="608.5" cy="777.4" className="city-dot" r={4 / zoom.scale}/>
            <text transform="matrix(1 0 0 1 615.5975 781.4207)" className="city-name" style={{ fontSize: `${21 / zoom.scale}px`}}>Saarbrücken</text>
        </g>*/}
    </svg>
    </animated.div>))
}