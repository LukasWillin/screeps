export default interface ICustomMemory extends Memory
{
    activities: any[],
    nextActivities: any[],
    initializedRooms: string[],
    creepIndex: number,
}