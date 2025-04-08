import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Annotation, ApiResponse } from '@/types';

const API_URL = 'https://hooks.zapier.com/hooks/catch/472009/jla9rg/';
const STORAGE_KEY = '@checkplant:annotations';

export const AnnotationService = {
  async getLocalAnnotations(): Promise<Annotation[]> {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar anotações locais:', error);
      return [];
    }
  },

  async saveLocalAnnotations(annotations: Annotation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    } catch (error) {
      console.error('Erro ao salvar anotações locais:', error);
    }
  },

  async syncAnnotations(email: string): Promise<boolean> {
    try {
      const localAnnotations = await this.getLocalAnnotations();
      const unsyncedAnnotations = localAnnotations.filter(ann => !ann.synced);
      
      if (unsyncedAnnotations.length === 0) {
        return true; 
      }

      const response = await axios.post<ApiResponse>(`${API_URL}?email_key=${email}`, {
        annotations: unsyncedAnnotations
      });

      if (response.data.status === 'success') {
        const updatedAnnotations = localAnnotations.map(ann => {
          if (!ann.synced) {
            return { ...ann, synced: true };
          }
          return ann;
        });

        await this.saveLocalAnnotations(updatedAnnotations);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao sincronizar anotações:', error);
      return false;
    }
  },

  async addAnnotation(annotation: Omit<Annotation, 'synced'>): Promise<void> {
    try {
      const localAnnotations = await this.getLocalAnnotations();
      const newAnnotation: Annotation = {
        ...annotation,
        synced: false
      };

      localAnnotations.push(newAnnotation);
      await this.saveLocalAnnotations(localAnnotations);
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error);
    }
  }
};