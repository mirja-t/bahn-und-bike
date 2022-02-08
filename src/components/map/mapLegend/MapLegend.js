import './maplegend.scss';
import { useTransition, animated } from 'react-spring';

export const MapLegend = ({zoom, value}) => {

    const transition = useTransition(value > 0, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    });

    return transition((styles, item) => item && (
    <animated.div 
        id="maplegend"
        style={styles}>
        <svg xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 1920 1080" xmlSpace="preserve">
            <g id="bl-borders">
            <path id="niedersachsen-border-nord" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M984.6,262.9c-3.3,0.1-6.6,0.3-9.5-0.8c-6.1-2.6-11.5-6.3-17.2-9.3
		c-0.8,0.8-2.3,0.9-3.2,1.6c-2.8,0-4.9,2.4-7.3,3.7c-6.7,2.5-11.3-4.1-16.7-6c-9.5,6-13.1,2-23.6,0.1c-9.2-5.8-4.5-17.7-16.8-19.7
		c-30.4-12.9-22.6-49.7-57.1-45.2"/>
	            <path id="niedersachsen-border-sued" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M994.3,491.1c-4.4-1-1.9-4.6-4.6-7.3c-6.5-6.7-11.7-16.2-2-21.9
		c1.5-2.3-1.8-4.9-1.7-7.1c0.1-1.7,1.1-3-0.9-4.8c-2.7-1.9-2.8-4.3,0.8-5c3.6-0.6,2.8-3.3,6.3-4.6c7.7-1.8,20.5,1,27.7-3.2
		c0.4-3.8-0.3-5,5.4-6.5c5.6-2.3,5.5-5.3,1.9-8.1c-0.5-1.1,1-3.8,2.9-7.2c1.7-2.2-4.7-3.8-3.9-6.1c3.9-4.7-5.4-6.6,1.9-9.7
		c7.7-3.1-16.9-10.8-6.3-18.9c2.1-2.1-2.2-4.3-2.3-6.8c-1.6-2.6,3.3-8.3-1.3-8.1c-8.5-0.8-7.5-12.8-14.4-16.3c-10.9-20,1-14,15.7-17
		c2.6-0.8,3.6-2.6,4.3-4.1c3.5-6.9,13-1.1,18.9-0.8c5.5,0.8,10.7,4.5,16.9,1c4.2-1,4.5-2.2,7.1-4.2c1.8-1.9,5.6-1.6,6.7-3.4
		c-0.1-9.8,2.9-6.4,9.7-11.2 M619.6,401.2c4.9,0.7,6.5-2.6,12-2.4c7.8,1.1,17.8-1.6,24.4-5.3c4.6-1.5,4.6-3.6,8.1-5.5
		c3.7-2.2,9.3-0.4,10.9-5.1c1.2-2.1-2.7-4.4-2.1-6.2c1.3-4,5.6-3.1,9.1-1.9c3,0.9,4.4,3,4.5,6c0.1,1.4,1.6,2,3.5,2.7
		c6.4,2.6,11.3,7.1,17.6,9.6c6,2,6,4.1,3.6,8.9c-0.5,2.9,0.5,4.8-1.4,7.8c-1.8,2.6,2.6,4.5,5,5.8c4.8,1.3,3,5.2,1.3,8.1
		c-2.5,1.8-11.3,0.7-6.9,6.3c4.7,7,9-1.1,15.1-1.3c12.9,3,13-3.5,23.2-5.9c18.1,3.8,6.9,2.3,20.5-5.7c-0.9-2.8-4.7-5.2-3.4-8.8
		c0.2-7.1,0.5-16.7-8.3-18.7c-12.6-4.6-4-12,5.8-8.7c3-0.2,1.9-3.7,3.2-5.3c2.3-2.2,6.9-2,10.6-1.7c3.8,0.2,4.2-2,8.5-2.1
		c8.1-0.1,6.9,10.6,7.8,15.3c1.2,1.7,2.5,1.2,5.2,1.5c4.1,0.1,3.5,1.4,6.7,1.8c3.9-1.5,9-2.5,12.9-3.8c2-3,2.3-7.8,6.8-9
		c4.1-1.8,12.8-1.2,10,5.3c-1.2,3.9,1.8,8.6-2.7,11.4c-5.4,7.7-5.8,1.9-9.6,6.2c-4.7,9,14.2,11,2.9,17.9c-0.9,0.4-1.8,0.8-1.8,2.7
		c-0.4,9,12.8-1.3,14.7,7.9c8.1,4.5,2,3.4,4.3,9.2c2.7,3.1-5.4,7.3,0.1,8.3c2.9-1.2,11.7-0.7,7.9,5.3c-0.4,0.9-0.6,1.3,0.6,1.8
		c5.8,0.4,7.2,2.6,7.5,8.2c3.5,0.3,8.9-2.2,11.1,1.2c3,6.2-0.8,11.3-5.8,15.3c-1,2,0.9,3.5-0.5,5.6c-2.6,2.9-2.3,5.6,0.9,7.7
		c-0.2,0.1-0.6,0.4-0.8,0.6c3-2.2,10.3-7.1,10.8,0c1.8-0.4,3.5-1.5,5.6-1.4c4.4,1.3,14.1,4.3,12.9,10.3c-3.9,1.7-6.7,1.6-6.8,7.5
		c9.4,22-3.2,8.3-3.1,15.9l-1.5,2.4c-1.6,0.5-0.6,1.8,0.5,2.3c6.9-1,14.3,10.8,19.5,3.4c0.3-0.8,0-1.1-0.6-1.2
		c-9.7-1.5-2.9-7.1,3.3-7.5c5.2-0.6,11.9-6.8,14.8,0.3 M819,301.1c-5.8,6.2-13.6,3.8-20.6,1.4c-3-0.6-5,0.9-7.7-1.4
		c-2.4-1.8-1.2-4.4-2.6-6.2c-1.8-1.5-5.1-4.1-6-7.1c-1-5.5-6.2-5-10.4-6.6c-3.3-1-3.9-6.2-0.1-6.3c7.4,2.1,15.2,5.6,23.3,6.5
		c1.8,0.4,3.1,3,5.3,2.8c3.4-0.6,6.2,1.8,9.3,2.4c5.2-1,10.2,0,8.4,6.4c0,0.6,0.5,0.9,1,1.2C818.9,295.4,820.8,300.3,819,301.1z"/>
                <path id="nordrhein-westfalen-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M549.8,645.5c1.4,0,1.8-3,3.1-3c6.7,2.9,9.8,1.2,16.5,0.6c2.8,0.6,2.3,2.1,5.6,2.4
                    c2,0.3,5.4-0.3,6.6,0.9c23.1,4.8-0.7-15.3,8.9-16c4.7,1.7,15.9,4.9,12.8-4.2c-1.6-3.3,3.8-4.3,6.3-4.7c4.8-0.8,7.7-4.4,13-3.9
                    c5.1,0.5,8.2-2.4,12.1-3.9c6.5,0.6,15.4,2.8,18.6-4.3c-0.2-7.5,6.1-5.7,11.6-6.1c4.3-0.3,3.7-2.1,7.8-2.4c2.8-0.1,3.4-0.6,4.1-1.2
                    c2.3-2.5,7.1-0.5,9.4-3.2c2.4-4-5.3-4.9,3.5-7.4c6.7-0.8,1-10.8,7.4-11c5.9,0.6,2.1,2.2,3.5,5.5c1.4,3.1,5.2,1.9,6.2,4.6
                    c-0.8,3,7.1,2.1,8.2,3.6c-1.7,9.7,2.4,6.1,6.1,12.7c1.3,4.9,2.3,0.7,5.4,3.5c0.3-0.1,1.8,0.2,3.4,0.4c1.6,0.2,3.1,0.5,3.4,0.4
                    c8.5-9-5.8-6.5,7.5-18.1c9.1-9.8,12.9,1.6,18.5-4.7c1.6-2.8,5.2-3.1,7.5-4.5c0.6-8,6.8-7.6,8.9-13.2c0.1-3-3.7-7.1,0.9-8.6
                    c4.1-0.7,17.2,3.4,14.9-4.5c-1.2-2.9,4.4-3.7,5.2-6.3c1.2-2-1.9-8.8-2.7-10.5c-4.4-6.1-11.3,5.5-15.8-1.9
                    c-1.2-2.7,13.1-13.2,15.5-12.3c7.5-0.8,14.8-0.8,21.4-1.8c3.7-2.7-2-5.7-1.8-8.6c-2.7-3.7,0.8-2.9,3.5-4.4c3.6-2.4,7-0.5,10.8,0.5
                    c4,1.8,3.4,6.6,8.2,6.6c3-0.2,4.3-2.2,7.1-2.7c2-0.7,2.6-4,4.5-4.7c4.5-1.9,11.1-6.3,10.6-11.9c-0.3-2,0.3-2.8,2-3.3
                    c0,0,2.5-1.7,2.5-1.7c0.2-0.2,0.6-0.4,0.8-0.6"/>
                <path id="rheinland-pfalz-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M741.7,818.2
                    c9.1-0.3,4.3-9.6,12-14.7c5.2-10.6-1.5-15.3,12.9-20.8c4.6-4.2-6-2.1,1.8-10.3c1.3-1.8,0.4-6.4,0-8.8c-0.8-0.8-3.8-0.4-3.9-2.1
                    c1.4-5.2-4-9.6-4.1-14.7"/>
                <path id="saarland-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M650.8,792.7c-0.3-0.3-2.5-2-2.9-2.3
                    c-8.8-6.7-0.9-5.4,1.2-10.6c0.1-4.1,7.6-6.6,4.4-11.1c-6-3.3-7.3-0.8-13-7.9c-4.5-3.8,4-3.8,5.6-5.6c1.3-2.3-3.5-6.4-3-9.3
                    c0-3.9-4.2-2.3-6.5-1.8c-42.7-18.1-25.2-3.5-60-0.5c-7.8,1.8-16.2,2.5-24.1,1.5c-1.5,0.3-6.1-1.4-7.3,0.2"/>
                <path id="thueringen-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M934.6,632.3c3.8-0.9,7-0.5,10.2-0.8c2.7,1.1,2.1,3.7,4.5,5.1c3.7,2.1,10.3,1.1,11.8,6.3
                    c1.1,6.2,4.4,6.9,9.7,7.2c4.1,5,4.8,4.9,10.9,5.7c5.9,6,2.9,8.5,4.4,14.3c3.1,1.1,9.2,1.1,12.7,2.6c1.8-1.1,2-1.9,2.2-2.6
                    c0.7-3.8,7.1,0.3,9-2.3c2.6-2.7-1.8-5.7-4-7.4c-2.8-1.8-9.1-0.9-6.8-5.7c1.5-0.9,4.4-0.1,5.8-1.9c0.6-0.7,1.8-1.1,3.2-1.4
                    c3.4-0.6,10,0.3,12.6,0.2c0.8,0.1,1,0.6,1.2,1.2c0.9,3.4,5.3,1.6,7.3,1.6c2.1,0,2.4,1.4,4.2,1.5c3.8-2,9.3-0.7,7,4.4
                    c-2.5,4.9,8.2,2.9,10.4,4.5c5.9-1.1,2.1-7.3,4.3-8c3.7-2.1-1.9-7.6-1.7-11.2c-2.6-6.9,1.4-5,5.5-7.7c2.4-3.1,9.2-3.8,10.9-0.4
                    c-1.6,3.9-2.3,7,3.1,8.1c2.2,0.8,2.3,1.3,2.3,1.8c2.9,8.5,10.4,1,14.8,2.5c5.5,3.3,12.5-2.8,17.1-0.9c2.8,1.7,8.8,0.3,10.6-2.2
                    c0.4-1.6,2.2-2.2,3.4-1.9l0,0c3.3-5.5-1.2-10.2,3-12c2.6-1.8,8.2-1.5,10.5-2.1c2.4-1.8,5.2-1.5,7.8-2.1c3.2-1,1.6-6,4.3-7.6
                    c1.8-1,5.8,0.2,7.6-1.2c1.8-1.2,6.8-3,5.5-4.9c-0.8-1.9-5.3-1.1-4.8-3.6c0.7-0.9-0.4-3.3-0.9-4.3c3.1-1.7,0.5-4.4,0-6.7
                    c0.1-1.3,3.3-0.8,4.6-1c4.2-0.6,5.8-4.4,10.3-3c3.5-0.5,5.2-5.9,9.5-6.9c4.7-1.8,10.4,1.7,14.5-1.8c5-2.3-4.1-10-6.9-10.5
                    c-7.3,0.8-4-6.6-10.9-8.3c-3.3-2.2-5.5-2.5-9.3-3.3c-2.8-0.7-3.5-2.7-6-3c-2.2,0-1.8,1.4-3.5,1.9c-0.9,0.3-1.1,1.1-2,0.7
                    c-4.6,3.7-3.2,3.8-0.1,7.6c-0.6,2.4-5.2,7.5-7.1,9c-3.3-1.5-4.4-3.2-8.4-1.6c-4.1-1.2-7.7-1.9-11.7-0.5c-2.5-0.1-2.6-2.6-4.5-4
                    c-4.2-2.2-8-4.6-12.9-4.8c-4.9,0.3-9.5,2.3-11.9-3.2c-1.7-2.1,0.2-4.8-3.1-5.7c-5.4-1.8-9.7,1.8-15.1-0.7c-3.3,1.3-11.7,2.1-10-3.5
                    c1.6-2.8-1.2-7-4.2-7.7c-1-0.6-4.1,0.3-4.5-1.2c-3.1-5.8,14.7-4.8,6.3-11.5c-1.7-4.3-3-8.1-8.1-9.8c-9.3-4-20.6-2.9-29.7-6
                    c-4.1,0.7-8-0.8-6.6-5.6c1.1-4.1-6.7-9.4-2.9-13.4c1-1,1.9-2,0.9-3.5c-1.9-2.8-3.7-0.8-6.9-2.1c-4-1-4.5-3.2-8.7-3.4
                    c-3.7-0.4-6.4,0.8-9.2-1.2c-0.9-0.5-2.3-2.3-3.1-0.8c-4.4,3.7-4.4,3.4-4.1,8.8c-3.9,0.3-7.2,1.9-10.9,2.6
                    c-4.2-1.7-10.2-7.1-14.8-3.4c-2.7,2.1-2.3,5.5-5.5,6.6c-2.9,0.7-3.3,3.2-5.1,4.6c-2.1,0.5-3,0.8-3.8,1.4c-1.7,1.4-5.8,0.1-5.5,0.7
                    c-2.2,0.7-1.9,3.6-4,4.6c-3.8,0.3-8.6,2.1-12.4,1.5c-2.8-0.4-2.9,2.4-5.3,3.1c-2.4,0.8-4.9,2.4-6.8,4.1c-1.1,9.3,14.1,9.2,16.1,17.4
                    c2.8,5,14.9,2.1,15,8.2c-3.7,2.1-10.1,2-6.9,7.1c0.5,0.8,0.1,2-0.3,3.2c-3.4,5.8,6.7,6.3,7.1,9.9c-5.1,3.4-26.1-5.6-17.1,7.3
                    c-1.4,0.9-8.1-0.1-8.3,2.9c0.2,4.6,8.8,0.5,8.6,5.8c-0.9,1.2-3.3,1.4-2.8,3.5c-0.6,6.5-10.9-2.4-10.2,16.1c-1.3,3.3-7.8,8-2.6,11
                    c11.9,6.1,4.6-5.8,14.2-3.6c2.1,0.4,4.1,3,4.3,5c-1.8,0.9-2.6,1.1-3.1,2.7c-0.6,2.2,0.7,3.6,0.2,6c-0.2,1.7-0.9,4,1.5,4.2v0
                    C931.3,633.1,933.9,632.5,934.6,632.3z"/>
                <path id="bayern-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M1142.6,661.7c-4.5-4.4-13.7-2.7-17-8.4
                    c-1.5-2.3-1.6-7.2-4.3-8.2"/>
                <path id="schleswig-holstein-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M1014.1,182.3c1.2,11.7-1.5-0.3-14.4,11.4c-1.5,2.6-0.3,5.7-0.3,9c0.2,3.1-1.1,6.4,0.2,9.2
                        c1.1,2.4,3.5,1.6,5.1,2.6c1.3,1.9,1.7,3.1,5.1,4.9c6.2,1.7,10.7,2.8,8.8,10.4c-0.9,2.8,1.7,4,1.1,6.1c-4,2.6-9.5-2.8-13.2,1.4
                        c-3.1,2.9-0.2,6.3-4.2,8.6c-5.4,2.5-9.9,4-15.2,6.9c-3.9,2.6,0.9,7.4-2.5,9.7c4.1,0.4,9.9,0.6,12.1,4.7c0.7,1.8-1.1,4.8,0.4,6.3
                        c0.9,1.3,4.9,1.3,6.1,1.9c0.8,1.7,1.3,2.8,3.5,3.9c8.3,4.1,18.3,11.3,26,15.5c2.6,0.3,6.9-4.2,8.3-0.4c0.5,0.9,1,1.8,2.5,1.9
                        c8.7-1.1,7.5,8.8,15,10.3c5.4-0.1,9.5-3.4,13.9,0.4c3.3,2.4,7.6,1.1,10.7,2.8c0.8-0.1,1.9-0.3,2.7-0.4c2.3-0.5,6.3-0.4,8.2-0.9
                        c3.7-1.3-0.2-5.2-2.7-5.4c-3.6-0.3-3.7-5.4-7.3-5.5c-3.9,0.3-5.9-4.2-8-6.6c-1.4-2.8,4.4-3.3,5.4-5.5c8.5-5.5,8.4,0.1,19.8-10.3
                        c3.3-2.7,6.5,0.1,3.7,3.1c-1.8,4.9,6.1,2.8,7.9,1c4.2-1.4,7.3-1.4,10.5-4.8c2.2-1.1,2.2-2.5,2.2-4.2c0.7-7.9,10.8-1.2,15.4-2.5
                        c5.5-3.8,6.4,3.2,12.5,3.5c7.9,0.7,10.7,7.5,17.3,9.1c2.9-0.2,7.1-0.3,9.6,1.1c1.6,0.8,4.7,1.7,6.4,0.8c4.7,0.5,4.3,4,9,3.8
                        c3.6,0.8,4.2,5.5,8.8,4.3c4.4,1,9.5,1.2,14,1.5c3.3,2.2,6.1,4.2,8.9-0.1c2-3.1,6.9-3.9,9-6.4c2.2-7.1,5.3-0.7,9.9-0.6
                        c4.2-0.7,3.6-5.4,7.4-6c6.2-1.9,5.7,2.7,9.6,4.3c5.1,0.2,2.4-7.6,8-7.4c3-0.9,4.3-1,5.1-4c-1.4-16.8,18.6-10.9,29-9.8
                        c4.4,0.1,8-1.4,10.9-3.5c9-2.3,7.3,12.2,14,15.7c5.1,5.7-0.7,4.7,10.5,5.7c9.2,0.4,9.3-9.4,19-10.2c-0.1-0.4-0.1-0.8-0.2-1"/>
                <path id="brandenburg-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M1083.2,309.7c4.5,0.4,9.3,2.6,11.6,6.5c2.7,1.5,8.6-2.6,9.9,2.4c0.5,2.8,5,1.6,5.6,3.8
	c-0.1,3,0.2,4.4,3.4,5c3.6,1,7,2.3,11,2.4c3.5,0.5,4.4-0.7,6.1-2.3c2.2-1.7,5.5,0.1,5.9,2.9c4.1,4.3,10.3-2.5,12,9.2
	c1.2,2.4-1.4,4.2-2.3,6.3c-2.5,5.4,5,11.4,1.3,16.5c-3.1,3-5.4,1.4-6.2,6.7c-0.6,2.5-3.5,4-1.5,5.6c2.2,1.8-0.8,4.1,2.8,5.2
	c2.7-3.6,5.8-6.1,8.1-0.6c1,0.5,3.3,0.6,3.9,1.9c1.5,2.6-2,4.5-2.3,7.4c-0.5,2.6,0.1,5.6-1.5,7.8c-1.1,1.3-0.7,4.7-1.7,6.1
	c-4.9,6.3,4,10.4-0.6,15.9c-3.4,5.6,2.3,10.1,6.8,13.8c2.5,2,5.2,1.9,5.6,5.5c-0.2,7,7.3,6.9,12.6,6.5c2.1,0.2,4.9,2.8,6.4,4.2
	c5.9,5.7,10.2-3.3,16.6-0.3c3.8,1.6,7,4.9,11.3,5.2c3.8,0.7,2.8,3,6.3,4.2c6.6-1.6,9.3,1.3,14.1,4c3.6,0.5,3.3,3.1,6,4.4
	c7.1,1.4,7.3,7.5,8.2,13.2c0.4,1.6,3.7,2.5,3,4.6c-0.7,2.7-4.8,3-5.7,5.7c-1.1,2.7-6.2,3.1-5.7,6.9c4.9,4.1,12.4,6,13.6,13.4
	c0.2,1.7-0.8,2.7-1.1,4.4c-0.5,1.9,1.1,3.8,0.7,5.5c-0.2,0.7-0.9,1.2-1.6,1.5c-0.6,0.5-1.6,4.2,0.5,2.7c2.1-2.5,5.8-0.4,8.3-0.1
	c4.5-0.8,9.5-2.6,13.4-4.4c3.9,1.4,7.8,4.5,11.4,6.5c2.1,0.9,6.1-0.2,8.3,1.2c12.1,5.3,30.1-6.5,39.3,1.4c0.7-2.7,3-8.1,2.5-11
	c-0.6-1.7-0.4-3.8,1.4-4.7c6.5-1.8,3-3.3,7.1-6.1c4.6-4.5,12.4-5.1,17.8-1.7c1.4,1,3,3,4.5,1.5c7.2-6,17.4-4.2,25.7-7.3l2.9,0.8
	c0.7,0.1,1.3,0.3,1.4-0.8 M1295.9,392.4c-2.2,0.6-2.8,3.7-3.1,5.3c-1.8,0.1-1.9,2.5-3.8,2.2c-1.9-0.4-0.8-3-2.3-3.8
	c-1.8-1-5.8-2.2-8.2-2.5c-1.1-0.2-2.6-0.1-3.3,0.3c-3,0.7-7-3.9-8.6,0.9c-0.4,1.4-1.6,2-2.6,1.1c-2.8-2.6-5.6,1.7-7.9-2.2
	c-5.7-2.8-12.1,0-18.1,0.1c-2-0.2-1.1-2.7-1.1-4.3c-0.3-2.9,1.9-4.8,2.8-7.2c1.8-4.1-1.5-11.4,3.2-13.7c3.8-1.5,1-2.3,6.4-3
	c4-4.4,10.8,4.2,14-0.8c2.4-3.1,5.1,1.9,7.9-4c1.1,0.1,1.9,1.1,1.9,2.3c-1.5,8.7,16.3,12.6,13.3,16.5c-0.9,1.8-1.8,4.3,1.4,4.2
	C1292,382.8,1302.7,388.5,1295.9,392.4z"/>
                <path id="sachsen-anhalt-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M1154.6,565.3c-3.2-1.8-7.4-2-7.5-6.1c-3.1-3.2-4.2-7.2-3.8-11.6c-3.5-8-4-9.9,0.5-17.9
                    c1-3.8-1.5-7.4-2.1-10.9c0-1.2,0.9-2.1,1.9-3c3.6-2.8,0.6-7.6,5.2-10.1c0.8-2.8,11.3-2,14.4-3.2c1.4-1,6.6-0.1,6.6-1.7
                    c2.1-5.8,20.1-0.4,25.3-5.1c4.7-5.4,7.7,0.7,12.4-2.1c2.8-1.8,2.7-2.9,7-3.3c3.7,0,6.4,3,9.8,3.8c4.1-1.8,7-0.8,10.1,2.4"/>
                <path id="hamburg-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M958,252.6c-2.1-2.3-8.1-5.3-9.7-7.6
                    c-0.9-2.9-4.4-3.5-6.1-5.6c-1.2-2.1,0.7-2.6,0.7-5c0.4-2.9-1.9-3-1.9-5.3c0.6-2.2,3.8-2.3,4.3-4.9c1.2-3.2-3.9-4.7-2.1-7.4
                    c2.7-3.3-1.5-5.2-4.7-3.6c-2.7,0.8-5.5-0.3-7.6,1.9c-1.7,3-4.9,3.8-7.4,5.7c-3.4,3-6.3,1-10.7,3.8c-2.7,1.2-4.2,4.2-6.4,4.7
                    c-1.5-0.3-1.4-3.4-3.2-3.6c-4.8-0.4-7.2,4.5-7.2,8.5"/>
                <path id="bremen-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M819,294.1c-1.3-0.4-1.1-2.3-0.9-3c1.4-7.4-7.9-3.2-11.6-5.6c-4.4-2.1-7.6-0.6-11.6-4.2
                    c-6.4-0.9-12.3-2.9-18.3-4.9c-11-5.3-10.3,5.4,2.1,6.6c3.8,2.4,4.8,9.6,9.3,11.6c1.8,4.5,1.7,8.6,8.5,7.6c8,1.6,17.9,6.2,23.5-2.6"/>
                <path id="baden-wuerttemberg-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M884.3,981.6c3-4.4,9.7-5.8,14.9-5.6c3.9,0,8.4-7.1,11.8-6.8c6.4,1.5,8.7,2.9,15.2-0.2
                    c4.7-0.6,12.4,2.4,14.1-3.6c0-2.8-0.1-7.6-3.8-8.2c-0.8-0.3-1.6-0.5-1.4-1.1c1.1-2.3,8-3.2,3.7-6.7c-4.1-2.9,2.7-8.7-2.1-11.2
                    c-4-2.2,6.3-8,4.9-13.3c0.9-4.9-3.8-10.5-5.3-14.7c-0.3-7.8-5.4-14.6-10.2-20.4c-0.8-2,0.5-3.6,2.6-4.1c6.2-4.1-1.3-8.5,12.7-7.6
                    c7-0.5,9.4-6.4,16.6-6.7c3.4-2.4,0.8-6.6,0.9-9.6c1.1-2.7-3.2-3.9-3.8-6.1c-1.2-3.2,5.7-2.8,5.9-2.1c1.2,3.5,4.8,2.4,6.2,0.2
                    c2.3-2.5,2.8-0.2,4.9,1.1c4.8,0.7,6.7-3.5,4.2-6.2c-6.9-2.3-5.5-4.8-3.3-10.6c1.2-3.5-0.7-6.8,0.3-9.7c1.3-1.5,1.2-4.6-0.6-5.8
                    c-7.5-4.1-7.9-10.9-17.2-11.5c0.4-3.7-1.9-3.8-3.7-5.6c1.8-2,4.7-5.6,0.1-6.9c-4.9-1.6-7.9-1.8-8.8-5.7c-0.4-2.4-2.9-6.3-1.4-8.5
                    c2.1-3.5-7.5-9.7-1-12.1c6.5-2.8-1.8-6.6-1.8-8.8c1.7-1.9-0.2-4.6-0.2-5.9c-0.4-2.7-2.4-3.1-4.8-3.1c-2.6,0.1-3.1,3.7-5.4,4.4
                    c-7,1.4-9,1.8-9.2-6.2c-0.2-0.9-0.4-2.8-1.7-2.3c-0.6,0.7-4.3-0.6-4.5,0.8c-4.8-2.4,0.6-4.7,0.5-7.3c0.1-1.8-3.1-3.6-3.9-5.2
                    c-1.2-3.3-1.3-7.7-5.8-7.8c-4.8,1-3.2,4.8-8.6,0.7c-2.3-0.2-1.9,2.1-3.7,2.5c-3.3-1.3-2.8-2.1-2.4-3c3.4-6.1-1.4-9.7-7.3-7.2
                    c-1.4,0.6-1,2.1-2.6,2.3c-2.7,0.1-2.3-2.8-4.6-3.2c-7.8,0.1-7.4-1.4-13.5,0.2c-4.1,0.1-10.2,3.7-4.2,6.5c1.9,0.2,2,2.8,3.6,2.9
                    c4.9,0.9,4.9,1.6,4.9,2.4c0,1.7,0.1,3.6-0.8,3.7c-3.4-1-4.8,0-6.7,0.5c-7.6-0.8-4.2,9-11.7,7.7c-4.5,0.5-8.9-0.9-13.5,0.4
                    c-2.1,2.8-1.9,2.9,0.6,5.5c2.3,3.1-4.8,0.4-5.6,2.3c-3.6,1.5-14.1-2.7-12.2,4.7c1.1,3.4-1.5,2.2-3.8,3c-1.3,1.2-1.6,3.9-3.8,4.4
                    c-3.4-0.1-4.3-0.9-2.7-4c0.2-1.2-1-3.1,0.7-3.5c8.5,0,7-4.8-0.5-4.6c-2.8-3.9-9.8-2.1-12.7-5.8c-2.5-4.7-1.3-10.9-8.8-8.5
                    c-7.5,0.9-2.3,4.9-2.1,8.9c-7.4,2.5-12.6-8.5-21.7-4.9c0.2,0.6,0.3,1.2,0.2,1.9c0.1,5.1,5.4,9.5,4.1,14.7c0,1.6,3.1,1.4,3.9,2.1
                    c0.3,2.3,1.3,7-0.1,8.8c-7.9,8.2,2.7,5.9-1.8,10.3c-14.4,5.5-7.7,10.4-12.9,20.8c-8.8,6.3-1.9,14.5-13.5,15"/>
                <path id="hessen-border" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M730.7,610.4c-1.5,4.1,0.8,7.5,3.1,10.6
                    c1,2.8-2,6.3-4.8,6.8c-5.5-1.9-10.2-1.6-11.9,4.8c3.7,10.3-3.3,6.5-2,11.9c0.8,2,3.8,1.7,5.6,2.3c2.1,1.9,15.9,15.3,7,14.5
                    c-9.3-0.9-4.1,4.1-8.1,4.4c-5.2-0.9-8.5,2.7-12.4,5.3c-1.4,1.7,2.1,4.2,1.7,6.1c-1.7,3-7.3-0.9-8.8,4.7c-1.8,3.9-11.1,2.9-2,7.5
                    c6.9,3.4,2.1,7.9,13.3,6.8c13.3-4.2,41.8-11.7,42.1,10.5c-0.4,2.9,0.8,4.8,2.9,6.1c1.2,1.2,0.5,1.9,0.6,3.3c1.5,3.8,2.7,7.9,7.9,7.4
                    c1.9-0.4,2.4,1.2,1.8,2c-1,1.1-1.8,0.6-3.2,2c-1.6,1.1-0.9,2-3.2,2c-10.7-0.4-3.2,11.4,0.1,15.6"/>
                <path id="hessen-border-2" className="bl-border" strokeWidth={3 / zoom.scale} strokeDasharray={8 / zoom.scale} d="M834.2,747c-7.3-7.6,2.9-3-1.1-11.1c0.5-1.5,5.1-3,4.7-4.7c1.2-3.5-1.4-6.1-1.6-9.4
                    c-2.8-3-3.4-1.2-4.7-5.2c-1.7-1.3-3.8-1.4-3.9-4.1c-0.9-2.9-2.5-6.8-2.1-10c2.8-4.1,3-11.3-2.9-12.4c2.5-7.3,9.1-10.1,15.4-5.8
                    c4.3,0.6,4.3-4.5,8.6-4.3c5.8,0.6,10.9-1.2,14.7,3c5.4,5.8,16.3,2.7,15.2-5.4c-3.9-11.9,3.9-7.6,11.6-8.5c2.4-0.8,2-2.6,2.7-4.3
                    c9.2-5.9,9.3-1.4,10.3-14.5c3.2-8,6.3,1.4,13.8-2c6-2.5,17.2-7.1,15.9-14.9v0"/>
            </g>
        <g id="bl-legend">
            <text transform="matrix(1 0 0 1 1256.8175 449.9987)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Brandenburg</text>
            <text transform="matrix(1 0 0 1 1386.1177 311.8999)" className="land-name">
                <tspan x="0" y="0" style={{ fontSize: `${24 / zoom.scale}px`, letterSpacing: `${1 / zoom.scale}em`}}>POLSKA</tspan>
                <tspan x="0" y={25 / zoom.scale} style={{ fontSize: `${18 / zoom.scale}px`, letterSpacing: `${1 / zoom.scale}em`}}>(POLEN)</tspan>
            </text>
            <text transform="matrix(1 0 0 1 1089.4402 205.6002)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Mecklenburg-Vorpommern</text>
            <text transform="matrix(1 0 0 1 1224.4983 570.4001)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Sachsen</text>
            <text transform="matrix(1 0 0 1 1044.5627 461.2805)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Sachsen-Anhalt</text>
            <text transform="matrix(1 0 0 1 817.1103 347.267)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Niedersachsen</text>
            <text transform="matrix(1 0 0 1 988.5699 601.3982)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Thüringen</text>
            <text transform="matrix(1 0 0 1 794.4549 621.8753)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Hessen</text>
            <text transform="matrix(1 0 0 1 600.9634 508.9748)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Nordrhein-Westfalen</text>
            <text transform="matrix(1 0 0 1 852.8958 162.2787)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Schleswig-Holstein</text>
            <text transform="matrix(1 0 0 1 569.3865 701.0943)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Rheinland-Pfalz</text>
            <text transform="matrix(1 0 0 1 579.2902 773.7056)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Sarrland</text>
            <text transform="matrix(1 0 0 1 787.3002 854.8612)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Baden-Württemberg</text>
            <text transform="matrix(1 0 0 1 1059.8713 811.426)" className="bl-name" style={{ fontSize: `${18 / zoom.scale}px`}}>Bayern</text>
        </g>
        </svg>
    </animated.div>))
}