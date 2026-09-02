import { useState } from 'react';
import { Modal } from './Modal.jsx';
import { api } from '../services/api.js';
import { useLibrary } from '../context/LibraryContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function UploadModal() {
  const { uploadOpen, setUploadOpen, refresh } = useLibrary();
  const { push } = useToast();
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [form, setForm] = useState({ title: '', artist: '', album: '', genre: '' });

  if (!uploadOpen) return null;

  function onFiles(files) {
    const file = files?.[0];
    if (!file) return;
    if (file.type.startsWith('audio')) setAudio(file);
    else setCover(file);
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!audio) {
      setError('Choose an audio file.');
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('audio', audio);
    if (cover) data.append('cover', cover);
    setBusy(true);
    try {
      await api.upload(data, setProgress);
      push('Song uploaded successfully.');
      await refresh();
      setUploadOpen(false);
      setAudio(null);
      setCover(null);
      setForm({ title: '', artist: '', album: '', genre: '' });
      setProgress(0);
    } catch (err) {
      setError(err.message);
      push(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Upload Music" onClose={() => setUploadOpen(false)} wide>
      <form onSubmit={submit} className="space-y-3">
        <Dropzone
          label={audio ? `${audio.name} (${Math.round(audio.size / 1024)} KB)` : 'Drop an MP3, WAV, OGG, or M4A file'}
          accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,.mp3,.wav,.ogg,.m4a"
          onFiles={onFiles}
        />
        <Dropzone
          label={cover ? cover.name : 'Optional cover image (JPG, PNG, WEBP)'}
          accept="image/jpeg,image/png,image/webp"
          onFiles={(files) => setCover(files[0])}
        />
        {['title', 'artist', 'album', 'genre'].map((field) => (
          <input
            key={field}
            className="w-full rounded-md bg-raised px-3 py-2 text-sm outline-none"
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
        {busy && (
          <div className="h-2 overflow-hidden rounded-full bg-raised">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-accent py-2.5 font-bold text-black disabled:opacity-50"
        >
          {busy ? `Uploading ${progress}%` : 'Upload'}
        </button>
      </form>
    </Modal>
  );
}

function Dropzone({ label, accept, onFiles }) {
  return (
    <label
      className="block cursor-pointer rounded-lg border border-dashed border-white/20 px-4 py-6 text-center text-sm text-muted hover:bg-hover"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFiles(e.dataTransfer.files);
      }}
    >
      {label}
      <input type="file" accept={accept} className="hidden" onChange={(e) => onFiles(e.target.files)} />
    </label>
  );
}
