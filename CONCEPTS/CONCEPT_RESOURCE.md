
# ResourceSystem > resource/system.js
The resource system keeps track of all resources and provides access points
by means of availability of specific ressources.
A resource (location) should be retrieved only through this system so it can track
availability and usage of certain resources.

The resource system also will notify the activity scheduler when a certain
resource could be provided or not with a pair { resourceName: available {boolean} }.
This will cause the scheduler to set the currently active activity as waiting for
the resource that in the end wasnt made available to the activity.

## What is a resource
A resource can be everything that is required for an activity to be executed.
For example a creep that is required to transport other items is a resource.

## Requesting resources
A caller can request a resource. The system will check availability when given
some arguments.
If the system cannot find a resource meeting the requirements given by args it will
return undefined. The caller may then decide to request again with different arguments.
Only the last result from requesting a resource is decisive to the scheduler.

## Owning resources
An object may claim resources "TRANSLATE fest/beständig/bleibend". For example a LogistikSystem may create and claim
creeps.
Claimed resources are unavailable to other callers requesting a resource but the
resource system might ask the owner if the resource can be made temporarily available.


___ResourceSystem____________
The caller must always pass an ID. The ID can be from another object.
claim() - Claim a resource either given an ID or by giving enough arguments so the system
					can find matching resources.
					  If the ID is not already managed it will be added to the managed IDs silently
					unless the object referenced by the id is not suitable as resource. The
					resource system will then refuse the claim() by returning a constant.
					  The resource system returns an object with the ID of the resource
					and a constant of the following:
					CLAIMED >> returns given ID
					REFUSED >> returns given ID
					NOT_A_RESOURCE >> returns given ID
					FOUND_CLAIMABLE >> returns ID of applicable resource object
					NO_SUCH_CLAIMABLE >> returns ID = null
					  For some resources a claim might be only partially. For example an energy
					container might only be claimed up to a certain amount of energy.
					For containers the claim will only be granted if there is enough of the resource
					available at the time of the claim request. The system will then virtually
					calculate a new capacity.
get() 	- Returns the resource without changing the claimed state. An unclaimed object will
					be returned and is available for one tick by creating a temporary claim
					if not already claimed by the caller.
release() - Releases all claims from caller ID
