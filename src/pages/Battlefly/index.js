import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NestedList from '../../components/NestedList';
import { Section } from '../../components/Section';

import { useAddBattleflyModSet } from '../../data-layer/useAddBattleflyModSet';
import { useBattlefly } from '../../data-layer/useBattlefly';
import { useSaveBattleflyTraits } from '../../data-layer/useSaveBattleflyTraits';
import { ModType } from '../../data/constants';
import { BattleflyForm } from '../../forms/Battlefly';
import { BattleflyTraitsForm } from '../../forms/BattleflyTraits';
import { BattleflyStats } from '../../forms/BattleflyStats';
import { useUpdateBattlefly } from '../../data-layer/useUpdateBattlefly';
import { BattleflyCharacteristicsForm } from '../../forms/BattleflyCharacteristics';
import { useSaveBattleflyCharacteristics } from '../../data-layer/useSaveBattleflyCharacteristics';

function getModShortData(mod) {
  if (mod.type === ModType.Weapon) {
    return (
      mod.name +
      ` (${mod.rarity}/${mod.data.damageType}/R: ${mod.data.reload}, FR: ${mod.data.fireRate}, DPF: ${mod.data.damagePerFire})`
    );
  }

  return mod.name + ` (${mod.rarity}/SHP: ${mod.data.shp}, ARM: ${mod.data.arm})`;
}

function toModSets(modSets) {
  if (!modSets) return [];

  return modSets.map((item) => ({
    text: item.name,
    items: item.mods.map((mod) => ({
      type: mod.type,
      text: getModShortData(mod),
    })),
  }));
}

export const BattleflyPage = () => {
  const { battleflyId } = useParams();

  const [battlefly, refetchBattlefly] = useBattlefly(battleflyId);
  const [modSets, setModSets] = useState(toModSets(battlefly?.modSets));

  useEffect(() => {
    if (!battlefly?.modSets) return;

    setModSets(toModSets(battlefly.modSets));
  }, [battlefly?.modSets]);

  const addBattleflyModSet = useAddBattleflyModSet();
  const saveBattleflyTraits = useSaveBattleflyTraits();
  const saveBattleflyCharacteristics = useSaveBattleflyCharacteristics();

  const updateBattlefly = useUpdateBattlefly();

  if (!battlefly) return null;

  const onModSetAdd = async (data) => {
    const modSets = await addBattleflyModSet(battleflyId, data);

    refetchBattlefly();

    setModSets(toModSets(modSets));
  };

  const onTraitsSave = async (data) => {
    await saveBattleflyTraits(
      battleflyId,
      data.traits
        .map((trait) => trait.id)
        .filter((traitId) => traitId !== battlefly.fraction?.trait?.id)
    );

    refetchBattlefly();
  };

  const onCharacteristicsSave = async (data) => {
    await saveBattleflyCharacteristics(battleflyId, data);

    refetchBattlefly();
  };

  const onEditBattlefly = async (battlefly) => {
    await updateBattlefly(battleflyId, battlefly);

    await refetchBattlefly();
  };

  return (
    <div>
      <BattleflyForm onSubmit={onEditBattlefly} battlefly={battlefly} mode="edit" />

      <div style={{ height: 30 }}></div>

      <Section>
        <Typography paragraph variant="h5">
          Traits
        </Typography>

        <BattleflyTraitsForm traits={battlefly.traits} onSubmit={onTraitsSave} />
      </Section>

      <div style={{ height: 30 }}></div>

      <Section>
        <BattleflyCharacteristicsForm battlefly={battlefly} onSubmit={onCharacteristicsSave} />
      </Section>

      <div style={{ height: 30 }}></div>

      <Section>
        <Typography paragraph variant="h5">
          Mod Sets
        </Typography>

        <NestedList modSets={battlefly.modSets} items={modSets} onSubmit={onModSetAdd} />
      </Section>

      <div style={{ height: 30 }}></div>

      <Section>
        <BattleflyStats battlefly={battlefly} modSets={battlefly.modSets} />
      </Section>
    </div>
  );
};
