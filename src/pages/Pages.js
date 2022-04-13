import { Container, Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { AppHeader } from '../components/AppBar';

import { BattlefliesPage } from './Battleflies';
import { AddBattleflyPage } from './AddBattlefly';
import { BattleflyPage } from './Battlefly';

import { ModDetailsPage } from './ModDetails';
import { ModsPage } from './Mods';
import { AddModPage } from './AddMod';

import { AddFractionPage } from './AddFraction';
import { FractionsPage } from './Fractions';
import { FractionDetailsPage } from './FractionDetails';

import { AddTraitPage } from './AddTrait';
import { TraitDetailsPage } from './TraitDetails';
import { BattlesPage } from './Battles';

import { MultiBattlesPage } from './MultipleBattles';

import Dexie from 'dexie';
import { HyperdomePage } from './Hyperdome';

const StartPage = () => {
  const onResetData = async () => {
    const result = window.confirm('Are you sure?');
    if (!result) return;

    window.localStorage.removeItem('userId');

    await Dexie.delete('BattleflyDatabase');

    window.location.reload();
  };

  return (
    <div>
      <Button variant="contained" onClick={onResetData}>
        Generate new battleflies
      </Button>
    </div>
  );
};

export const Pages = () => {
  return (
    <div className="app">
      <AppHeader />

      <Container maxWidth="xl" style={{ marginTop: 20, marginBottom: 20 }}>
        <Routes>
          <Route path="/battleflies" element={<BattlefliesPage />} />
          <Route path="/battleflies/add" element={<AddBattleflyPage />} />
          <Route path="/battleflies/:battleflyId" element={<BattleflyPage />} />

          <Route path="/fractions" element={<FractionsPage />} />
          <Route path="/fractions/add" element={<AddFractionPage />} />
          <Route path="/fractions/:fractionId" element={<FractionDetailsPage />} />

          <Route path="/traits/add" element={<AddTraitPage />} />
          <Route path="/traits/:traitId" element={<TraitDetailsPage />} />

          <Route path="/mods" element={<ModsPage />} />
          <Route path="/mods/add" element={<AddModPage />} />
          <Route path="/mods/:modId" element={<ModDetailsPage />} />

          <Route path="/battles" element={<BattlesPage />} />

          <Route path="/multi" element={<MultiBattlesPage />} />

          <Route path="/hyperdome" element={<HyperdomePage />} />

          <Route path="/" element={<StartPage />} />
        </Routes>
      </Container>
    </div>
  );
};
