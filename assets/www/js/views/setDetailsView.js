define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var SetDetailsView = Backbone.View.extend({
            initialize: function () {
            },

            events: {
                "click #deleteSetButton": function () { this.confirmDeleteSet() }
            },

            changeModel: function (newModel) {
                this.model = newModel;

                //Attach event to the new model
            },

            set_collection: function (collection) {
                this.collection = collection;
            },

            confirmDeleteSet: function () {
                var self = this;

                var name = this.model.get("Name");
                navigator.notification.confirm("Do you want to delete " + name + "?",
                        function (buttonIndex) {
                            if (buttonIndex == 1) {
                                self.deleteSet();
                                window.history.back();
                            }
                        },
                    "Delete " + name,
                    "Yes,No");
            },

            deleteSet: function () {
                $.mobile.loading("show");

                var id = this.model.get("_id");
                var workoutId = this.model.get("Workout_id");

                this.model.destroy({
                    success: function (model, deleteId, options) {
                        self.collection.remove(model);
                        $.mobile.loading("hide");
                        window.app_router.navigate("#workoutDetails?" + workoutId, { trigger: true, replace: true });
                    },
                    "id": id
                });
            },

            render: function () {
                this.model.initDurationDisplayValue();

                var jsonModel = this.model.toJSON();

                this.template = _.template($("script#setDetailsTemplate").html(), { "model": jsonModel });

                this.$el.html(this.template);                

                //restyle the widgets in the template
                this.$el.trigger("pagecreate");

                return this;
            }
        });

        return SetDetailsView;
    });