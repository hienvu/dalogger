import { describe, it } from 'node:test';
import assert from 'node:assert';
import helloWorld, { cheerio } from '../src/index';

describe('helloWorld', () => {
  it('should return "Hello World"', () => {
    const result = helloWorld();
    assert.strictEqual(result, 'Hello World');
  });

  it('should return a string', () => {
    const result = helloWorld();
    assert.strictEqual(typeof result, 'string');
  });

  it('should not return null or undefined', () => {
    const result = helloWorld();
    assert.ok(result);
    assert.notStrictEqual(result, null);
    assert.notStrictEqual(result, undefined);
  });
});

describe('cheerio', () => {
  it('should return a string', () => {
    const result = cheerio();
    assert.strictEqual(typeof result, 'string');
  });
});
