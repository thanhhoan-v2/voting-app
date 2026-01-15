'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

interface PollOption {
  text: string;
  imageUrl: string;
}

export default function CreatePollPage() {
  const { displayName } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { text: '', imageUrl: '' },
    { text: '', imageUrl: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 옵션 추가
  const addOption = () => {
    setOptions([...options, { text: '', imageUrl: '' }]);
  };

  // 옵션 삭제
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // 옵션 텍스트 업데이트
  const updateOptionText = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  // 이미지를 base64로 변환
  const handleImageUpload = async (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newOptions = [...options];
      newOptions[index].imageUrl = reader.result as string;
      setOptions(newOptions);
    };
    reader.readAsDataURL(file);
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    const newOptions = [...options];
    newOptions[index].imageUrl = '';
    setOptions(newOptions);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const filteredOptions = options
        .filter(opt => opt.text.trim() !== '')
        .map(opt => ({
          text: opt.text,
          imageUrl: opt.imageUrl || undefined
        }));

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          options: filteredOptions,
          displayName: displayName || 'Anonymous'
        }),
      });

      if (response.ok) {
        window.location.href = '/polls';
      } else {
        alert('Error creating poll');
      }
    } catch (error) {
      alert('Error creating poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* 헤더 */}
      <header className="border-b-3 border-[var(--border-color)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="heading-primary text-2xl">
            Vote<span className="text-[var(--accent-coral)]">Box</span>
          </Link>
          <Link href="/polls" className="nav-link">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Polls
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* 페이지 타이틀 */}
        <div className="mb-8 animate-fade-in">
          <h1 className="heading-primary text-4xl md:text-5xl mb-4">
            Create New Poll
          </h1>
          <p className="text-body text-lg">
            Ask a question and let people vote — add images to make it visual!
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="card-static p-8 animate-scale-in">
          {/* 질문 */}
          <div className="mb-6">
            <label className="block heading-secondary text-lg mb-3">
              Your Question
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field text-lg"
              placeholder="What do you want to ask?"
              required
            />
          </div>

          {/* 설명 */}
          <div className="mb-8">
            <label className="block heading-secondary text-lg mb-3">
              Description
              <span className="text-[var(--text-muted)] font-normal text-sm ml-2">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-field"
              placeholder="Add more context about your poll..."
              rows={3}
            />
          </div>

          {/* 옵션들 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block heading-secondary text-lg">
                Options
              </label>
              <button
                type="button"
                onClick={addOption}
                className="btn-mint btn-small"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="p-4 border-3 border-[var(--border-color)] rounded-xl bg-white shadow-brutal"
                >
                  <div className="flex items-start gap-3">
                    {/* 번호 */}
                    <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent-yellow)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center">
                      <span className="heading-secondary text-sm">{index + 1}</span>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* 옵션 텍스트 */}
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOptionText(index, e.target.value)}
                        className="input-field"
                        placeholder={`Option ${index + 1}`}
                        required
                      />

                      {/* 이미지 업로드 */}
                      {option.imageUrl ? (
                        <div className="image-preview">
                          <img src={option.imageUrl} alt={`Option ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="image-preview-remove"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className="image-upload-zone"
                          onClick={() => fileInputRefs.current[index]?.click()}
                        >
                          <svg className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-[var(--text-muted)]">Click to add image (optional)</p>
                        </div>
                      )}
                      <input
                        ref={(el) => { fileInputRefs.current[index] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                      />
                    </div>

                    {/* 삭제 버튼 */}
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="flex-shrink-0 w-10 h-10 bg-[var(--accent-coral)] border-2 border-[var(--border-color)] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 생성자 정보 */}
          <div className="mb-8 p-4 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] rounded-xl">
            <p className="text-body text-sm">
              Creating as: <span className="font-semibold text-[var(--text-primary)]">{displayName || 'Anonymous'}</span>
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-coral flex-1 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-5 h-5 border-2" />
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Poll
                </>
              )}
            </button>
            <Link href="/polls" className="btn-secondary flex-1 text-lg text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
