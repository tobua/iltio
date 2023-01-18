import { useQuery, useMutation } from '@apollo/client'
import {
  getProjectsQuery,
  addProjectMutation,
  updateProjectMutation,
  addTaskMutation,
} from './interface'
import { Colors } from './main'

const Form = ({ title, onAdd }: { title: string; onAdd: (value: string) => void }) => (
  <form
    style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}
    onSubmit={(event: any) => {
      event.preventDefault()
      onAdd(event.target[0].value)
      event.target[0].value = ''
    }}
  >
    <input
      style={{ display: 'flex', flex: 1, border: 'none', outline: 'none' }}
      placeholder={title}
    />
    <button
      style={{
        border: 'none',
        background: Colors.blue,
        padding: 5,
        color: Colors.albatross,
      }}
      type="submit"
    >
      Add
    </button>
  </form>
)

const Notification = ({ loading, error }: { loading: boolean; error: boolean }) =>
  loading || error ? (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        background: Colors.blue,
        color: Colors.albatross,
      }}
    >
      {loading && <p>Loading</p>}
      {error && <p>Error</p>}
    </div>
  ) : null

export function Projects() {
  const { loading, error, data } = useQuery(getProjectsQuery)

  const [addProject, { error: errorAddProject, loading: loadingAddProject }] = useMutation<
    any,
    { name: string }
  >(addProjectMutation, {
    refetchQueries: [{ query: getProjectsQuery }],
  })

  const [addTask, { error: errorAddTask, loading: loadingAddTask }] = useMutation<
    any,
    { name: string; project: number }
  >(addTaskMutation, {
    refetchQueries: [{ query: getProjectsQuery }],
  })

  const [updateProject, { error: errorUpdateProject, loading: loadingUpdateProject }] = useMutation<
    any,
    { id: number; done: boolean }
  >(updateProjectMutation, {
    refetchQueries: [{ query: getProjectsQuery }],
  })

  const projects = (data?.project ?? []) as {
    id: number
    name: string
    tasks: { id: number; name: string; done: boolean }[]
  }[]

  if (error) return <p>Error loading data.</p>
  if (loading) return <p>Loading data.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Notification
        loading={loadingAddProject || loadingAddTask || loadingUpdateProject}
        error={!!(errorAddProject || errorAddTask || errorUpdateProject)}
      />
      <Form
        title="Add a project"
        onAdd={(value) => {
          addProject({ variables: { name: value } })
        }}
      />
      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: Colors.albatross,
            gap: 10,
            padding: 10,
          }}
        >
          <h2 style={{ margin: 0 }}>{project.name}</h2>
          <Form
            title="Add a task"
            onAdd={(value) => addTask({ variables: { name: value, project: project.id } })}
          />
          {project.tasks.length !== 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {project.tasks.map((task) => (
                <div key={task.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(event) =>
                        updateProject({ variables: { id: task.id, done: event.target.checked } })
                      }
                    />
                    {task.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
