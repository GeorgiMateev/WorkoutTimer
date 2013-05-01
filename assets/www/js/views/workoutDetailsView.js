define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutDetailsView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },

            events: {
                "click #deleteWorkoutButton": function () { this.deleteWorkout() }
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
                this.template = _.template($("script#workoutDetailsTemplate").html(), { "model": this.model.toJSON() });

                this.$el.html(this.template);

                return this;
            }
        });

        return WorkoutDetailsView;
    });