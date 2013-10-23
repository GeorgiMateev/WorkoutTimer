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

                //reenchance the jquery mobile widgets
                if (this.$el.hasClass("ui-page")) {
                    this.$el.trigger("pagecreate");
                }

                return this;
            },

            updateProgess: function (progressSec) {
                var duration = this.model.get("currentSet").get("Duration");
                var displayStr = this.model.get("currentSet").getTimeDisplayString(duration - progressSec);

                $("#timer-progress").text(displayStr);
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
            },

            confirmExit: function () {
                var self = this;
                navigator.notification.confirm("Do you want to give up?",
                        function (buttonIndex) {
                            if (buttonIndex == 1) {
                                self.model.stopTimer();
                                window.history.back();
                            }
                        },
                    "Give up",
                    "Yes,No");
            }
        });

        return TimerView;
    });