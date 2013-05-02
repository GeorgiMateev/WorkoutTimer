define(["jquery", "backbone", "models/setModel"],
    function ($, Backbone, SetModel) {
        var SetFormView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    this.model.on("change", this.render, this);
                }
            },

            events: {
                "click #submitSetFormButton": function () { this.submitForm() }
            },

            render: function () {                
                this.template = _.template($("script#setFormTemplate").html(), { "model": this.model.toJSON()});

                this.$el.html(this.template);

                return this;
            },

            submitForm: function () {
                var attributes = {
                    "Name": this.$("#setNameTextBox").val(),
                    "Description": this.$("#setDescriptionTextBox").val()
                }
                $.mobile.loading("show");
                this.model.save(attributes, {
                    success: function (model, insertID, options) {
                        $.mobile.loading("hide");
                        window.app_router.navigate("workoutDetails?" + model.get("Workout_id"), { trigger: true, replace: true });
                    }
                });
            }
        });

        return SetFormView;
    });