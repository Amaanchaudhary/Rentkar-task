import { useEffect, useState } from 'react';
import './App.css';
import api from './helpers/axios.config';
import toast from 'react-hot-toast';

function App() {

  const [data, setData] = useState({ name: '', desc: '' })
  const [tasks, setTasks] = useState([])
  // const [isChecked, setIsChecked] = useState([]);
  // console.log(tasks, 'tasks')

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (data.name && data.desc) {
      try {
        const response = await api.post("/task/add-task", { data })
        if (response.data.success) {
          toast.success("Task Added!")
          setData({ name: '', desc: '' })
          setTasks(response.data.allTasks)
          // window.location.reload();
        }
      } catch (error) {
        toast.error(error?.response?.data.message)
      }
    } else {
      toast.error("All Fields are Mandatory")
    }
  }

  async function deleteTask(id) {
    try {
      const response = await api.delete(`/task/delete-task?id=${id}`)
      if (response.data.success) {
        toast.success(response.data.message)
        setTasks(response.data.updatedTasks)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  async function TaskComplete(id) {
    try {
      const response = await api.patch(`/task/completed-task?id=${id}`)

      if (response.data.success) {
        toast.success(response.data.message)
        setTasks(response.data.taskCompleted) 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  async function getTasks() {
    // alert('helo')
    try {
      const { data } = await api.get("/task/get-all-task")

      if (data.success) {
        // console.log(data.tasks)
        setTasks(data.tasks)
      }

    } catch (error) {
      toast.error(error?.data?.message)

    }
  }

  useEffect(() => {
    //fetch all tasks
    getTasks()

  }, [])

  return (
    <div className="App">
      <h2>My Todo</h2>
      <div className='top'>

        <form className='top-left' onSubmit={handleSubmit}>

          <div>
            <label>Name</label><br />
            <input type='text' name='name' value={data.name} onChange={handleChange} />
          </div>
          <div>
            <label>Decription</label><br />
            <input type='text' name='desc' value={data.desc} onChange={handleChange} />
          </div>

          <div className='submit-div'>
            <input type='submit' value='Add Todo' />
          </div>

        </form>
      </div>

      <div className='bottom'>
        {tasks.length ?
          <div className='display'>
            {tasks.map((pro, i) => (
              <>
                {pro.completed &&
                  <button className='delete' onClick={() => deleteTask(`${pro._id}`)} >Delete</button>
                }
                <div key={i} className='singleDiv'>
                  <div className='task-info'>
                    <h2 className = {pro.completed ? 'completed task-name ' : 'not task-name' }>{pro.name}</h2>
                    <p className = {pro.completed ? 'completed task-desc ' : 'not task-desc' }>{pro.desc}</p>
                  </div>
                    < button className = {pro.completed ? 'completed completed-btn ' : 'not completed-btn' } onClick={() => TaskComplete(`${pro._id}`)}> Completed? </button>
              </div >

              </>
            ))}

      </div>
      :
      <div>Loading</div>
        }
    </div>

    </div >
  );
}

export default App;
