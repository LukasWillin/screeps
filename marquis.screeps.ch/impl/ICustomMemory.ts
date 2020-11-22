export default interface ICustomMemory extends Memory
{
    activities: any[];
    nextActivities: any[];
    suspendedActivities: any[];
    initializedRooms: string[];
    creepIndex: number;
    exceptions: any[];
}