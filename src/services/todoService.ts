import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Todo } from '../types/todo';

export const todoService = {
  isConfigured(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async fetchTodos(): Promise<Todo[]> {
    if (!this.isConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos from Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      completed: row.completed,
      priority: row.priority,
      category: row.category,
      dueDate: row.due_date || undefined,
      createdAt: Number(row.created_at),
      completedAt: row.completed_at ? Number(row.completed_at) : undefined,
    }));
  },

  async addTodo(todo: Todo): Promise<void> {
    if (!this.isConfigured() || !supabase) return;

    const { error } = await supabase.from('todos').insert({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      priority: todo.priority,
      category: todo.category,
      due_date: todo.dueDate || null,
      created_at: todo.createdAt,
      completed_at: todo.completedAt || null,
    });

    if (error) {
      console.error('Error inserting todo:', error);
      throw error;
    }
  },

  async updateTodo(todo: Todo): Promise<void> {
    if (!this.isConfigured() || !supabase) return;

    const { error } = await supabase
      .from('todos')
      .update({
        title: todo.title,
        completed: todo.completed,
        priority: todo.priority,
        category: todo.category,
        due_date: todo.dueDate || null,
        completed_at: todo.completedAt || null,
      })
      .eq('id', todo.id);

    if (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    if (!this.isConfigured() || !supabase) return;

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  async clearCompleted(): Promise<void> {
    if (!this.isConfigured() || !supabase) return;

    const { error } = await supabase.from('todos').delete().eq('completed', true);

    if (error) {
      console.error('Error clearing completed todos:', error);
      throw error;
    }
  },
};

