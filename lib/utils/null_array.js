module.exports = class NullArray {
  constructor() {
    if (arguments.length) {
      this.value = [...arguments];
    }
  }

  push(item) {
    this.value = this.value || [];
    this.value.push(item);
  }
};