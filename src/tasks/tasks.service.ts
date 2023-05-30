import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {
  }

  async create(createTaskDto: CreateTaskDto) {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async findAll(userId) {
    const tasks = await this.taskModel.find({ userId });
    return tasks;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const newTask = { text: updateTaskDto.text };
    const task = await this.taskModel.findOneAndUpdate({ _id: id }, newTask, { new: true });
    if (task) return (task);
    throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (task) return (task);
    throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
  }
}
