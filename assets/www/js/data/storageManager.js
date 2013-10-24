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
                        var sql = "SELECT * FROM Workouts WHERE _id=?";
                        tx.executeSql(sql, [id], function (tx, results) {
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
                        var sql = "INSERT INTO Workouts (Name, Description) VALUES(?,?)";
                        tx.executeSql(sql, [model.Name, model.Description], function (tx, results) {
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
                        var sql = "UPDATE Workouts SET Name = ?, Description = ? WHERE _id = ?";
                        tx.executeSql(sql, [model.Name, model.Description, model._id], function (tx, results) {
                            successCB(model._id);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
            },

            deleteWorkout: function(id, successCB, errorCB){
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var delWOSql = "DELETE FROM Workouts WHERE _id = ?";
                        var delSetSql = "DELETE FROM Sets WHERE Workout_id = ?";
                        tx.executeSql(delWOSql, [id]);
                        tx.executeSql(delSetSql, [id]);
                    },
                    function (tx, error) {
                        errorCB(error);
                    },
                    function () {
                        successCB();
                    }
                );
            },

            createSet: function (model, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "INSERT INTO Sets (Name, Description, Duration, Type, Workout_id) VALUES(?, ?, ?, ?, ?)";

                        tx.executeSql(sql, [model.Name, model.Description, model.Duration, model.Type, model.Workout_id], function (tx, results) {
                            successCB(results.insertId);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
            },

            updateSet: function (model, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "UPDATE Sets SET Name = ?, Description = ?, Duration = ?, Type = ? WHERE _id = ?";
                        tx.executeSql(sql, [model.Name, model.Description, model.Duration, model.Type, model._id], function (tx, results) {
                            successCB(model._id);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
            },

            getAllWorkoutSets: function (workoutId, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "SELECT * FROM Sets WHERE Workout_id = ?";
                        tx.executeSql(sql, [workoutId], function (tx, results) {
                            var len = results.rows.length;
                            var sets = [];
                            for (var i = 0; i < len; i++) {
                                sets[i] = results.rows.item(i);
                            }
                            successCB(sets);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );
                //var s = [{ "_id": 1, "Name": "set 1", "Workout_id": workoutId, Description: "Description of a set 1", "Duration": 5, Type: "set" },
                //{ "_id": 2, "Name": "set 2", "Workout_id": workoutId, Description: "Description of a set 2", "Duration": 5, Type: "rest" }
                //];
                ////var s = [];
                //successCB(s);
            },

            getSet: function (setId, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "SELECT * FROM Sets WHERE _id = ?";

                        tx.executeSql(sql, [setId], function (tx, results) {
                            var len = results.rows.length;
                            if (len == 0) {
                                alert("Set with id: " + setId + "not found!");
                            }

                            var set = results.rows.item(0);

                            successCB(set);
                        });
                    },
                    function (tx, error) {
                        errorCB(error);
                    }
                );

                //if (setId == 1) {
                //    var s = { "_id": 1, "Name": "set 1", "Workout_id": 1, Description: "Description of a set 1", "Duration": 5 , Type:"set"};
                //    successCB(s);
                //}
                //else if(setId == 2){
                //    var s = { "_id": 2, "Name": "set 2", "Workout_id": 1, Description: "Description of a set 2", "Duration": 5 , Type:"rest"};
                //    successCB(s);
                //}
            },

            deleteSet: function (setId, successCB, errorCB) {
                var db = window.sqlitePlugin.openDatabase({ name: "workouts" });

                db.transaction(
                    function (tx) {
                        var sql = "DELETE FROM Sets WHERE _id = ?";
                        tx.executeSql(sql, [setId], function (tx, results) {
                            successCB(setId);
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