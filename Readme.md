
# A scheduling library for [screeps.com](https://screeps.com/)
Check out the MMO for devs at https://screeps.com/  🙌

# Idea Outline
## Activity
An activity is a little bit like a process in a computer system. Its a standardized way
for the scheduler to do his work.
An activity implements a static set of instructions.

## Instruction
And instruction is an ordered list of one or many instruction functions.
The Kernel will call them one by one.
While very simple instructions may only contain 1 function, instructions which need to run for a longer time however
can be preempted after one function before the next is being called.
Instructions are provided with a persistent memory object and a cache object as well as the activity entity. The cache can be used to prevent recalculations between instructions within a single tick.

## Instruction Function
An instruction function has a defined signature and is called by the kernel.
Functions from the same instruction share a scope and cache object as well as have access to
the activity memory object.

## Scheduler
Managing the list of activities and prioritize priority.
The scheduler is also accountable for managing the cpu constraints.

## Kernel
The kernel executes activities depending on the prioritization of the scheduler.
It needs to keep track of usage stats and persist activities and provide instruction function with required
data structures.
The kernel needs to be able to resume an activity and its instructions.