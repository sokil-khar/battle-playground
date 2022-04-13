import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getData, startHyperdome } from '../../battle/hyperdomes';
import { Section } from '../../components/Section';
import { prepareBattlefliesToBattle } from '../Battles';
import { HyperdomeStat } from './HyperdomeStat';
import { SelectBattleflies } from './SelectBattleflies';

function useCreateHyperdome() {
  async function request(data) {
    const result = await startHyperdome(getData(data));

    return result;
  }

  return request;
}

function useCurrentHyperdome() {
  const [current, setCurrent] = useState(null);

  async function refetch() {
    try {
      const result = window.localStorage.getItem('hyperdomeReport');
      if(!result) return;

      setCurrent(JSON.parse(result));
    } finally {
    }
  }

  useEffect(() =>{
   refetch();
  }, []);

  return [current, refetch];
}

export const HyperdomePage = () => {
  const [currentHyperdome, refetch] = useCurrentHyperdome();
  const createHyperdome = useCreateHyperdome();

  const [load, setLoad] = useState(currentHyperdome);
  const [showCreate, setShowCreate] = useState(false);

  const onStartHyperdome = async (data) => {
    try {
      const battleflies = await prepareBattlefliesToBattle(data.battleflies);

      setLoad(true);

      setShowCreate(false);

      const result = await createHyperdome({
        ...data,
        battleflies,
      });

      window.localStorage.setItem('hyperdomeReport', JSON.stringify(result));

      setLoad(false);

      await refetch();
    } catch(err) {
      setLoad(false);
      setShowCreate(true);
    }
  };

  return <div>
    {load && <Section>Simulation in progress... Please wait a bit...</Section>}
    {(showCreate && !load) && <SelectBattleflies onStart={onStartHyperdome} />}
    {(!showCreate && currentHyperdome && !load) && <React.Fragment>
      <Button variant="contained" onClick={() => setShowCreate(true)}>Start new simulation</Button>
      <div style={{  height: 40 }} />
      <HyperdomeStat data={currentHyperdome} />
    </React.Fragment>}
  </div>;
}
