define(["jquery", "backbone", "models/workoutModel", "collections/workoutsCollection", "views/workoutsView", "views/workoutDetailsView", "views/workoutFormView", "jquerymobile"],
	function ($, Backbone, WorkoutModel, WorkoutsCollection, WorkoutsView, WorkoutDetailsView, WorkoutFormView) {
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

	            Backbone.history.start();
	        },

	        routes: {
	            "createWorkout": "createWorkout",
	            "workoutDetails?:id": "workoutDetails",
	            "createWorkout": "createWorkout",
	            "editWorkout": "editWorkout",
	            "set": "showSet",
	            "": "home"
	        },

	        home: function () {
	            var workoutsView = this["workoutsView"];
	            console.log("navigate to home");

	            $.mobile.loading("show");

	            workoutsView.collection.fetch().done(function () {
	                $.mobile.changePage("#workouts-view", { reverse: false, changeHash: false });
	                $.mobile.loading("hide");
	            });
	        },

	        createWorkout: function () {
	            this.workoutFormView.model = new WorkoutModel();
	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });
	        },

	        workoutDetails: function (id) {
	            console.log("show details for workout with id: " + id);

	            $.mobile.loading("show");

	            this.workoutDetailsView.model.fetch({ "id": id }).done(function () {
	                $.mobile.changePage("#workout-details", { reverse: false, changeHash: false });
	                $("#workout-details").trigger("pagecreate");
	                $.mobile.loading("hide");
	            });
	        },

	        showSet: function () {
	            $.mobile.changePage("#set-view", { reverse: false, changeHash: false });
	        }
	    });

	    return AppRouter;
	}
);