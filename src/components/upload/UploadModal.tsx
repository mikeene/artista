import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, ImagePlus, Tag, Ruler, Info } from 'lucide-react';
import { useUIStore, useAuthStore, usePostStore } from '@/store';
import { ART_CATEGORIES } from '@/lib/mockData';
import type { ArtMedium, Post } from '@/types';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { gradientFromId, sleep } from '@/lib/utils';

const MEDIUMS = ART_CATEGORIES.slice(1) as ArtMedium[];

export default function UploadModal() {
  const { setUploadModal } = useUIStore();
  const { user } = useAuthStore();
  const { addPost } = usePostStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    medium: '' as ArtMedium | '',
    tags: '',
    dimensions: '',
  });

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStep(2);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  function updateForm(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.medium) {
      toast.error('Please fill in title and medium');
      return;
    }
    setLoading(true);
    await sleep(1500);

    if (!user) return;
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      author: user,
      title: form.title,
      description: form.description,
      imageUrl: gradientFromId(form.title),
      medium: form.medium as ArtMedium,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      dimensions: form.dimensions,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      forSale: false,
    };

    addPost(newPost);
    toast.success('Artwork posted! 🎨');
    setLoading(false);
    setUploadModal(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
        onClick={() => setUploadModal(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-cream rounded-xl shadow-elevated overflow-hidden animate-rise-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="font-serif font-bold text-xl text-ink">Post Artwork</h2>
            <p className="text-xs text-ink/50 mt-0.5">Share your work with the Artista community</p>
          </div>
          <button
            onClick={() => setUploadModal(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5 text-ink/60" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${step >= s ? 'bg-terracotta text-white' : 'bg-black/10 text-ink/40'}`}>
                {s}
              </div>
              {s < 2 && <div className={`w-8 h-px transition-colors duration-300 ${step > s ? 'bg-terracotta' : 'bg-black/10'}`} />}
            </div>
          ))}
          <span className="text-xs text-ink/50 ml-2 self-center">{step === 1 ? 'Upload image' : 'Add details'}</span>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {step === 1 ? (
            // ── Step 1: Upload ──
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive
                  ? 'border-terracotta bg-terracotta/5'
                  : 'border-[var(--border)] hover:border-terracotta/50 hover:bg-warm'
                }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <ImagePlus className="w-7 h-7 text-terracotta" />
                </div>
                <div>
                  <p className="font-serif font-bold text-lg text-ink">
                    {isDragActive ? 'Drop your artwork here' : 'Upload your artwork'}
                  </p>
                  <p className="text-sm text-ink/50 mt-1">
                    Drag & drop or <span className="text-terracotta font-medium">browse files</span>
                  </p>
                  <p className="text-xs text-ink/40 mt-3">JPG, PNG, WebP, GIF · Max 20MB</p>
                </div>
              </div>
            </div>
          ) : (
            // ── Step 2: Details ──
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Preview thumbnail */}
              {preview && (
                <div className="flex gap-4 p-4 bg-warm rounded-lg border border-[var(--border)]">
                  <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink/50 mb-1">Preview</p>
                    <p className="text-sm font-medium text-ink truncate">{form.title || 'Untitled'}</p>
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setStep(1); }}
                      className="text-xs text-terracotta mt-1 hover:underline"
                    >
                      Change image
                    </button>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5 uppercase tracking-wide">
                  Title <span className="text-terracotta">*</span>
                </label>
                <input
                  className="input"
                  placeholder="Give your artwork a title…"
                  value={form.title}
                  onChange={e => updateForm('title', e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Tell the story behind this piece…"
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                />
              </div>

              {/* Medium */}
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5 uppercase tracking-wide">
                  Medium <span className="text-terracotta">*</span>
                </label>
                <select
                  className="input"
                  value={form.medium}
                  onChange={e => updateForm('medium', e.target.value)}
                  required
                >
                  <option value="">Select medium…</option>
                  {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Tags & Dimensions in a row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </label>
                  <input
                    className="input"
                    placeholder="Lagos, oil, portrait…"
                    value={form.tags}
                    onChange={e => updateForm('tags', e.target.value)}
                  />
                  <p className="text-[10px] text-ink/40 mt-1">Comma-separated</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/70 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Dimensions
                  </label>
                  <input
                    className="input"
                    placeholder="90cm × 120cm"
                    value={form.dimensions}
                    onChange={e => updateForm('dimensions', e.target.value)}
                  />
                </div>
              </div>

              {/* For Sale notice */}
              <div className="flex items-start gap-3 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-ink/70">
                  The <strong>For Sale</strong> feature will be available in a future update. For now, share your work and build your audience.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-ink/50 hover:text-ink transition-colors">
                  ← Back
                </button>
                <Button type="submit" loading={loading} size="lg">
                  <Upload className="w-4 h-4" />
                  {loading ? 'Posting…' : 'Post Artwork'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
