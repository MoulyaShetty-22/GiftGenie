
import React from 'react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<UserInput>({
    age: '',
    occasion: '',
    hobbies: '',
    budget: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-8 space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age Group</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 28, Teen"
              required
              className="w-full px-4 py-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Occasion</label>
            <input
              type="text"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              placeholder="e.g. Diwali, Birthday"
              required
              className="w-full px-4 py-3 rounded-2xl bg-rose-50/50 border border-rose-100 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Interests & Vibes</label>
          <textarea
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            placeholder="What makes them happy? e.g. Chai lover, cricket enthusiast, bollywood fan..."
            required
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-teal-50/50 border border-teal-100 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100 outline-none transition-all placeholder:text-slate-400 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Budget</label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. Around ₹2,000, Luxury, No limit"
            required
            className="w-full px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-100 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl ${
          isLoading 
            ? 'bg-slate-300 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] shadow-indigo-200'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Consulting the Stars...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-sparkles"></i>
            Find Magic Gifts
          </span>
        )}
      </button>
    </form>
  );
};

export default InputForm;
