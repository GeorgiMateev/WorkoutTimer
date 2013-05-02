define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var SetDetailsView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },

            events: {
                "click #deleteSetButton": function () { this.deleteSet() }
            },

            deleteSet: function () {
                $.mobile.loading("show");

                var id = this.model.get("_id");
                var workoutId = this.model.get("Workout_id");

                this.model.destroy({
                    success: function (model, deleteId, options) {
                        $.mobile.loading("hide");
                        window.app_router.navigate("#workoutDetails?" + workoutId, { trigger: true, replace: true });
                    },
                    "id": id
                });
            },

            render: function () {
                var jsonModel = this.model.toJSON();

                this.template = _.template($("script#setDetailsTemplate").html(), { "model": jsonModel });

                this.$el.html(this.template);

                return this;
            }
        });

        return SetDetailsView;
    });