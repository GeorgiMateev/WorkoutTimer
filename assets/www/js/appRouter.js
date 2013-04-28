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
	            "editWorkout?:id": "editWorkout",
	            "set": "showSet",
	            "": "home"
	        },

	        home: function () {
	            var workoutsView = this["workoutsView"];

	            $.mobile.loading("show");

	            workoutsView.collection.fetch().done(function () {
	                $.mobile.changePage("#workouts-view", { reverse: false, changeHash: false });
	                $.mobile.loading("hide");
	            });
	        },

	        createWorkout: function () {
	            this.workoutFormView.model = new WorkoutModel();
	            this.workoutFormView.render();
	            $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });

	            //restyle the widgets in the template
	            $("#workout-form").trigger("pagecreate");
	        },

	        workoutDetails: function (id) {
	            $.mobile.loading("show");

	            this.workoutDetailsView.model.fetch({ "id": id }).done(function () {
	                $.mobile.changePage("#workout-details", { reverse: false, changeHash: false });

	                //restyle the widgets in the template
	                $("#workout-details").trigger("pagecreate");
	                $.mobile.loading("hide");
	            });
	        },

	        editWorkout: function (id) {
	            $.mobile.loading("show");
	            var self = this;
	            this.workoutFormView.model.fetch({ "id": id }).done(function () {
	                self.workoutFormView.render();
	                $.mobile.changePage("#workout-form", { reverse: false, changeHash: false });

	                //restyle the widgets in the template
	                $("#workout-form").trigger("pagecreate");
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