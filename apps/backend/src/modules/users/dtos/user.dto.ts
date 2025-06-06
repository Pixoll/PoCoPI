import { IsUndefinedIf } from "@decorators";
import { config } from "@pocopi/config";
import { IsBoolean, IsEmail, IsIn, IsInt, IsString, Min, MinLength } from "class-validator";

export class UserDto {
    @IsBoolean()
    public declare anonymous: boolean;

    @MinLength(1)
    @IsString()
    public declare id: string;

    @IsIn(config.groupLabels)
    @IsString()
    public declare group: string;

    @MinLength(1)
    @IsString()
    @IsUndefinedIf((user: UserDto) => user.anonymous, {
        message: "$property should not be provided if user is anonymous.",
    })
    public declare name?: string;

    @IsEmail()
    @MinLength(1)
    @IsString()
    @IsUndefinedIf((user: UserDto) => user.anonymous, {
        message: "$property should not be provided if user is anonymous.",
    })
    public declare email?: string;

    @Min(0)
    @IsInt()
    @IsUndefinedIf((user: UserDto) => user.anonymous, {
        message: "$property should not be provided if user is anonymous.",
    })
    public declare age?: number;
}
