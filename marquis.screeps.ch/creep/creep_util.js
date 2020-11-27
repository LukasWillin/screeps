const _find = require('lodash/find');

function creep_util(claimId, type, id, factory)
{
    let creep = null;
    
    if (id)
        // Find an unclaimed or with 'claimId' creep by 'id'
        creep = _find(Game.creeps, (c) => 
            c.id === id &&
            (!c.memory.claimId || c.memory.claimId === claimId));
    else
        // Find an unclaimed or with 'claimId' creep by 'type'
        creep = _find(Game.creeps, (c) => 
            c.type === type &&
            (!c.memory.claimId || c.memory.claimId === claimId));
    
    // If no suitable creep found create a new one
    if (!creep)
        creep = factory();

    // Claim the creep for 'claimId'
    if (!creep.memory.claimId)
        creep.memory.claimId = claimId;

    return creep;
}

module.exports = creep_util;