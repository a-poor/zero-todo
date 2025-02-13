import { useState } from "react";
import { nanoid } from "nanoid";
import { generateKeyBetween } from 'fractional-indexing';
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Schema } from "./schema";


export default function App() {
  return (
    <div>
      <CreateTask />
      <TaskList />
    </div>
  );
}

function CreateTask() {
  const z = useZero<Schema>();
  const [lastTask] = useQuery(z.query.task.orderBy("orderId", "desc").one());
  const [text, setText] = useState("");
  return (
    <form onSubmit={e => {
      e.preventDefault();
      const id = nanoid();
      const orderId = generateKeyBetween(lastTask?.orderId, null);
      z.mutate.task.insert({
        id,
        orderId,
        text,
        completed: false,
      });
      setText("");
    }}>
      <input type="text" value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">
        Create
      </button>
    </form>
  );
}

function TaskList() {
  const z = useZero<Schema>();
  const [tasks] = useQuery(z.query.task.orderBy("orderId", "asc"));
  return (
    <ul style={{ maxWidth: '500px' }}>
      {tasks.map((t, i) => {
        return (
          <TaskItem
            key={t.id}
            text={t.text}
            completed={t.completed}
            onClick={() => z.mutate.task.update({
              id: t.id,
              completed: !t.completed,
            })}
            onDelete={() => z.mutate.task.delete({
              id: t.id,
            })}
            onUp={() => {
              const prevId = tasks[i - 1]?.orderId;
              const idBeforePrev = tasks[i - 2]?.orderId;
              z.mutate.task.update({
                id: t.id,
                orderId: generateKeyBetween(idBeforePrev, prevId),
              });
            }}
            onDown={() => {
              const nextId = tasks[i + 1]?.orderId;
              const idAfterNext = tasks[i + 2]?.orderId;
              z.mutate.task.update({
                id: t.id, 
                orderId: generateKeyBetween(nextId, idAfterNext),
              });
            }}
            canUp={i > 0}
            canDown={i < tasks.length - 1}
          />
        );
      })}
    </ul>
  );
}

function TaskItem({
  text,
  completed,
  onClick,
  onDelete,
  onUp,
  onDown,
  canUp,
  canDown,
}: {
  text: string;
  completed: boolean;
  onClick: () => void;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
  canUp?: boolean;
  canDown?: boolean;
}) {
  return (
    <li style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4px 8px",
      borderBottom: "1px solid #ccc",
    }}>
      {completed ? (
        <s>{text}</s>
      ) : (
        <span>{text}</span>
      )}
      <div>
        <button onClick={onClick} style={{ marginRight: "8px" }}>
          {completed ? "Undo" : "Complete"}
        </button>
        <button onClick={onDelete} style={{ marginRight: "8px" }}>
          Delete
        </button>
        <button onClick={onUp} disabled={!canUp} style={{ marginRight: "8px" }}>
          Up
        </button>
        <button onClick={onDown} disabled={!canDown}>
          Down
        </button>
      </div>
    </li>
  );
}

