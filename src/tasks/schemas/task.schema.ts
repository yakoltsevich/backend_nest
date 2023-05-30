import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true, ref: "User", type: Types.ObjectId })
  userId;
  @Prop({ required: true })
  text: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);