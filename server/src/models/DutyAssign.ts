import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type DutyType =
  | "Naka Duty"
  | "Minority Patroling"
  | "Camp Security"
  | "Camp Adm Duty"
  | "OC Protection Duty";

export interface IDutyAssign extends Document {
  dutyDate: Date;
  fromTime: string;
  toTime: string;
  user: Types.ObjectId;
  dutyType: DutyType;
  subCategory?: string;
}

const DutyAssignSchema = new Schema<IDutyAssign>(
  {
    dutyDate: { type: Date, required: true },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dutyType: {
      type: String,
      enum: [
        "Naka Duty",
        "Minority Patroling",
        "Camp Security",
        "Camp Adm Duty",
        "OC Protection Duty",
      ],
      required: true,
    },
    subCategory: {
      type: String,
      required: function (this: IDutyAssign) {
        return this.dutyType === "Camp Security" || this.dutyType === "Camp Adm Duty";
      },
      validate: {
        validator: function (this: IDutyAssign, value: string) {
          if (this.dutyType === "Camp Security") {
            return (
              [
                "Morcha no 1",
                "Morcha no 2",
                "Morcha no 3",
                "Morcha no 4",
                "Morcha no 5",
                "Morcha no 6",
                "Patrolling duty",
                "Duty SO",
                "Duty NCO",
                "COY QAT Duty",
              ] as const
            ).includes(value as any);
          }
          if (this.dutyType === "Camp Adm Duty") {
            return (
              [
                "Mess Duty",
                "CQMH Store",
                "Kote Commander Duty",
                "Tradesman Duty",
              ] as const
            ).includes(value as any);
          }
          return true;
        },
        message: (props: any) =>
          `${props.value} is not a valid sub-category for ${props.instance.dutyType}`,
      },
    },
  },
  { timestamps: true }
);

export const DutyAssign: Model<IDutyAssign> = mongoose.model<IDutyAssign>(
  "DutyAssign",
  DutyAssignSchema
);


