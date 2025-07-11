export class EnvParser {
  constructor(envObj) {
    this.env = envObj;
  }

  readValue(name) {
    return this.env[name] ?? undefined;
  }

  /**
   * Parses an optional environment variable.
   * Rules:
   * * undefined | null => undefined
   * * empty string or whitespace => undefined
   * * non-empty string => trimmed string
   */
  parseOptionalString(name) {
    const value = this.readValue(name);
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        return trimmedValue;
      }
      return undefined;
    }
    return undefined;
  }

  /**
   * Parses a required environment variable.
   * Rules:
   * * undefined | null => undefined
   * * empty string or whitespace => undefined
   * * non-empty string => trimmed string
   */
  parseRequiredString(name, errorMessage) {
    const parsed = this.parseOptionalString(name);
    if (parsed === undefined) {
      throw new Error(
        errorMessage ?? `Environment variable "${name}" is required.`
      );
    }
    return parsed;
  }

  /**
   * Parses an optional environment variable as a number.
   * Rules:
   * * undefined | null => undefined
   * * empty string or whitespace => undefined
   * * non-empty string => parsed number if valid, otherwise throws an error
   */
  parseOptionalNumber(name) {
    const value = this.readValue(name);
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        const parsedValue = Number(trimmedValue);
        if (Number.isFinite(parsedValue)) {
          return parsedValue;
        }
        throw new Error(
          `The value of environment variable "${name}" is not a valid number. Value: "${value}".`
        );
      }
      return undefined;
    }
    return undefined;
  }

  /**
   * Parses a required environment variable as a number.
   * Rules:
   * * undefined | null => throws an error
   * * empty string or whitespace => throws an error
   * * non-empty string => parsed number if valid, otherwise throws an error
   */
  parseRequiredNumber(name, errorMessage) {
    const parsed = this.parseOptionalNumber(name);
    if (parsed === undefined) {
      throw new Error(
        errorMessage ?? `Environment variable "${name}" is required.`
      );
    }
    return parsed;
  }

  /**
   * Parses an optional environment variable as a boolean.
   * Rules:
   * * undefined | null => undefined
   * * empty string or whitespace => undefined
   * * non-empty string => 'true' (case-insensitive) => true, 'false' (case-insensitive) => false, otherwise throws an error
   */
  parseOptionalBoolean(name) {
    const value = this.readValue(name);
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        const trimmedLowerValue = trimmedValue.toLowerCase();
        if (trimmedLowerValue === 'true') {
          return true;
        } else if (trimmedLowerValue === 'false') {
          return false;
        } else {
          throw new Error(
            `The value of environment variable "${name}" is not a valid boolean. Value: "${value}".`
          );
        }
      }
      return undefined;
    }
    return undefined;
  }

  /**
   * Parses a required environment variable as a boolean.
   * Rules:
   * * undefined | null => throws an error
   * * empty string or whitespace => throws an error
   * * non-empty string => 'true' (case-insensitive) => true, 'false' (case-insensitive) => false, otherwise throws an error
   */
  parseRequiredBoolean(name, errorMessage) {
    const parsed = this.parseOptionalBoolean(name);
    if (parsed === undefined) {
      throw new Error(
        errorMessage ?? `Environment variable "${name}" is required.`
      );
    }
    return parsed;
  }

  /**
   * Parses an optional environment variable as JSON.
   * Rules:
   * * undefined | null => undefined
   * * empty string or whitespace => undefined
   * * non-empty string => parsed JSON if valid, otherwise throws an error
   */
  parseOptionalJSON(name) {
    let value = this.readValue(name);
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        const valueWithFixedQuotes = trimmedValue.replaceAll("'", '"');
        try {
          return JSON.parse(valueWithFixedQuotes);
        } catch (error) {
          throw new Error(
            `The value of environment variable "${name}" is not a valid JSON string. Value: "${value}".`,
            { cause: error }
          );
        }
      }
      return undefined;
    }
    return undefined;
  }

  /**
   * Parses a required environment variable as JSON.
   * Rules:
   * * undefined | null => throws an error
   * * empty string or whitespace => throws an error
   * * non-empty string => parsed JSON if valid, otherwise throws an error
   */
  parseRequiredJSON(name, errorMessage) {
    const parsed = this.parseOptionalJSON(name);
    if (parsed === undefined) {
      throw new Error(
        errorMessage ?? `Environment variable "${name}" is required.`
      );
    }
    return parsed;
  }
}
