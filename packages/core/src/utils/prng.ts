export class PRNG {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 0x100000000);
  }

  // Linear Congruential Generator
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 0x100000000;
    return this.seed / 0x100000000;
  }

  // Random item from array
  pick<T>(array: T[]): T {
    if (array.length === 0) throw new Error("Cannot pick from empty array");
    const index = Math.floor(this.next() * array.length);
    return array[index];
  }
}
