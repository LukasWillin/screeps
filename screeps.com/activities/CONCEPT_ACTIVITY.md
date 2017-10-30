

#Concept of the Activity System


## Activity > activity/activity.js
Is the object to create and mutate data-object instances of an activity.
An activity is a function called on a host until shes complete.

___Activity___________________
create()

### Activity:DataObject > activity/activity.js
The DataObject represents an Activity without any functionality.
Functionality is provided through the Activity object

___DataObject:Activity________
{string} roomID 			- The room ID from which the activity is created or is executed in.
												It is considered the execution environment.
{string} hostID 			- ID of the host able to execute the Activity. Must be found by Game.getObjectByID()
{Object} args 				- Arguments that the executing host should use.
{number} creationTime - Time (Ticks) when the activity was created.
{number} type 				- Type of the activity.
{number} id 					- ID of the activity.
{Object} data 				- an object in which the host can store data.
{string} customMethod - A method called when type is a non standard type >> ANY

## ActivitySystem > activity/system.js
The system which manages the activity data-objects.
Activities should only be created and mutated through this system so it can track
any changes.

___ActivitySystem_____________
create() 		- Creates a new managed Activity
execute() 	- Execute the activity with provided ID.
							An execution method must accept 2 Objects as arguments like so:
								(argsByCopy, dataByRef)
							and can return a roomID which (if provided) will replace the old roomID.
complete() 	- Completing the activity with ID and makes it inaccessible.
							The system handles the activity as successfully finished.
abort()			- Aborts the activity with ID and makes it inaccessible.
							An aborted activity means the activity did not finish successfully.


### Controlled Data
A list of activity data objects stored in memory:
package := activity
[PRIVATE][package]['system'] > MemoryObject
['activities'] > Object : Key=activityID, Activity:DataObject

## ActivityScheduler > activity/scheduler.js
The activity scheduler manages a list of active activities.
The scheduler desides when an activity is executed and how often based on
the availability of cpu and other ressources.
The scheduler runs always and can not be interacted with.

___ActivityScheduler__________
-

### List:Activity:ID
The scheduler manages a list of activity ids with the following fields
id : { 	{number} prevCpu,
				{number} allTimeCpu,
				{number} firstExecutionTick,
				{number} prevExecutionTick,
				{number} executionCount,
				{number} prevPriorityScore,
			 	{Object {state:Object} states
					- A state is a pair of stateConstant : informationObject
}

# Cycle of an activity

1> ActivitySystem.create() creates a new activity.
2> ActivitySystem.create() storing the new activity.
3> ActivitySystem.create() forwarding the activityID to the scheduler.

4> Scheduler calling ActivitySystem.execute(activityID) to execute an activity ID.
5> ActivitySystem.execute() calling the host method provided with the activity
		giving args and data object by reference to the host.
6> Host.method() returns the roomID if he wants to change it.

7> The scheduler watches the resource usage and updates its list of activities.
