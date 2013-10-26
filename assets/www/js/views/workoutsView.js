define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutsView = Backbone.View.extend({
            initialize: function () {
            },

            render: function () {
                this.template = _.template($("script#workoutsTemplate").html(), { "collection": this.collection });

                this.$el.html(this.template);

                this.$el.trigger("pagecreate");

                return this;
            }
        });

        return WorkoutsView;
    });