import { describe, it, expect } from 'vitest';
import { NameGenerator } from '../src/generator/index';

describe('NameGenerator', () => {
  it('should generate candidates using seed', () => {
    const config = {
      roots: ['omni', 'flex', 'nova'],
      suffixes: ['io', 'ify', 'gen'],
      seed: 42,
      count: 3
    };
    const generator = new NameGenerator(config);
    const results = generator.generate();

    expect(results.length).toBe(3);
    
    // Test determinism
    const generator2 = new NameGenerator(config);
    const results2 = generator2.generate();
    
    expect(results[0].value).toBe(results2[0].value);
    expect(results[1].value).toBe(results2[1].value);
    expect(results[2].value).toBe(results2[2].value);
  });

  it('should not generate more than possible combinations', () => {
    const config = {
      roots: ['a'],
      suffixes: ['b', 'c'],
      count: 10
    };
    const generator = new NameGenerator(config);
    const results = generator.generate();

    expect(results.length).toBe(2);
  });
});
