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

	            var workoutsCollection = new WorkoutsCollection([], {});

	            this.workoutsView = new WorkoutsView({
	                el: "#workouts-view",
	                collection: workoutsCollection
	            });

	            this.workoutDetailsView = new WorkoutDetailsView({
	                el: "#workout-details",
	            });

	            this.workoutFormView = new WorkoutFormView({
	                el: "#workout-form",

                    //the crated models are added to this collection
	                collection: workoutsCollection
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
	            var self = this;
	            $.mobile.loading("show");

	            this.workoutsView.collection.fetch().done(function () {
	                $.mobile.changePage("#workouts-view", { reverse: false, changeHash: false });
	                
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

	            this.workoutFormView.changeModel(new WorkoutModel());
	            this.workoutFormView.mode = "create";

	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });
	            this.workoutFormView.render();
	        },

	        workoutDetails: function (id) {
	            $.mobile.loading("show");
	            var self = this;

	            var workoutModel = this.workoutsView.collection.get(id)
	            workoutModel.setsCollection.fetch({ "workoutId": id })
                    .done(function () {
                        self.workoutDetailsView.changeModel(workoutModel);

                        $.mobile.changePage("#workout-details", { reverse: false, changeHash: false });
                        self.workoutDetailsView.render();
                        
                        $.mobile.loading("hide");
                    });
	        },

	        editWorkout: function (id) {
	            $.mobile.loading("show");

	            this.workoutFormView.mode = "edit";

	            var workoutModel = this.workoutsView.collection.get(id);

	            this.workoutFormView.changeModel(workoutModel);

	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });
	            this.workoutFormView.render();

	            $.mobile.loading("hide");
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