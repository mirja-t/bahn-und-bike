import './App.scss';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home } from './components/home/Home';
import { Imprint } from './components/imprint/Imprint';
import { Privacy } from './components/privacy/Privacy';
import { Container } from './components/container/Container';
import { Header } from './components/stateless/header/Header';
import { Footer } from './components/stateless/footer/Footer';
import { Error } from './components/stateless/error/Error';
import { Switcher } from './components/form/switcher/Switcher';

import { 
  loadLang, 
  setTheme,
  selectTheme,
  selectLangLoading, 
  selectLangError
} from './AppSlice';
import { 
  setActiveSection,
  setCurrentTrainroutes,
  setTrainLinesAlongVeloroute
} from './components/map/trainroutes/TrainroutesSlice';
import { 
  setActiveVeloroute,
  setActiveVelorouteSection
} from './components/map/veloroutes/VeloroutesSlice';
import { Logo } from './components/stateless/header/logo/Logo';

function App() {

  const [lang, setLang] = useState('de');
  const theme = useSelector(selectTheme);
  const [classes, setClasses] = useState('');
  const dispatch = useDispatch();
  const languagesLoading = useSelector(selectLangLoading);
  const languagesError = useSelector(selectLangError);
  const location = useLocation();

  const setLanguage = lang => {
    setLang(lang)
  }

  const setPageTheme = theme => {
    setTheme(theme);
    dispatch(setTheme(theme));
  }

  useEffect(()=>{
    dispatch(loadLang());
  },[dispatch]);

  useEffect(()=>{
    const classNames = location.pathname === "/" ? "home" : location.pathname.match(/[^/]*$/)[0];
    setClasses(classNames);
  },[location]);

  const resetState = () => {
    dispatch(setCurrentTrainroutes([]));
    dispatch(setActiveSection(null));
    dispatch(setActiveVeloroute(null));
    dispatch(setActiveVelorouteSection(null));
    dispatch(setTrainLinesAlongVeloroute([]));
  }

  if(languagesLoading) return <div/>;
  if(languagesError) return <Error/>;
  return (
    <div className={`App theme-${theme}`}>
      <div id="wrapper" className={classes}>
        <Header>
          <Link to="/" title={lang==='de' ? 'Zur Startseite' : 'Back to Homepage'} onClick={resetState}><Logo/></Link>
          <div style={{ display: 'flex', gap: '0.5em' }}>
            <Switcher
                setValue={setLanguage}
                values={[
                  {
                    value: 'de', 
                    label: 'de'
                  },
                  {
                    value: 'en', 
                    label: 'en'
                  }
                ]}/>
            <Switcher
                setValue={setPageTheme}
                values={[
                  {
                    value: 'light', 
                    label: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="17" height="17" x="0px" y="0px"
                    viewBox="0 0 20 20" xmlSpace="preserve">
                      <polygon points="10,4.7 11.3,0.1 11.3,4.8 13.7,0.7 12.6,5.3 15.9,1.9 13.7,6.1 17.7,3.6 14.5,7.2 19.1,5.8 15.1,8.4 
                        19.8,8.1 15.3,9.7 20,10.6 15.2,11 19.5,13.1 14.8,12.3 18.5,15.4 14.1,13.4 16.9,17.3 13.1,14.3 14.8,18.8 12,15 12.5,19.7 
                        10.7,15.3 10,20 9.3,15.3 7.5,19.7 8,15 5.2,18.8 6.9,14.3 3.1,17.3 5.9,13.4 1.5,15.4 5.2,12.3 0.5,13.1 4.8,11 0,10.6 4.7,9.7 
                        0.2,8.1 4.9,8.4 0.9,5.8 5.5,7.2 2.3,3.6 6.3,6.1 4.1,1.9 7.4,5.3 6.3,0.7 8.7,4.8 8.7,0.1 "/>
                    </svg>
                  },
                  {
                    value: 'dark', 
                    label: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="17" height="17" x="0px" y="0px"
                    viewBox="0 0 20 20" xmlSpace="preserve">
                      <path d="M9.7,10c0-3.8,2.4-7,5.8-8.1c-0.9-0.3-1.8-0.5-2.8-0.5C8,1.4,4.2,5.3,4.2,10c0,4.7,3.8,8.6,8.6,8.6
    c1,0,1.9-0.2,2.8-0.5C12.2,17,9.7,13.8,9.7,10z"/>
                    </svg>
                  },
                ]}/>
          </div>
        </Header>
        <Routes>
          <Route path="/" element={<Home lang={lang}/>} />
          <Route path="routefinder" element={<Container lang={lang} />} />
          <Route path="datenschutz" element={<Privacy lang={lang} resetState={resetState} />} />
          <Route path="impressum" element={<Imprint lang={lang} resetState={resetState} />} />
        </Routes>
        <Footer>
          <Link to="datenschutz">{lang==='de' ? 'Datenschutz' : 'Privacy'}</Link>&nbsp;&nbsp;
          <Link to="impressum">{lang==='de' ? 'Impressum' : 'Legal Notes'}</Link>
        </Footer>
      </div>
    </div>)
}

export default App;
