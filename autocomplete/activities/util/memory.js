
/**
 * This is a util to manage the memory.
 * Get a reference to a memory object by calling 'getMemory'
 *
 * The util will build a directory structure like so:
 * [package][standard][custom][identifier]
 *
 * An Alias can be set so that the memory is moved before returned.
 *
 * @class
 */
class MemoryUtil {

    /**
     * Get Memory bye class and/or id.
     * An alias can be set to move memory to a new location.
     * The alias should be dot seperated composition like "className[.instanceID]".
     * The alias resembles the old path.
     * @param  {string} className - Name of the class.
     * @param  {string} intanceID optional - Identifier of the class instance.
     * @param  {string} alias optional - Old alias path.
     * @return {Object} - The Memory object reference. All changes in this object
     *      will be written to memory and available in all other ticks.
     */
    static get(className, intanceID, alias) { }
}
