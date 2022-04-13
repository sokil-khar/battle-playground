export function getBySign(value, sign, operand) {
  return sign === '%' || sign === true ? value * (operand / 100) : operand;
}

export function getUpdateStatValues(effects) {
  let sum = 0;
  let percentage = 0;

  for (const effect of effects) {
    if (effect.data.percentage) {
      percentage += effect.getAttributeValue();
    } else {
      sum += effect.getAttributeValue();
    }
  }

  return (value) => sum + getBySign(value, '%', percentage);
}
