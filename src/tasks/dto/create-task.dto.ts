import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTaskDto {
  @IsString({ message: "Should be a string" })
  @ApiProperty({ example: "usual text", description: "Text" })
  text: string;
  @IsString({ message: "Should be a string" })
  @ApiProperty({ example: "6473d1f2c52f982cfe3eb5ab", description: "ID" })
  userId: string;
}
