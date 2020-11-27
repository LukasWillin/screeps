import { Dictionary } from "lodash";
import IInstruction from "./activity.instruction.IInstruction";

/**
 * An instruction set is an unordered hash set of instructions.
 * 
 * { // IInstructionSet
 *    fnA: [function(...) {}, function(...){}, etc...], // IInstruction A
 *    fnB: [function(...) {}, function(...){}, etc...], // IInstruction B
 *    fnC: [function(...) {}, function(...){}, etc...]  // IInstruction C
 * }
 * 
 * @interface
 * @memberof module:activity/instruction
 * 
 * @augments Object<IInstruction>
 */
interface IInstructionSet extends Dictionary<IInstruction> {}

export default IInstructionSet;