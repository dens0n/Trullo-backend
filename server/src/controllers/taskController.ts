import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';

// Create new task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, projectId, finishedBy } = req.body;

        if (!title || !description || !projectId) {
            return res.status(400).json({
                message: 'Titel, beskrivning och projektId krävs',
            });
        }

        const task = await Task.create({
            title,
            description,
            finishedBy,
            status: 'to-do',
        });

        // Lägg till task i projektet
        await Project.findByIdAndUpdate(projectId, {
            $push: { tasks: task._id },
        });

        const populatedTask = await Task.findById(task._id).populate(
            'assignedTo',
            'name email'
        );

        res.status(201).json({
            message: 'Uppgift skapad',
            task: populatedTask,
        });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte skapa uppgift' });
    }
};

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte hämta uppgifter' });
    }
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, status, finishedBy } = req.body;

        const updateData: {
            title?: string;
            description?: string;
            status?: string;
            finishedBy?: string;
        } = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (finishedBy) updateData.finishedBy = finishedBy;

        const task = await Task.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate('assignedTo', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Uppgift hittades inte' });
        }

        res.json({
            message: 'Uppgift uppdaterad',
            task,
        });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte uppdatera uppgift' });
    }
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Uppgift hittades inte' });
        }

        // Ta bort task-referensen från projekt
        await Project.updateMany({ tasks: id }, { $pull: { tasks: id } });

        await task.deleteOne();

        res.json({ message: 'Uppgift borttagen' });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte ta bort uppgift' });
    }
};

// Assign task to user
export const assignTask = async (req: Request, res: Response) => {
    try {
        const { taskId, userId } = req.params;

        const task = await Task.findByIdAndUpdate(
            taskId,
            { assignedTo: userId },
            { new: true }
        ).populate('assignedTo', 'name email');

        if (!task) {
            return res.status(404).json({ message: 'Uppgift hittades inte' });
        }

        res.json({
            message: 'Uppgift tilldelad',
            task,
        });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte tilldela uppgift' });
    }
};
