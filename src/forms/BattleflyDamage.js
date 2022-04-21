import { Typography, List, ListItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {DamageType, ModType, DamageData, StatsData} from '../data/constants';
import { useForm } from 'react-hook-form';

import { SelectInput } from '../components/SelectInput';
import {
    getActualDamageBonus,
    getBattleflyDamageBonus,
    getBattleflyStats,
    getBattleflyStatsEffects,
    getBattleflyWeaponBonus
} from '../battle/battlefly';
import { EffectType } from '../battle/constants';
import {traitFormatter} from "../columns/formatters";

function getModShortData(mod) {
    if (mod.type === ModType.Weapon) {
        return (
            mod.name +
            ` (${mod.rarity}/${mod.data.damageType}/R: ${mod.data.reload}, FR: ${mod.data.fireRate}, DPF: ${mod.data.damagePerFire})`
        );
    }

    return mod.name + ` (${mod.rarity}/SHP: ${mod.data.shp}, ARM: ${mod.data.arm})`;
}

function groupBy(items, by) {
    return items.reduce((acc, item) => {
        const key = item[by];
        acc[key] = acc[key] ? acc[key].concat(item) : [item];

        return acc;
    }, {});
}

export const BattleflyDamage = ({ battlefly, modSets = [] }) => {
    const { watch, control } = useForm({
        defaultValues: {
            modSet: '0',
        },
    });

    // TODO: change it
    const modSetOptions = modSets.reduce(
        (a, c, idx) => ({
            ...a,
            [idx]: c.name,
        }),
        {}
    );

    const activeModSet = watch('modSet');
    const stateUpdates = groupBy(
        getBattleflyDamageBonus(battlefly, modSets[activeModSet]?.mods || [])
            .map((item) => item.data),
        'type'
    );
    console.log(stateUpdates)
    const actualbonus = getActualDamageBonus(battlefly, modSets[activeModSet]?.mods || []).weaponbonus;
    return (
        <div>
            <Typography paragraph variant="h5">
                Weapon-type stats
            </Typography>

            <form>
                <SelectInput
                    label="Active Mod Set"
                    control={control}
                    name="modSet"
                    options={modSetOptions}
                    fullWidth
                />

                {Object.entries(DamageData).map(([key, value]) => (
                    <Accordion key={key}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                                {key +' damage bonus'}: {t(actualbonus[key])}
                                {DamageData[key].sign}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    1. Initial value for damage:
                                    <b style={{ marginLeft: 10 }}>
                                        {battlefly.weaponbonus[key]}
                                        {DamageData[key].sign}
                                    </b>
                                </ListItem>
                                {stateUpdates[key]
                                    ?.filter((i) => i?.change)
                                    .map((item, idx) => (
                                        <ListItem>
                                            {idx + 2}.{' '}
                                            <BonusUpdateInfo item={item} battlefly={battlefly} actualbonus={actualbonus} />
                                        </ListItem>
                                    ))}
                                {
                                    stateUpdates[key]&&
                                <ListItem style={{ marginTop: 20 }}>
                                    Together:{' '}
                                    <BonusUpdatesInfo type={key}  items={stateUpdates[key]}  battlefly={battlefly} />
                                </ListItem>
                                }
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </form>
        </div>
    );
};

function t(value) {
    return Number(value).toFixed(2);
}

function BonusUpdatesInfo({type, items, battlefly})
{
    console.log(type, items)
    const { weaponbonus } = battlefly;
    let value = weaponbonus[type];
    const sign = DamageData[type].sign;
    let result = `${value} ${sign}`;

    if (!items) return result;

    for (const item of items) {
        if (item.change === 0) continue;

        result += ` ${item.change > 0 ? '+' : '-'} ${t(item.change)} ${sign}`;

        value += item.change;
    }

    return result + ` = ${t(value)} ${sign} (Actual value)`;
}

function BonusUpdateInfo({ item, battlefly, actualbonus }) {
    const { type, change } = item;
    const { reason, data } = item.reason;
    const { weaponbonus } = battlefly;

    if (change === 0) return null;

    const v = weaponbonus[type] + change;

    let result = `${weaponbonus[type]} ${DamageData[type].sign} ${change > 0 ? '+' : '-'} ${t(change)} ${
        DamageData[type].sign
    } = ${t(v)} ${DamageData[type].sign}`;

    // if (reason === 'Trait') {
    //     result += ` (Trait: ${traitFormatter(data.trait)})`;
    // }
    //
    // if (reason === 'MagicValue') {
    //     result += ` (Magic Stat: +${actualStats.mag}%)`;
    // }

    if (reason === 'Mod') {
        result += ` (Mod ${getModShortData(data.mod)})`;
    }

    if (reason === 'ModEffect') {
        result += ` (ModEffect ${data.effect.type})`;
    }
    //
    // if (reason === 'Characteristic') {
    //     result += ` (Characteristic "${getCharacteristic(data.characteristic)}")`;
    // }

    return result;
}
