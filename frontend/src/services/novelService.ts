import api from './api';
import { Novel, Chapter, AIReview } from '../types';

export const novelService = {
  async createNovel(title: string, description: string) {
    const response = await api.post('/novels', { title, description });
    return response.data;
  },

  async getNovels(): Promise<{ novels: Novel[] }> {
    const response = await api.get<{ novels: Novel[] }>('/novels');
    return response.data;
  },

  async getNovelById(id: number): Promise<{ novel: Novel; chapters: Chapter[] }> {
    const response = await api.get(`/novels/${id}`);
    return response.data;
  },

  async createChapter(
    novelId: number,
    chapterNumber: number,
    title: string,
    content: string
  ) {
    const response = await api.post('/chapters', {
      novelId,
      chapterNumber,
      title,
      content
    });
    return response.data;
  },

  async getChapterWithReviews(
    chapterId: number
  ): Promise<{ chapter: Chapter; reviews: AIReview[] }> {
    const response = await api.get(`/chapters/${chapterId}`);
    return response.data;
  },

  async updateNovel(id: number, title: string, description: string) {
    const response = await api.put(`/novels/${id}`, { title, description });
    return response.data;
  },

  async deleteNovel(id: number) {
    const response = await api.delete(`/novels/${id}`);
    return response.data;
  },

  async updateChapter(id: number, title: string, content: string) {
    const response = await api.put(`/chapters/${id}`, { title, content });
    return response.data;
  },

  async deleteChapter(id: number) {
    const response = await api.delete(`/chapters/${id}`);
    return response.data;
  }
};
