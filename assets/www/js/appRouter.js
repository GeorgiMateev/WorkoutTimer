define(["jquery",
    "backbone",
    "models/workoutModel",
    "models/setModel",
    "collections/workoutsCollection",
    "views/workoutsView",
    "views/workoutDetailsView",
    "views/workoutFormView",
    "views/setFormView",
    "views/setDetailsView",
    "jquerymobile"],

	function ($, Backbone, WorkoutModel, SetModel, WorkoutsCollection, WorkoutsView, WorkoutDetailsView, WorkoutFormView, SetFormView, SetDetailsView) {
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

	            Backbone.history.start();
	        },

	        routes: {
	            "": "home",
	            "workoutDetails?:id": "workoutDetails",
	            "createWorkout": "createWorkout",
	            "editWorkout?:id": "editWorkout",
	            "createSet?:id": "createSet",
	            "setDetails?:id": "setDetails",
                "editSet?:id": "editSet"
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
	            var self = this;

	            this.workoutDetailsView.model.fetch({ "id": id })
                    .done(function () {
                        self.workoutDetailsView.model.setsCollection.fetch({"workoutId": id})
                            .done(function () {
                                self.workoutDetailsView.render();
	                            $.mobile.changePage("#workout-details", { reverse: false, changeHash: false });

	                            //restyle the widgets in the template
	                            $("#workout-details").trigger("pagecreate");
	                            $.mobile.loading("hide");
	                        });
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

	        createSet: function (id) {
	            this.setFormView.model = new SetModel({"Workout_id": id});

	            this.setFormView.render();
	            $.mobile.changePage("#set-form", { reverse: false, changeHash: false });

	            //restyle the widgets in the template
	            $("#set-form").trigger("pagecreate");	            
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
	            var self = this;
	            this.setFormView.model.fetch({ "id": id }).done(function () {
	                self.setFormView.render();
	                $.mobile.changePage("#set-form", { reverse: false, changeHash: false });

	                //restyle the widgets in the template
	                $("#set-form").trigger("pagecreate");
	                $.mobile.loading("hide");
	            });
	        }
	    });

	    return AppRouter;
	}
);