import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Annotation } from '@/types';
import { AnnotationService } from '@/services/AnnotationService';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadAnnotations();
  }, []);

  const loadAnnotations = async () => {
    setLoading(true);
    try {
      const localAnnotations = await AnnotationService.getLocalAnnotations();
      setAnnotations(localAnnotations);
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
      Alert.alert('Erro', 'Usando dados de exemplo para exibição.');
    } finally {
      setLoading(false);
    }
  };

  const addAnnotation = async (newAnnotation: Omit<Annotation, 'synced'>) => {
    try {
      await AnnotationService.addAnnotation(newAnnotation);
      await loadAnnotations(); 
      return true;
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a anotação.');
      return false;
    }
  };

  const syncAnnotations = async (email: string) => {
    if (syncing) return false;
    
    setSyncing(true);
    try {
      const success = await AnnotationService.syncAnnotations(email);
      if (success) {
         await loadAnnotations(); 
        return true;
      } else {
        Alert.alert('Erro', 'Não foi possível sincronizar as anotações.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao sincronizar anotações:', error);
      Alert.alert('Erro', 'Não foi possível sincronizar as anotações.');
      return false;
    } finally {
      setSyncing(false);
    }
  };

  return {
    annotations,
    loading,
    syncing,
    addAnnotation,
    syncAnnotations,
    refreshAnnotations: loadAnnotations
  };
}