import './itemlist.scss';
import { VelorouteIcon } from '../icons/VelorouteIcon';
import { useSprings, animated } from 'react-spring';
import { useSelector } from 'react-redux';
import { selectLang } from '../../../AppSlice';

export const ItemList = ({
    items,
    lang,
    activeItem,
    fn
}) => {

    const labels = useSelector(selectLang);

    const springs = useSprings(
        items.length,
        items.map((_, i) => ({
          delay: 250 * i,
          x: 0,
          opacity: 1,
          from: {
            x: 500,
            opacity: 0
          },
          config: {
            tension: 210,
            friction: 20
          }
        }))
      );

    return (<ul className="destinationslist">
        {items.length < 1 && (<li className="route nomatch">{`${labels[lang].nomatch}`}</li>)}
        {springs.map((styles, i) => (
            <animated.li 
                style={styles}
                key={i}
                onClick={() => fn(items[i])}
                className={activeItem && items[i].id===activeItem?.id ? 'active' : ''}>
                <VelorouteIcon/>
                <h4 
                    className="veloroute">
                    {`${items[i].name}`}
                </h4>
            </animated.li>
        ))}
    </ul>)
}