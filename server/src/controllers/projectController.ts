import { Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';

export const createProject = async (req: Request, res: Response) => {
    try {
        console.log('Creating project, body:', req.body);
        const { name } = req.body;

        if (!name) {
            console.log('Name missing');
            return res.status(400).json({ message: 'Projektnamn krävs' });
        }

        const project = await Project.create({
            name,
            tasks: [],
        });

        console.log('Project created:', project);

        res.status(201).json({
            message: 'Projekt skapat',
            project,
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            message: 'Kunde inte skapa projekt',
            error: error,
        });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().populate({
            path: 'tasks',
            select: 'title description status assignedTo finishedBy',
            populate: {
                path: 'assignedTo',
                select: 'name email',
            },
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte hämta projekt' });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate({
            path: 'tasks',
            select: 'title description status assignedTo finishedBy',
            populate: {
                path: 'assignedTo',
                select: 'name email',
            },
        });

        if (!project) {
            return res.status(404).json({ message: 'Projekt hittades inte' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte hämta projekt' });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updateData: { name?: string } = {};
        if (name) updateData.name = name;

        const project = await Project.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate({
            path: 'tasks',
            select: 'title description status assignedTo finishedBy',
            populate: {
                path: 'assignedTo',
                select: 'name email',
            },
        });

        if (!project) {
            return res.status(404).json({ message: 'Projekt hittades inte' });
        }

        res.json({
            message: 'Projekt uppdaterat',
            project,
        });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte uppdatera projekt' });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: 'Projekt hittades inte' });
        }

        // Ta bort alla tasks som är kopplade till projektet
        await Task.deleteMany({ _id: { $in: project.tasks } });

        await project.deleteOne();

        res.json({ message: 'Projekt borttaget' });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte ta bort projekt' });
    }
};
