define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutDetailsView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },

            events: {
                "click #deleteWorkoutButton": function () { this.confirmDeleteWorkout() }
            },

            confirmDeleteWorkout: function () {
                var self = this;

                var name = this.model.get("Name");
                navigator.notification.confirm("Do you want to delete " + name + "?",
                        function (buttonIndex) {
                            if (buttonIndex == 1) {
                                self.deleteWorkout();
                                window.history.back();
                            }
                        },
                    "Delete " + name,
                    "Yes,No");                
            },

            deleteWorkout: function () {
                $.mobile.loading("show");

                var id = this.model.get("_id");

                this.model.destroy({
                    success: function (model, deleteId, options) {
                        $.mobile.loading("hide");
                        window.app_router.navigate("", { trigger: true, replace: true });
                    },
                    "id": id
                });
            },

            render: function () {
                var jsonModel = this.model.toJSON();
                var jsonSets = [];

                if(this.model.setsCollection) jsonSets = this.model.setsCollection.toJSON();

                this.template = _.template($("script#workoutDetailsTemplate").html(), { "model": jsonModel, "sets": jsonSets});

                this.$el.html(this.template);

                if (jsonSets.length == 0) {
                    $("#startWorkoutButton").hide();
                }

                return this;
            }
        });

        return WorkoutDetailsView;
    });