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

            deleteWorkout: function () { },

            render: function () {
                var jsonModel = this.model.toJSON();

                this.template = _.template($("script#setDetailsTemplate").html(), { "model": jsonModel });

                this.$el.html(this.template);

                return this;
            }
        });

        return SetDetailsView;
    });