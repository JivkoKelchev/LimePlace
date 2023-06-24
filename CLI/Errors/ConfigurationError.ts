export default class ConfigurationError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}