
# Rules
## Package Rules
Packages should always follow these rule:
	- [NameOf DataObject].js
	- system.js (... managing the data object inside the same package)
	or
	- [NameOf ManagedSource].js (contains an object called "[NameOf ManagedSource]Util.js")

Where ever possible you should only work with the data objects through the
system's api.

Use the word 'host' for objects handling an activity.
Use the word 'handlerFunction' for functions taking the activity.

# Idea
## Activities
An activity is a little bit like a process in a computer system. Its a standardized way
for the scheduler to do his work.
An activity contains information about the progress of a task and additional information
such as the room which created it allow for prioritization of the activity.
The Activity object contains a lot of constants that are used to pass the activity
and optional arguments to the handling objects such as a creep.
There is a special constant which allows the creator to let an activity be handled differently
then the standard allows. Which is the number 0. Like so a custom function can be set.
Some activities can be static and require a custom function. Static activities
dont have progression are called as long the handler exists.

## Scheduler
Managing the list of activities by priority. Then calling activities as long
as the cpu constraints allow it.
The scheduler is also accountable for managing the cpu constraints:
- During peacefull times try to save up cpu
- When being attacked or atting others use little more cpu than allowed.
- Use the cpu only for important activities. This partially requires that all object registering activities try to be honest
 	and consciously when providing an importancy factor

# Uploading to screeps
Before uploading changes to screeps:
Create a new txt file into which you copy all parts directly. After that create
a minified version of it which you then upload to screeps.
Store the full text and the minified version in the version folder after uploading to screeps.com.

File name: "Activities_V-major.minor.patch" /+ "minified"

Add a Readme.md with the changes.
