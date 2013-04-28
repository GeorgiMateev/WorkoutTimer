define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutFormView = Backbone.View.extend({
            initialize: function () {
                this.render();
            },

            events: {
                "click #submitFormButton": function () { console.log("save button clicked"); this.submitForm() }
            },

            render: function () {
                this.template = _.template($("script#workoutFormTemplate").html(), { "model": this.model.toJSON() });

                this.$el.html(this.template);

                return this;
            },

            submitForm: function () {
                console.log("submit form method called");
                var attributes = {
                    "Name": this.$("#nameTextBox").val(),
                    "Description": this.$("#descriptionTextBox").val()
                }
                $.mobile.loading("show");
                this.model.save(attributes, {
                    success: function (model, insertID, options) {
                        console.log("save success");
                        $.mobile.loading("hide");
                        window.app_router.navigate("workoutDetails?" + model.get("_id"), { trigger: true, replace: true });
                    }
                });
            }
        });

        return WorkoutFormView;
    });