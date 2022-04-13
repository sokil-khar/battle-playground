/* eslint-disable no-undef */
/**
 * @param options {Object.<string, number>} Options for random pick and their percentage to be selected
 * @returns {string} Random selected option
 */
export function pickOption(options) {
  const random = new R.Random();

  const array = Object.entries(options).reduce(
    (c, [option, percentage]) => c.concat(Array.from({ length: percentage }, () => option)),
    []
  );
  return random.pick(random.shuffle(array));
}

/**
 * @param percentage {number} Percentage for checking
 * @returns {boolean} Random result for this percentage
 */
export function checkPercentage(percentage) {
  const random = new R.Random();
  const value = random.integer(1, 100);

  return value <= Number(percentage);
}

export function pickItems(items, count) {
  const random = new R.Random();

  const result = [];
  for (let i = 0; i < count; i += 1) {
    result.push(random.pick(items));
  }

  return result;
}

export function pickItem(items) {
  return pickItems(items, 1)[0];
}

export function shuffle(items) {
  const random = new R.Random();

  return random.shuffle(items);
}

export function pickByProbability(items) {
  const random = new R.Random();

  const totalProbability = items.reduce((a, c) => a + c.probability, 0);
  const randomProbability = random.real(0, totalProbability, true);

  const shuffled = random.shuffle(items);
  let threshold = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const item of shuffled) {
    threshold += item.probability;

    if (threshold >= randomProbability) return item;
  }

  return null;
}
