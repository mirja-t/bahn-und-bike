import './zoompanel.scss';

export const ZoomPanel = ({fn}) => {
    
    return <div id="zoompanel">
        <button onClick={() => {fn('+')}}>+</button>
        <button onClick={() => {fn('-')}}>-</button>
    </div>
}