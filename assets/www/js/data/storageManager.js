define(["jquery"],
    function ($) {
        function StorageManager() {

        }
        StorageManager.prototype = {
            getAllWorkouts: function (successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "SELECT * FROM Workouts";
                        tx.executeSql(sql, [], function (tx, results) {
                            var len = results.rows.length;
                            var workouts = [];
                            for (var i = 0; i < len; i++) {
                                workouts[i] = results.rows.item(i);
                            }
                            successCB(workouts);

                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
                //var w = [{ "_id": 1, "Name": "Tabata", "Description": "bla-bla" }, { "_id": 2, "Name": "Boi", "Description": "blasas-bla"}];
                //successCB(w);
            },

            getWorkout: function (id, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "SELECT * FROM Workouts WHERE _id=" + id;
                        tx.executeSql(sql, [], function (tx, results) {
                            var len = results.rows.length;
                            if (len == 0) {
                                alert("Workout with id: " + id + "not found!");
                            }

                            var workout = results.rows.item(0);

                            successCB(workout);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
                //var w;
                //if (id == 1) {
                //    w = { "_id": 1, "Name": "Tabata", "Description": "bla-bla" }
                //}
                //if (id == 2) {
                //    w = { "_id": 2, "Name": "Boi", "Description": "blaasasasas-bla" }
                //}

                //successCB(w);
            },

            createWorkout: function (model, successCB, errorCB) {
                //setTimeout(function () { successCB(2) }, 5000);
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "INSERT INTO Workouts (Name, Description) VALUES('" + model.Name + "','" + model.Description + "')";
                        tx.executeSql(sql, [], function (tx, results) {
                            successCB(results.insertId);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );

            },

            updateWorkout: function (model, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "UPDATE Workouts SET Name = '" + model.Name + "', Description = '" + model.Description + "' WHERE _id = " + model._id;
                        tx.executeSql(sql, [], function (tx, results) {
                            successCB(model._id);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
            }
        };

        return StorageManager;
    }
);