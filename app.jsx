// App router for BIKEWATCH '99 click-thru
const { useState } = React;

const App = () => {
  const [view, setView] = useState('title');     // title | watch | over | marketing
  const [finalTime, setFinalTime] = useState(0);

  // Track virtual page views in GA4 when switching screens
  React.useEffect(() => {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: 'BIKEWATCH 99 — ' + view.toUpperCase(),
        page_location: window.location.href,
        screen_name: view,
      });
    }
  }, [view]);

  return (
    <div>
      <div className="switcher">
        <button className={view==='title'? 'active':''} onClick={() => { AudioEngine.click(); setView('title'); }}>TITLE</button>
        <button className={view==='watch'? 'active':''} onClick={() => { AudioEngine.click(); setView('watch'); }}>WATCH HUD</button>
        <button className={view==='over'? 'active':''} onClick={() => { AudioEngine.click(); setView('over'); }}>GAME OVER</button>
        <button className={view==='marketing'? 'active':''} onClick={() => { AudioEngine.click(); setView('marketing'); }}>MARKETING SITE</button>
        <SoundToggle />
      </div>

      {view === 'marketing'
        ? <MarketingScreen/>
        : (
          <Frame>
            {view === 'title'  && <TitleScreen onStart={() => setView('watch')}/>}
            {view === 'watch'  && <WatchScreen onLose={(t) => { setFinalTime(t); setView('over'); }}/>}
            {view === 'over'   && <OverScreen finalTime={finalTime} onRetry={() => setView('watch')} onMenu={() => setView('title')}/>}
          </Frame>
        )
      }
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
