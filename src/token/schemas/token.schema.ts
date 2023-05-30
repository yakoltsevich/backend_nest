import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ required: true, ref: "User", type: Types.ObjectId })
  userId;
  @Prop({ type: String, required: true })
  refreshToken;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
