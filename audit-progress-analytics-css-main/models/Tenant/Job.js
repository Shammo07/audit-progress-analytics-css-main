const mongoose = require("mongoose");
//const Double = require('@mongoosejs/double');

const jobSchema = new mongoose.Schema({
  clientName: {
    type: String,
  },
  groupCompany: {
    type: String
  },
  createDate: {
    type: Date,
  },
  date: {
    type: Date,
  },
  fileReference: {
    type: String,
    required: [true, "File reference is required"],
    unique: true,
  },
  teamId:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },

  status: {
    type: String,
    default: "Pending"
  },
  budgetExpenses: {
    type:Number,
   // type: mongoose.Schema.Types.Decimal128,
  },
  actualExpenses: {
    type:Number,
    //type: mongoose.Schema.Types.Decimal128 ,
  },
  budgetApproved: {
    budget:Number,
    //budget: mongoose.Schema.Types.Decimal128 ,
    date: Date,
  },
  feeAgreedHKD: {
    //type: mongoose.Schema.Types.Decimal128  ,
    type:Number,
  },
  totalCostsLastYearHKD: {
    //type: mongoose.Schema.Types.Decimal128  ,
    type:Number,
  },
  feeLastYear: {
    //type: mongoose.Schema.Types.Decimal128 ,
    type:Number,
  },
  reviewedBy: {
    name: String,
    date: Date,
  },
  preparedBy: {
    initial: String,
    date: Date,
  },
  activities: [
    {
      name: String,
      budget:Number,
      hoursSpent: [
        {
          date:{type: Date, default: null},
          hours: Number,
          submittedIn135: Boolean,
        },
      ],
      doneBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: String,
    },
  ],
  chargeOutRates: [
    { 
      initial: String, 
      chargeOutRates:Number,
      createDate:Date
    },
  ],
  partnersBudgetUnitsAt: {
    unit: Number,
    fee: Number,
    total: Number,
  },
  partnersActualUnitsAt: {
    unit: Number,
    fee: Number,
    total: Number,
  },
  discussedWithClient: {
    fee: Number,
    date: Date,
  },
  revenue: {
    type: Number,
  },
  reviewedBy: {
    name: String,
    date: Date,
  },
  isSubmit:{
    type:Boolean,
    default:false
  },
  isApprove:{
    type:Boolean,
    default:false
  },
  isHistory:{
    type:Boolean,
    default:false,
  },
  oldBudgetUnits:{
    type:Number,
    default:0,
  },
  oldActualUnits:{
    type:Number,
    default:0,
  },
  over70EmailSent:{
    type:Boolean,
    default:false
  },
  over85EmailSent:{
    type:Boolean,
    default:false
  },
  over100EmailSent:{
    type:Boolean,
    default:false
  },
});

module.exports = jobSchema;
