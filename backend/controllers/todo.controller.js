import Todo from "../models/todo.model.js";
import { getNextSequenceValue } from "../models/counter.model.js";

export const createTodo = async (req, res) => {
  const { title, description, date, category, isCompleted } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({
      success: false,
      message: "Title, description, and date are required",
    });
  }

  try {
    const id = await getNextSequenceValue();

    const newTodo = new Todo({
      id,
      title,
      description,
      date,
      category,
      isCompleted: isCompleted ?? false,
    });

    await newTodo.save();

    const todo = await Todo.findOne({ id }).select(
      "id title isCompleted description category -_id"
    );

    return res.status(201).json({ success: true, todo });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create todo" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, category, isCompleted } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { id },
      { title, description, date, category, isCompleted },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, todo });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update todo" });
  }
};

export const getAllTodo = async (req, res) => {
  const { page = 1, perPage = 10, title, category, status } = req.query;
  try {
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // case-insensitive search
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      query.isCompleted = status === "Completed";
    }
    const todo = await Todo.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage))
      .select("id date title isCompleted description category -_id");

    const totalTodos = await Todo.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        rows: todo,
        meta: {
          page: parseInt(page),
          total: Math.ceil(totalTodos),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ id });

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }

    res.status(200).json({ success: true, todo });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to deleting todo" });
  }
};
