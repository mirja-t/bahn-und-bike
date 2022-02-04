import './home.scss';
import { useSelector } from 'react-redux';
import { selectLang } from '../../AppSlice';
import { Link } from 'react-router-dom';
import img from '../../assets/images/germany-startscreen.svg';

export const Home = ({lang}) => {
    const labels = useSelector(selectLang);

    return (<div id="home">
        <div className="wrapper">
            <h1>{labels.home_headline[lang]}</h1>
            <h3>{labels.home_subheadline[lang]}</h3>
            <p className="margintop">
                {labels.home_p1[lang]}
            </p>
            <ol>
                <li>{labels.home_l1[lang]}</li>
                <li>{labels.home_l2[lang]}</li>
                <li>{labels.home_l3[lang]}</li>
                <li>{labels.home_l4[lang]}</li>
            </ol>
            <p className="margintop">
                <Link to="/routefinder"><button>{labels.start[lang]}</button></Link>
            </p>
        </div>
        <div id="germany">
            <img src={img} alt=""/>
        </div>
    </div>)
}