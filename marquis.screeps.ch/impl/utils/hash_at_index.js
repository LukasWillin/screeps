
/**
 * Its not guaranteed for the key to be at the expected index.
 * @param {object} obj 
 * @param {int} i 
 */
function hash_at_index(obj, i)
{
    return Object.keys(obj)[i];
}

module.exports = hash_at_index;