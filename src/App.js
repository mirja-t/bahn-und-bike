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
import { LanguagePicker } from './components/form/languagepicker/LanguagePicker';
import { 
  loadLang, 
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

function App() {

  const [lang, setLang] = useState('de');
  const [classes, setClasses] = useState('');
  const dispatch = useDispatch();
  const languagesLoading = useSelector(selectLangLoading);
  const languagesError = useSelector(selectLangError);
  const location = useLocation();

  const setLanguage = lang => {
    setLang(lang)
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
    <div className="App">
      <div id="wrapper" className={classes}>
        <Header>
          <Link to="/" title={lang==='de' ? 'Zur Startseite' : 'Back to Homepage'}><div id="logo" onClick={resetState}/></Link>
          <LanguagePicker
              setLanguage={setLanguage}
              lang={lang}/>
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
