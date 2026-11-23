type SerializedValue =
  | { __type: 'Date'; value: string }
  | { __type: 'Map'; value: [unknown, unknown][] }
  | { __type: 'Set'; value: unknown[] };

export class JsonHelper {
  /**
   * Deeply clones an object, preserving Date, Map, and Set.
   * @param obj Object to clone
   * @returns Cloned object
   */
  public static clone<T>(obj: T): T {
    return JSON.parse(
      JSON.stringify(obj, this.replacer),
      this.reviver
    );
  }

  /**
   * Formats a JSON object as a pretty-printed string.
   * @param obj Object to format
   * @returns Formatted JSON string
   */
  public static pretty<T>(obj: T): string {
    return JSON.stringify(obj, null, 2);
  }

  /**
   * Custom replacer function for JSON serialization
   */
  private static replacer(key: string, value: unknown): unknown {
    if (value instanceof Date) return { __type: 'Date', value: value.toISOString() };
    if (value instanceof Map) return { __type: 'Map', value: Array.from(value.entries()) };
    if (value instanceof Set) return { __type: 'Set', value: Array.from(value) };
    return value;
  }

  /**
   * Custom reviver function for JSON deserialization
   */
  private static reviver(key: string, value: unknown): unknown {
    if (this.isSerialized(value)) {
      switch (value.__type) {
        case 'Date': return new Date(value.value);
        case 'Map': return new Map(value.value);
        case 'Set': return new Set(value.value);
      }
    }
    return value;
  }

  private static isSerialized(value: unknown): value is SerializedValue {
    return !!value
      && typeof value === 'object'
      && '__type' in value
      && (value.__type === 'Date' || value.__type === 'Map' || value.__type === 'Set');
  }
}
