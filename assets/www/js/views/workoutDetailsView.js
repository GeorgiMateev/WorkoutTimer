define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutDetailsView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },
            render: function () {
                this.template = _.template($("script#workoutDetailsTemplate").html(), { "model": this.model.toJSON() });

                this.$el.html(this.template);

                return this;
            }
        });

        return WorkoutDetailsView;
    });