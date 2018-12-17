class ObjectSystem {

    /**
     * Get any object by id with extended prototype for more functionality.
     * @param  {string} objectID Id of the game object.
     * @return {Object}          The object with extended prototype.
     */
    static getObjectById(objectID) {

        // Get the object for id
        var obj = Game.getObjectById(objectID);

        // TODO: Get the type of the object and...
        // TODO: ...extend its prototype if needed
        if (obj !== undefined) {
            if (obj instanceof Creep) {

            } else if (obj instanceof Structure) {
                if (obj instanceof StructureContainer) {
                    // TODO obj = ControllerExtension.extend(obj);
                }

            } else if (obj instanceof Room) {

            } else if (obj instanceof RoomObject) {

            }
            // Return the object.
            return obj;
        } else {
            throw {
                name: "NoSuchIdError",
                message: "There is no active object with id: ".concat(id)
            };
        }
    }

    static _hasExtendedPrototype(object) {

    }

    static _extendCreepPrototype() {

    }

    static getNewObjectId(className) {
        if (ObjectSystem.memory.idNrs[className] === undefined)
            ObjectSystem.memory.idNrs[className] === 0;
        ObjectSystem.memory.idNrs[className] = (ObjectSystem.memory.idNrs[className] + 1) % 1000;
        return (ObjectSystem.memory.idNrs[className] * 10000) + (Math.floor(Math.random() * 10000));
    }
}
ObjectSystem.memory = MemoryUtil.get('ObjectSystem');

module.exports = ObjectManager;
