// Sets the require.js configuration for the application.
      require.config( {

        // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.3.min")
        paths: {

            // Core Libraries
            "jquery": "libs/jquery",
            "jquerymobile": "libs/jquerymobile",
            "underscore": "libs/underscore",
            "backbone": "libs/backbone",
			"appRouter": "appRouter",
			"application": "application",
			"dateBoxCore": "libs/jqm-datebox-1.1.0.core",
            "durationFlipBox": "libs/jqm-datebox-1.1.0.mode.durationbox",
        },

        // Sets the configuration for your third party scripts that are not AMD compatible
        shim: {

            "backbone": {
                 "deps": [ "underscore", "jquery" ],
                 "exports": "Backbone"  //attaches "Backbone" to the window object
            },

            "durationFlipBox": {
                "deps": ["jquery", "dateBoxCore"],
                "exports": "DurationFlipBox"
            }

        } // end Shim Configuration

      } );

      // Includes File Dependencies
      require([ "jquery", "backbone", "application", "appRouter" ],
        function( $, Backbone, Application, AppRouter) {	        
						
			//$( document ).on( "mobileinit",	function() {
				// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
				$.mobile.linkBindingEnabled = false;
				
				// Disabling this will prevent jQuery Mobile from handling hash changes
				$.mobile.hashListeningEnabled = false;

				$.mobile.defaultPageTransition = "none";
			//});
			
			require( [ "jquerymobile" ], function() {
		        this.app_router = new AppRouter();
		        
		        this.app = new Application();
		        this.app.initialize();
	        });

      } );