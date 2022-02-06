import { selectLang } from '../../AppSlice';
import { useSelector } from 'react-redux';

export const Imprint = ({lang}) => {

    const labels = useSelector(selectLang);

    return (<div className="container">
        <div className="wrapper">
            <h1>{labels.imprint[lang]}</h1>
            <h5>{labels.siteowner[lang]}</h5>
            <p>Mirja Tschakarov</p>
            <p>Friedrichsberger Straße 5</p>
            <p>10243 Berlin</p>
            <h5>{labels.contact[lang]}</h5>
            <p><span>{labels.email[lang]}</span> mirja.t@bahn-und-bike.eu</p>
            <p><span>{labels.phone[lang]}</span> 017667594878</p>
        </div>
    </div>)
}