const Goals = ({ goals }) => (
    <div>
      <h2>Study Goals</h2>
      {goals.map(goal => (
        <div key={goal.id}>
          <h3>{goal.title}</h3>
          <p>Due by: {goal.deadline}</p>
          <p>{goal.description}</p>
        </div>
      ))}
    </div>
  );
  