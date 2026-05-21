import { useEffect, useState } from 'react';
import StoreProvider from './store/StoreProvider.jsx';
import { useStore } from './store/hooks.js';
import BottomNav from './components/BottomNav.jsx';
import CupboardScreen from './screens/CupboardScreen.jsx';
import CauldronScreen from './screens/CauldronScreen.jsx';
import GrimoireScreen from './screens/GrimoireScreen.jsx';
import RecipePanel from './components/RecipePanel.jsx';
import { HeaderMark } from './components/Glyphs.jsx';

const SUBTITLES = {
  cupboard: 'kept on the shelf',
  cauldron: 'what is gathered',
  grimoire: 'recipes, scribed',
};

function Shell() {
  const { state } = useStore();
  const [tab, setTab] = useState('cupboard');
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg) => setToast(msg);
  const cauldronCount = state.cauldron.length;

  const handleTabChange = (id) => {
    setOpenRecipeId(null);
    setTab(id);
  };

  return (
    <div className={'app' + (tab === 'cupboard' ? ' app--cupboard' : '')}>
      {tab === 'cupboard' ? (
        <CupboardScreen onToast={showToast} />
      ) : (
        <>
          <header className="app-header">
            <div className="title">
              <HeaderMark className="mark" size={16} />
              <span>Witch Cupboard</span>
            </div>
            <div className="subtitle">{SUBTITLES[tab]}</div>
          </header>

          <main className="app-main">
            {tab === 'cauldron' && (
              <CauldronScreen
                onRecipeSaved={() => {
                  setTab('grimoire');
                  showToast('Added to the Grimoire');
                }}
                onGoToCupboard={() => setTab('cupboard')}
              />
            )}
            {tab === 'grimoire' && (
              <GrimoireScreen
                onOpenRecipe={(id) => setOpenRecipeId(id)}
                onGoToCauldron={() => setTab('cauldron')}
              />
            )}
          </main>
        </>
      )}

      <RecipePanel
        open={tab === 'grimoire' && Boolean(openRecipeId)}
        recipeId={openRecipeId}
        onClose={() => setOpenRecipeId(null)}
        onToast={showToast}
      />

      <BottomNav active={tab} onChange={handleTabChange} cauldronCount={cauldronCount} />

      {toast ? <div className="toast" role="status" aria-live="polite">{toast}</div> : null}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
