import './loading.scss';
import ladesequenz from '../../../assets/json/ladesequenz.json';
import { useSelector } from 'react-redux';
import { Player } from '@lottiefiles/react-lottie-player';
import { selectLang } from '../../../AppSlice';

export const Loading = ({lang}) => {
    const labels = useSelector(selectLang);

    return <div id="loader">
        <Player
            autoplay
            loop
            src={ ladesequenz }
            style={{ height: '12em', width: '12em' }}
            >
        </Player>
        <p>{labels[lang].loading}</p>
    </div>
}