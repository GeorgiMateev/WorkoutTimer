define(["jquery", "backbone", "models/setModel", "durationFlipBox"],
    function ($, Backbone, SetModel, DurationFlipBox) {
        var SetFormView = Backbone.View.extend({
            initialize: function () {
                if (this.model) {
                    //this.model.on("change", this.render, this);
                    this.model.on("invalid", this.showValidationMessage, this);
                }
            },

            events: {
                "click #submitSetFormButton": function () { this.submitForm() }
            },

            render: function () {                
                this.template = _.template($("script#setFormTemplate").html(), { "model": this.model.toJSON(), "$": $});

                this.$el.html(this.template);

                //restyle the widgets in the template
                this.$el.trigger("pagecreate");

                $("#setTypeChoise").val(this.model.get("Type")).selectmenu("refresh");
                
                $('#setDuration').trigger('datebox', { 'method': 'dooffset', 'type': 's', 'amount': this.model.get("Duration") }).trigger('datebox', { 'method': 'doset' });

                return this;
            },

            submitForm: function () {
                var self = this;

                $(".validation-message").hide();

                var attributes = {
                    "Name": this.$("#setNameTextBox").val(),
                    "Description": this.$("#setDescriptionTextBox").val(),
                    "Duration": this.model.parseTime(this.$("#setDuration").val()),
                    "Type": this.$("#setTypeChoise").val()
                }

                $.mobile.loading("show");

                this.model.save(attributes, {
                    success: function (model, insertID, options) {
                        $.mobile.loading("hide");
                        window.app_router.navigate("workoutDetails?" + model.get("Workout_id"), { trigger: true, replace: true });
                    },
                    error: function () {
                        console.log("save error callback called");
                        self.$el.trigger("pagecreate");
                        $.mobile.loading("hide");
                    }
                });
            },

            showValidationMessage: function (model, errors) {
                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    if (error.field == "Name") {
                        $("#setNameValidationMessage").text(error.message);
                        $("#setNameValidationMessage").show();
                    }
                    else if (error.field == "Duration") {
                        $("#setDurationValidationMessage").text(error.message);
                        $("#setDurationValidationMessage").show();
                    }    
                }
            }
        });

        return SetFormView;
    });