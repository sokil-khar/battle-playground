import { StatsData } from '../data/constants';

export function secondFormatter(params) {
  return `${params.value}%/s`;
}

export function percentageFormatter(params) {
  return `${params.value}%`;
}

export function emptyFormatter(params) {
  return params.value === undefined || Number.isNaN(params.value) ? '—' : params.value;
}

export function decimalFormatter(value) {
  if (isNaN(value)) return value;

  return typeof value === 'number' ? value.toFixed(2) : value;
}

const attributeAbbr = {
  damagePerFire: 'DMG',
  reload: 'SPD',
  fireRate: 'FR',
};

export function traitFormatter(trait) {
  if (!trait) return '-';

  switch (trait.action) {
    case 'addValue': {
      const { attributeName, attributeValue } = trait.data;

      const statData = StatsData[attributeName];
      if (!statData) return '-';

      const sign = attributeValue > 0 ? '+' : attributeValue < 0 ? '-' : '';
      return `${sign} ${Math.abs(attributeValue)}${
        statData.sign || ''
      } ${attributeName.toUpperCase()}`;
    }

    case 'addPercentage': {
      const { attributeName, attributeValue } = trait.data;

      const statData = StatsData[attributeName];
      if (!statData) return '-';

      const sign = attributeValue > 0 ? '+' : attributeValue < 0 ? '-' : '';

      return `${sign} ${Math.abs(attributeValue)}% ${attributeName.toUpperCase()}`;
    }

    case 'addWeaponPercentage': {
      const { attributeName, attributeValue } = trait.data;

      const sign = attributeValue > 0 ? '+' : attributeValue < 0 ? '-' : '';

      return `${sign} ${Math.abs(attributeValue)}% ${attributeAbbr[
        attributeName
      ].toUpperCase()} (to all weapons)`;
    }

    case 'addWeaponDamageByType': {
      const { attributeName, attributeValue } = trait.data;

      const sign = attributeValue > 0 ? '+' : attributeValue < 0 ? '-' : '';

      return `${sign} ${Math.abs(attributeValue)}% ${attributeName} Damage`;
    }

    default:
      return '-';
  }
}
