define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutFormView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },

            events: {
                "click #submitFormButton": function () { this.submitForm() }
            },

            render: function () {
                this.template = _.template($("script#workoutFormTemplate").html(), { "model": this.model.toJSON() });

                this.$el.html(this.template);

                return this;
            },

            submitForm: function () {
                var attributes = {
                    "Name": this.$("#nameTextBox").val(),
                    "Description": this.$("#descriptionTextBox").val()
                }
                $.mobile.loading("show");
                this.model.save(attributes, {
                    success: function (model, insertID, options) {
                        $.mobile.loading("hide");
                        window.app_router.navigate("workoutDetails?" + model.get("_id"), { trigger: true, replace: true });
                    }
                });
            }
        });

        return WorkoutFormView;
    });