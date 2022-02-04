import './App.scss';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home } from './components/home/Home';
import { Container } from './components/container/Container';
import { Header } from './components/stateless/header/Header';
import { LanguagePicker } from './components/form/languagepicker/LanguagePicker';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTrainroutes, selectStartPos } from './components/map/trainroutes/TrainroutesSlice';
import { loadLang, langLoading, langError } from './AppSlice';

function App() {

  const [lang, setLang] = useState('de');
  const [classes, setClasses] = useState('');
  const dispatch = useDispatch();
  const languagesLoading = useSelector(langLoading);
  const languagesError = useSelector(langError);
  const start = useSelector(selectStartPos);
  const location = useLocation();

  const setLanguage = lang => {
    setLang(lang)
  }

  useEffect(()=>{
    dispatch(loadTrainroutes({start}));
  },[dispatch, start]);

  useEffect(()=>{
    dispatch(loadLang());
  },[dispatch]);

  useEffect(()=>{
    const classNames = location.pathname === "/routefinder" ? "routefinder" : "home";
    setClasses(classNames);
  },[location]);

  if(languagesLoading) return <div/>;
  if(languagesError) return <div>'languages error'</div>;
  return (
    <div className="App">
      <div id="wrapper" className={classes}>
        <Header>
          <Link to="/"><div id="logo"/></Link>
          <LanguagePicker
              setLanguage={setLanguage}
              lang={lang}/>
        </Header>
        <Routes>
          <Route path="/" element={<Home lang={lang}/>} />
          <Route path="routefinder" element={<Container lang={lang} />} />
        </Routes>
      </div>
    </div>)
}

export default App;
