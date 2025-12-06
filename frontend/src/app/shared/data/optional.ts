export class Optional<T> {
  private constructor(private readonly value: T | null | undefined) {}

  static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Optional.of() cannot be called with null or undefined');
    }
    return new Optional(value);
  }

  static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return new Optional(value);
  }

  static empty<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  isPresent(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  isEmpty(): boolean {
    return this.value === null || this.value === undefined;
  }

  get(): T {
    if (this.value === null || this.value === undefined) {
      throw new Error('No value present');
    }
    return this.value;
  }

  orElse(other: T): T {
    return this.value !== null && this.value !== undefined ? this.value : other;
  }

  toString(): string {
    return this.isPresent() ? `Optional[${this.value}]` : 'Optional.empty';
  }
}
