import "../src/decorators.js";

using TypeSpec.Reflection;

namespace TypeSpec;

/**
 * Indicates that the decoratored property should be treated as a class variable,
 * rather than an instance variable.
 *
 * @example
 * ```typespec
 * model Pet {
 *   @classVariable
 *   species: string;
 * }
 * ```
 */
extern dec classVariable(target: ModelProperty);
