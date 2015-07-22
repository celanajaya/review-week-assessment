var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date
  
});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
  var now = new Date();
  if (!this.due) return Infinity;
  else return this.due - now;
})

TaskSchema.virtual('overdue').get(function() {
  var now = new Date();
  return this.due > now
})

//methods

TaskSchema.methods.addChild = function(params) {
	params.parent = this._id;
	return Task.create(params);
}

TaskSchema.methods.getChildren = function() {
	return Task.find({parent: this._id}).exec();
}

TaskSchema.methods.getSiblings = function() {
	return Task.find({
		parent: this.parent,
		name: {$not: this.name}
	}).exec();
}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;