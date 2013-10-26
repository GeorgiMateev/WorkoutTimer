define(["jquery", "backbone", "models/workoutModel"],
    function ($, Backbone, WorkoutModel) {
        var WorkoutFormView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    //this.model.on("change", this.render, this);
                    this.model.on("invalid", this.showValidationMessage, this);
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
                var self = this;

                $(".validation-message").hide();

                var attributes = {
                    "Name": this.$("#nameTextBox").val(),
                    "Description": this.$("#descriptionTextBox").val()
                }                

                $.mobile.loading("show");

                this.model.save(attributes, {
                    success: function (model, insertID, options) {
                        $.mobile.loading("hide");

                        if (!self.mode) return;

                        if (self.mode == "create") {
                            window.app_router.navigate("workoutDetails?" + model.get("_id"), { trigger: true, replace: true });
                        }
                        else if (self.mode == "edit") {
                            window.history.back();
                        }                        
                    },
                    error: function (model, xhr, options) {
                        console.log("save error callback called");                        
                        self.$el.trigger("pagecreate");
                        $.mobile.loading("hide");
                    }
                });
            },

            showValidationMessage: function (model, error) {
                console.log("show validation message with error: "+error);
                $("#workoutNameValidationMessage").text(error);
                $("#workoutNameValidationMessage").show();
            }
        });

        return WorkoutFormView;
    });