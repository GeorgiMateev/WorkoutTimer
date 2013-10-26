define(["jquery",
    "backbone",
    "models/workoutModel",
    "models/setModel",
    "models/timerModel",
    "collections/workoutsCollection",
    "views/workoutsView",
    "views/workoutDetailsView",
    "views/workoutFormView",
    "views/setFormView",
    "views/setDetailsView",
    "views/timerView",
    "jquerymobile"],

	function ($, Backbone, WorkoutModel, SetModel, TimerModel, WorkoutsCollection, WorkoutsView, WorkoutDetailsView, WorkoutFormView, SetFormView, SetDetailsView, TimerView) {
	    var AppRouter = Backbone.Router.extend({
	        initialize: function () {
	            var self = this;

	            this.workoutsView = new WorkoutsView({
	                el: "#workouts-view",
	                collection: new WorkoutsCollection([], {})
	            });

	            this.workoutDetailsView = new WorkoutDetailsView({
	                el: "#workout-details",
	                model: new WorkoutModel()
	            });

	            this.workoutFormView = new WorkoutFormView({
	                el: "#workout-form",
	                model: new WorkoutModel()
	            });

	            this.setFormView = new SetFormView({
	                el: "#set-form",
	                model: new SetModel()
	            });

	            this.setDetailsView = new SetDetailsView({
	                el: "#set-details",
	                model: new SetModel()
	            });

	            this.timerView = new TimerView({
	                el: "#timer-view",
                    model: new TimerModel()
	            });	            

	            Backbone.history.start();
	        },

	        routes: {
	            "": "home",
	            "workoutDetails?:id": "workoutDetails",
	            "createWorkout": "createWorkout",
	            "editWorkout?:id": "editWorkout",
	            "createSet?:id": "createSet",
	            "setDetails?:id": "setDetails",
	            "editSet?:id": "editSet",
                "startWorkout?:id": "startWorkout"
	        },

	        home: function () {
	            var workoutsView = this["workoutsView"];
	            var self = this;
	            $.mobile.loading("show");

	            workoutsView.collection.fetch().done(function () {
	                $.mobile.changePage("#workouts-view", { reverse: false, changeHash: false });
	                
	                //$("#workoutsListView").listview("refresh");
	                $("#workouts-view").trigger("pagecreate");

	                $(".wotActionsButton").click(function (event) {
	                    console.log("actions button clicked");
	                    var id = $(this).attr('id');
	                    $("#menu-" + id).popup("option", "positionTo", "#" + id);
	                    $("#menu-" + id).popup("open", { transition: "slide" });
	                });

	                $.mobile.loading("hide");	                
	            });
	        },

	        createWorkout: function () {
	            this.workoutFormView.model.clear();

	            this.workoutFormView.mode = "create";

	            this.workoutFormView.render();
	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });

	            //restyle the widgets in the template
	            $("#workout-form").trigger("pagecreate");
	        },

	        workoutDetails: function (id) {
	            $.mobile.loading("show");
	            var self = this;

	            this.workoutDetailsView.model.fetch({ "id": id })
                    .done(function () {
                        self.workoutDetailsView.model.setsCollection.fetch({ "workoutId": id });
                    })
                    .done(function () {
                        self.workoutDetailsView.render();
	                    $.mobile.changePage("#workout-details", { reverse: false, changeHash: false });

	                    //restyle the widgets in the template
	                    $("#workout-details").trigger("pagecreate");
	                    $.mobile.loading("hide");
	                });
	        },

	        editWorkout: function (id) {
	            $.mobile.loading("show");
	            var self = this;

	            this.workoutFormView.mode = "edit";

	            this.workoutFormView.model.fetch({ "id": id }).done(function () {
	                self.workoutFormView.render();
	                $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });

	                //restyle the widgets in the template
	                $("#workout-form").trigger("pagecreate");
	                $.mobile.loading("hide");
	            });
	        },

	        createSet: function (id) {
	            this.setFormView.mode = "create";

	            this.setFormView.model.clear();
	            this.setFormView.model.set("Workout_id", id);

	            $.mobile.changePage("#set-form", { reverse: false, changeHash: false });
	            this.setFormView.render();           
	        },

	        setDetails: function (id) {
	            $.mobile.loading("show");

	            this.setDetailsView.model.fetch({ "id": id }).done(function () {
	                $.mobile.changePage("#set-details", { reverse: false, changeHash: false });

	                //restyle the widgets in the template
	                $("#set-details").trigger("pagecreate");
	                $.mobile.loading("hide");
	            });
	        },

	        editSet: function (id) {
	            $.mobile.loading("show");

	            this.setFormView.mode = "edit";

	            var self = this;
	            this.setFormView.model.fetch({ "id": id }).done(function () {
	                $.mobile.changePage("#set-form", { reverse: false, changeHash: false });
	                self.setFormView.render(); 

	                $.mobile.loading("hide");
	            });
	        },

	        startWorkout: function (id) {
	            $.mobile.loading("show");
	            var self = this;
	            this.timerView.model.fetch({ "id": id }).done(function () {
	                $.mobile.changePage("#timer-view", { reverse: false, changeHash: false });

	                $.mobile.loading("hide");

                    //TODO: retrieve this variables from config or db
	                var vibrateMs = 2000;
	                var path = window.app.getPhoneGapFilePath();
	                var src = path + "res/media/BoxingBell.mp3";
	                
	                self.timerView.model.startTimer(true, function () {
	                    var deferred = $.Deferred();
	                    
	                    navigator.notification.vibrate(vibrateMs);
	                    var media = new Media(src, function () {
	                        deferred.resolve();
	                    });
	                    media.play();

	                    return deferred;
	                });
	            })
	            .fail(function () {
	                self.navigate("workoutDetails?" + id, { trigger: true, replace: true });
	            });
	        }
	    });

	    return AppRouter;
	}
);