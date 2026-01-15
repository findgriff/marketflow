
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const AddProduct: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Design Assets');
  const [price, setPrice] = useState('49.00');
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateDescription = async () => {
    if (!title) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a compelling, professional marketplace description for a digital product titled "${title}" in the category "${category}".`,
        config: {
          systemInstruction: "You are an expert copywriter for digital marketplaces. Keep the description concise but persuasive (max 100 words).",
        }
      });
      setDescription(response.text || '');
    } catch (err) {
      console.error('AI Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrimaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPrimaryImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setGallery(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-8 pb-32">
      <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Add Digital Asset</h2>
              <p className="text-slate-500 font-bold mt-1">List your product to millions of creators.</p>
            </div>
            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Preview
            </button>
          </header>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Product Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Product Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern UI Kit - Figma Library"
                  className="w-full px-5 py-4 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary transition-all font-bold"
                  >
                    <option>Design Assets</option>
                    <option>Software / Scripts</option>
                    <option>Templates</option>
                    <option>E-books</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Base Price ($)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</label>
                  <button 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !title}
                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    <span className="material-symbols-outlined text-sm">{isGenerating ? 'refresh' : 'auto_fix'}</span>
                    {isGenerating ? 'Generating...' : 'AI Generate Description'}
                  </button>
                </div>
                <textarea 
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your digital product features..."
                  className="w-full px-5 py-4 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Media Uploader Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Product Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cover Image</label>
                <input type="file" ref={primaryInputRef} onChange={handlePrimaryUpload} accept="image/*" className="hidden" />
                <div 
                  onClick={() => primaryInputRef.current?.click()}
                  className={`relative aspect-[4/3] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                    primaryImage ? 'border-primary' : 'border-slate-200 dark:border-slate-800 hover:border-primary/40'
                  }`}
                >
                  {primaryImage ? (
                    <>
                      <img src={primaryImage} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Change</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                      <p className="text-xs font-bold uppercase tracking-widest">Add Cover</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gallery Preview</label>
                <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
                <div className="grid grid-cols-3 gap-4">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                  {gallery.length < 8 && (
                    <button 
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/40 flex items-center justify-center text-slate-400"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Access Control</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Download Limit</label>
                <input type="number" defaultValue={5} className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl font-bold" />
              </div>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Watermark Files</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Payout Estimation</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Fee (10%)</span>
                <span>-${(parseFloat(price || '0') * 0.1).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-primary/10 flex flex-col gap-1">
                <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">You earn</span>
                <span className="text-4xl font-black text-primary">${(parseFloat(price || '0') * 0.9).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 glass-header border-t border-slate-200 dark:border-slate-800 px-8 h-20 flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Draft</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800">Save Draft</button>
          <button className="px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20">Publish Asset</button>
        </div>
      </footer>
    </div>
  );
};

export default AddProduct;
