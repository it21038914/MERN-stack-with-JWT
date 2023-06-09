import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContexts";
import { useAuthContext } from "../hooks/useAuthContext";

export default function WorkoutFrom() {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [loads, setLoads] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const hundleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }
    const workout = { title, reps, loads };

    const response = await fetch(
      "https://workout-buddy-k54o.onrender.com/api/workouts",
      {
        method: "POST",
        //json data valata convert karanawa object eka
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      //oya error property eka enne backend eken
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setLoads("");
      setReps("");
      setError(null);
      setEmptyFields([]);
      console.log("new workout added", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={hundleSubmit}>
      <h3>Add a New Workout</h3>
      <lable>Excersize Title: </lable>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <lable>Load (in kg): </lable>
      <input
        type="number"
        onChange={(e) => setLoads(e.target.value)}
        value={loads}
        className={emptyFields.includes("loads") ? "error" : ""}
      />

      <lable>Reps: </lable>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />
      <button>Add Workout</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
}
