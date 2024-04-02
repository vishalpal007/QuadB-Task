import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Todo = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [allTodos, setAllTodos] = useState()
    const [task, setTask] = useState({})
    const [selectedTask, setSelectedTask] = useState()

    const handleAddTodo = async e => {
        try {
            await axios.post("http://localhost:5000/todos", task)
            toast.success("todo create success")
            setAllTodos()
            getAllTodos()
        } catch (error) {
            toast.error(error.message)

        }
    }

    const getAllTodos = async e => {
        try {
            setIsLoading(true)
            setTimeout(async () => {
                const { data } = await axios.get("http://localhost:5000/todos")
                setAllTodos(data)
                setIsLoading(false)

            }, 100)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const handleDelete = async todoId => {
        try {
            const { data } = await axios.delete(`http://localhost:5000/todos/${todoId}`)
            toast.error("todo delete success")
            getAllTodos()

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAllTodos()
    }, [])

    const DATA_TABLE = <>
        <div class="container">
            {
                allTodos?.length === 0
                    ? <div className='text-center'>
                        <h1>No Records Found.</h1>
                    </div>

                    : <>
                        <table class='table table-bordered table-striped table-responsive text-center'>
                            <thead class='text-center bg-black text-white'>
                                <tr>
                                    <th class='font-monospace'>Sr.No</th>
                                    <th class='font-monospace'>Task</th>
                                    <th class='font-monospace'>Priority</th>
                                    <th class='font-monospace'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTodos && allTodos.map((item, i) =>
                                    <tr class='{handleClasses(item.priority)}' key={i + 1}>
                                        <td>{item.id}</td>
                                        <td>{item.task}</td>
                                        <td>{item.priority}</td>
                                        <td class='d-flex justify-content-evenly'>
                                            <button data-bs-toggle="modal" data-bs-target="#editModal" onClick={e => setSelectedTask(item)} class='btn btn-warning text-white fw-semibold'>Edit</button>
                                            <button class='btn btn-danger fw-semibold' onClick={e => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
            }
        </div>

    </>
    // const [count, setCount] = useState(100)
    const handleChange = e => {
        const { value, name } = e.target
        setTask({ ...task, [name]: value })
        console.log(name, value);
    }
    const handleEditChange = e => {
        const { value, name } = e.target
        setSelectedTask({ ...selectedTask, [name]: value })

    }
    const handleUpdate = async e => {
        try {
            const { data } = await axios.patch(`http://localhost:5000/todos/${selectedTask.id}`, selectedTask)
            toast.info("Todo Update success")
            getAllTodos()

        } catch (error) {
            toast.error(error.message)

        }
    }


    if (isLoading) return <>
        <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-primary fw-bold">Loading...</p>
            </div>
        </div>

    </>
    return <>

        <div className="container">
            <div className="text-end">
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#add"
                    type="button"
                    class="btn btn-primary my-5">
                    Add Task
                </button>
            </div>
        </div>

        <div class="modal fade" id="add" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create a Title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input name='task' placeholder='Enter Task Name...' className='form-control my-2' onChange={handleChange} type="text" />
                        <select name='priority' className='form-control my-2 ' onChange={handleChange}>
                            <option>Choose Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button
                            onClick={handleAddTodo}
                            type="button"
                            class="btn btn-primary"
                            data-bs-dismiss="modal">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {
            DATA_TABLE
        }

        <div class="modal fade" id="editModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Update Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="text"
                            onChange={handleEditChange}
                            value={selectedTask && selectedTask.task}
                            className='form-control my-2'
                            name='task' />

                        <select class="form-select my-2"
                            onChange={handleEditChange}
                            name='priority'
                            value={selectedTask && selectedTask.priority}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <button data-bs-dismiss="modal"
                            type="button"
                            onClick={handleUpdate}
                            class="btn btn-primary">Update Todo</button>
                    </div>

                </div>
            </div>
        </div>

    </>
}

export default Todo