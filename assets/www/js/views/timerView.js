define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var TimerView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                    this.model.on("progressChanged", this.updateProgess, this);
                }
            },

            events: {
                "click #pauseTimerButton": function () { this.pauseTimer() },
                "click #resumeTimerButton": function () { this.resumeTimer() }
            },
            
            render: function () {
                var jsonModel = this.model.toJSON();
                var jsonSet = null;
                var jsonWorkout = null;

                if (this.model.has("currentSet")) jsonSet = this.model.get("currentSet").toJSON();
                if (this.model.workoutModel) jsonWorkout = this.model.workoutModel.toJSON();
                
                this.template = _.template($("script#timerViewTemplate").html(), {"model": jsonModel, "workout": jsonWorkout, "set": jsonSet });

                this.$el.html(this.template);

                $("#resumeTimerButton").hide();
                this.$el.trigger("create");                

                return this;
            },

            updateProgess: function (progressSec) {
                $("#timer-progress").text(progressSec);
            },

            pauseTimer: function () {
                $("#pauseTimerButton").hide();
                $("#resumeTimerButton").show();
                this.model.pauseTimer();                
            },

            resumeTimer: function () {
                $("#resumeTimerButton").hide();
                $("#pauseTimerButton").show();
                this.model.resumeTimer();                
            }
        });

        return TimerView;
    });