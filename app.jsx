// App router for BIKEWATCH '99 click-thru
const { useState } = React;

const App = () => {
  const [view, setView] = useState('title');     // title | watch | over | marketing
  const [finalTime, setFinalTime] = useState(0);

  return (
    <div>
      <div className="switcher">
        <button className={view==='title'? 'active':''} onClick={() => setView('title')}>TITLE</button>
        <button className={view==='watch'? 'active':''} onClick={() => setView('watch')}>WATCH HUD</button>
        <button className={view==='over'? 'active':''} onClick={() => setView('over')}>GAME OVER</button>
        <button className={view==='marketing'? 'active':''} onClick={() => setView('marketing')}>MARKETING SITE</button>
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
