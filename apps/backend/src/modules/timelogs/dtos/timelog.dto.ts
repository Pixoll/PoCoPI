import { TransformToInstance } from "@decorators";
import { IsArray, IsBoolean, IsInt, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { TimelogEventDto } from "./timelog-event.dto";

export class TimelogDto {
    /**
     * The ID of the user.
     *
     * @example "12.345.678-9"
     */
    @MinLength(1)
    @IsString()
    public declare userId: string;

    /**
     * The ID of the test phase.
     *
     * @example 1
     */
    @Min(1)
    @IsInt()
    public declare phaseId: number;

    /**
     * The ID of the test question with respect to the phase ID.
     *
     * @example 2
     */
    @Min(1)
    @IsInt()
    public declare questionId: number;

    /**
     * Timestamp at which the timelog began recording.
     *
     * @example 1750270941600
     */
    @Min(0)
    @IsInt()
    public declare startTimestamp: number;

    /**
     * Timestamp at which the timelog stopped recording.
     *
     * @example 1750270950951
     */
    @Min(0)
    @IsInt()
    public declare endTimestamp: number;

    /**
     * Whether the user responded correctly.
     *
     * @example true
     */
    @IsBoolean()
    public declare correct: boolean;

    /**
     * Whether the question was skipped.
     *
     * @example false
     */
    @IsBoolean()
    public declare skipped: boolean;

    /**
     * How many times the user changed the selected option before sending/skipping.
     *
     * @example 0
     */
    @Min(0)
    @IsInt()
    public declare totalOptionChanges: number;

    /**
     * How many options the user hovered the mouse on.
     *
     * @example 1
     */
    @Min(0)
    @IsInt()
    public declare totalOptionHovers: number;

    /**
     * List of events recorded.
     */
    @ValidateNested()
    @TransformToInstance(TimelogEventDto, {}, { each: true })
    @IsArray()
    public declare events: TimelogEventDto[];
}
