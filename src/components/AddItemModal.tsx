import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Clock, Pill, Stethoscope, Globe, Music, Image as ImageIcon, AlertCircle, Link as LinkIcon, Heart, Sparkles, Check, Upload, FolderOpen } from 'lucide-react';
import { ScheduleItem, ItemCategory, UserProfile } from '../types';
import { getTodayDateString, getCurrentTimeString } from '../utils/date';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (newItem: Omit<ScheduleItem, 'id' | 'createdAt'>) => void;
  currentProfile: UserProfile;
  defaultCategory?: string;
  selectedDate?: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  currentProfile,
  defaultCategory = 'routine',
  selectedDate = getTodayDateString()
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [category, setCategory] = useState<ItemCategory>(
    (defaultCategory as ItemCategory) || 'routine'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate || getTodayDateString());
  const [startTime, setStartTime] = useState(getCurrentTimeString().slice(0, 5) || '12:00');
  const [endTime, setEndTime] = useState('12:30');
  const [medicalNote, setMedicalNote] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [important, setImportant] = useState(false);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly'>('none');

  // Reset form fields whenever modal opens to prevent stale values/dates
  useEffect(() => {
    if (isOpen) {
      setCategory((defaultCategory as ItemCategory) || 'routine');
      setTitle('');
      setDescription('');
      setDate(selectedDate || getTodayDateString());
      setStartTime(getCurrentTimeString().slice(0, 5) || '12:00');
      setEndTime('');
      setMedicalNote('');
      setLinkUrl('');
      setMusicUrl('');
      setImageUrl('');
      setImportant(false);
      setRecurring('none');
    }
  }, [isOpen, selectedDate, defaultCategory]);

  if (!isOpen) return null;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Preset sample image pickers for convenience
  const presetImages = [
    { label: 'Hospital / Médico', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80' },
    { label: 'Remédios & Saúde', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
    { label: 'Natureza & Praia', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' },
    { label: 'Música & Relax', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddItem({
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      startTime,
      endTime: endTime || undefined,
      completed: false,
      medicalNote: medicalNote.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      musicUrl: musicUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      createdBy: currentProfile.name,
      createdByRole: currentProfile.role,
      important,
      recurring
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Adicionar Lembrete ou Atividade
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cadastrando em nome de: <strong className="text-indigo-600 dark:text-indigo-400">{currentProfile.name}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Category Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Qual o Tipo do Lembrete?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              <button
                type="button"
                onClick={() => setCategory('medication')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  category === 'medication'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Pill className="w-4 h-4" /> Remédio
              </button>

              <button
                type="button"
                onClick={() => setCategory('medical')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  category === 'medical'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Stethoscope className="w-4 h-4" /> Consulta Médica
              </button>

              <button
                type="button"
                onClick={() => setCategory('website')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  category === 'website'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Globe className="w-4 h-4" /> Site / Link
              </button>

              <button
                type="button"
                onClick={() => setCategory('music')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  category === 'music'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Music className="w-4 h-4" /> Música
              </button>

              <button
                type="button"
                onClick={() => setCategory('image_note')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  category === 'image_note'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Foto & Recado
              </button>

              <button
                type="button"
                onClick={() => setCategory('routine')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  category === 'routine'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Clock className="w-4 h-4" /> Rotina / Geral
              </button>

            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Título (Ex: Tomar Remédio X, Médico Dr. Carlos, Música Relax) *
            </label>
            <input
              type="text"
              required
              placeholder="Digite um título claro..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Texto Explicativo / Detalhes
            </label>
            <textarea
              rows={2}
              placeholder="Escreva detalhes para não esquecer nada..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Data (Dia e Mês)
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Horário de Início
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Horário de Término
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Medical note field if category is medication or medical */}
          {(category === 'medication' || category === 'medical') && (
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Instruções de Uso / Dosagem / Recomendações Médicas
              </label>
              <input
                type="text"
                placeholder="Ex: Tomar 1 comprimido azul com água após o almoço"
                value={medicalNote}
                onChange={e => setMedicalNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>
          )}

          {/* Website URL or Music URL */}
          {(category === 'website' || category === 'routine') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Link do Site (URL completa)
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          )}

          {category === 'music' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Link da Música (YouTube / Spotify)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={musicUrl}
                onChange={e => setMusicUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          )}

          {/* Image Upload & URL */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                Imagem / Foto da Atividade
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-200" />
                📁 Escolher do PC
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileUpload}
              accept="image/*"
              className="hidden"
            />

            {imageUrl && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 cursor-pointer"
                  title="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <input
              type="url"
              placeholder="Ou cole a URL da imagem (https://...)..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-500 self-center">Exemplos:</span>
              {presetImages.map(preset => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setImageUrl(preset.url)}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options: Recurring & Important */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={important}
                onChange={e => setImportant(e.target.checked)}
                className="w-4 h-4 rounded-md text-indigo-600 focus:ring-indigo-500"
              />
              Marcar como Muito Importante 🔴
            </label>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Repetir:</span>
              <select
                value={recurring}
                onChange={e => setRecurring(e.target.value as 'none' | 'daily' | 'weekly')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="none">Não repetir</option>
                <option value="daily">Todos os dias</option>
                <option value="weekly">Toda semana</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              Salvar na Rotina
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
