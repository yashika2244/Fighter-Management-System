// import mongoose from "mongoose";

// const DutyAssignSchema = new mongoose.Schema({
//   dutyDate: { type: Date, required: true },
//   fromTime: { type: String, required: true },
//   toTime: { type: String, required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   dutyType: { type: String, enum: ["Naka Duty", "Minority Patroling", "Camp Security", "Camp Adm Duty", "OC Protection Duty"], required: true }
// }, { timestamps: true });

// export default mongoose.model("DutyAssign", DutyAssignSchema);

import mongoose from "mongoose";

const DutyAssignSchema = new mongoose.Schema(
  {
    dutyDate: { type: Date, required: true },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
      required: function () {
        return (
          this.dutyType === "Camp Security" || this.dutyType === "Camp Adm Duty"
        );
      },
      validate: {
        validator: function (value) {
          if (this.dutyType === "Camp Security") {
            return [
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
            ].includes(value);
          }
          if (this.dutyType === "Camp Adm Duty") {
            return [
              "Mess Duty",
              "CQMH Store",
              "Kote Commander Duty",
              "Tradesman Duty",
            ].includes(value);
          }
          return true; // no validation for other duty types
        },
        message: (props) =>
          `${props.value} is not a valid sub-category for ${props.instance.dutyType}`,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("DutyAssign", DutyAssignSchema);
