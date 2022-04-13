export class Time {
  static SCALE = 1000;

  constructor(value = 0.0) {
    this.value = value;
  }

  get() {
    return parseFloat((this.value * Time.SCALE).toFixed(2));
  }

  getValue() {
    return this.value;
  }

  addTime(value) {
    this.value += value;

    return this.value;
  }

  compare(time) {
    return this.value === time.value ? 0 : this.value > time.value ? 1 : -1;
  }
}
