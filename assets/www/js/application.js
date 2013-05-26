define(["jquery", "appRouter", "backbone"], 
	function($, AppRouter, Backbone){
		function Application () {
		}
		Application.prototype = {
		    initialize: function () {
		        var self = this;
		        document.addEventListener('deviceready', function () {
		            document.addEventListener("pause", self.onPause, false);
		            document.addEventListener("backbutton", self.onBackButtonClicked, false);
		        }, false);
		    },	    

		    onBackButtonClicked: function () {
		        var fragment = Backbone.history.fragment;

		        if (fragment.indexOf("") != -1 && fragment.length == 0) {
		            navigator.app.exitApp()
		        }

		        if (fragment.indexOf("startWorkout") != -1) {
		            window.app_router.timerView.confirmExit();
		            return;
		        }

		        window.history.back();
		    },

		    onPause: function () {
		    },

		    getPhoneGapFilePath: function () {
		        var path = window.location.pathname;
		        path = path.substr(path, path.length - 10);
		        return 'file://' + path;
		    }
		};
		
		return Application;
	}
);
