define(["jquery", "backbone", "models/setModel", "models/workoutModel","components/timer", "data/storageManager"],
	function ($, Backbone, SetModel, WorkoutModel, Timer, StorageManager) {
	    var TimerModel = Backbone.Model.extend({
	        initialize: function () {
	            this.workoutModel = new WorkoutModel();
	            this.timer = new Timer();
	            this.progressSec = 0;
	            this.currentSetIndex = 0;
	        },

	        defaults: function () {
	            return {
	                currentSet: new SetModel()
	            }
	        },

	        sync: function (method, model, options) {
	            var self = this;

	            if (method == "read") {
	                var deffered = this.workoutModel.fetch({ "id": options.id })
                        .done(function () {
                            self.workoutModel.setsCollection.fetch({ "workoutId": options.id });
                        })
                        .done(function () {
                            self.set("currentSet", self.workoutModel.setsCollection.at(0));
                        });
	                return deffered;
	            }
	        },

	        startTimer: function (fromBeginning, notifyCB) {
	            var self = this;
                
	            if (fromBeginning) {
	                this.progressSec = 0;
	                this.currentSetIndex = 0;
	                this.timer.reset();
	            }

	            if (this.currentSetIndex == this.workoutModel.setsCollection.length) {
	                alert("The workout is over!");
	                return;
	            }

	            this.set("currentSet", this.workoutModel.setsCollection.at(this.currentSetIndex));
	            console.log("next set");	            

	            var currentSetDuration = this.get("currentSet").get("Duration");

	            this.timer.setInterval(currentSetDuration, function (progressSec, isCompleted) {
	                self.progressSec = progressSec;
	                self.trigger("progressChanged", progressSec);

	                if (isCompleted) {
	                    self.progressSec = 0;
	                    self.currentSetIndex++;
	                    self.timer.reset();
	                    notifyCB().done(function () {
	                        self.startTimer(false, notifyCB);
	                    });	                    
	                }
	            });
	            
	        },

	        stopTimer: function () {
	            this.timer.stop();
	        },

	        pauseTimer: function () {
	            this.timer.pause();
	        },

	        resumeTimer: function () {
	            this.timer.resume();
	        }
	    });

	    return TimerModel;
	});