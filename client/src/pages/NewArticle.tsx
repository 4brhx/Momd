import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import RichTextEditor from '@/components/RichTextEditor';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function NewArticle() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [authorId, setAuthorId] = useState<string>('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [readingTime, setReadingTime] = useState('3');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categoriesQuery = trpc.categories.list.useQuery();
  const authorsQuery = trpc.authors.list.useQuery();

  const handleGenerateSlug = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !slug || !content) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement article creation via tRPC
      console.log({
        title,
        slug,
        excerpt,
        content,
        categoryId: categoryId ? parseInt(categoryId) : null,
        authorId: authorId ? parseInt(authorId) : null,
        status,
        readingTime: parseInt(readingTime),
        imageUrl: imageUrl || null,
      });
      
      // Simulate success
      setLocation('/admin/dashboard');
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء المقالة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-6 flex items-center gap-4">
          <Button
            onClick={() => setLocation('/admin/dashboard')}
            variant="ghost"
            size="sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">مقالة جديدة</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-700">{error}</p>
            </Card>
          )}

          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">معلومات المقالة</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  العنوان *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان المقالة"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الرابط (Slug) *
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="article-slug"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleGenerateSlug}
                      variant="outline"
                    >
                      توليد
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    وقت القراءة (دقائق)
                  </label>
                  <Input
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الوصف
                </label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="وصف قصير للمقالة"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط الصورة
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">البيانات الوصفية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  التصنيف
                </label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيفاً" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesQuery.data?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الكاتب
                </label>
                <Select value={authorId} onValueChange={setAuthorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر كاتباً" />
                  </SelectTrigger>
                  <SelectContent>
                    {authorsQuery.data?.map((author) => (
                      <SelectItem key={author.id} value={author.id.toString()}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الحالة
                </label>
                <Select value={status} onValueChange={(val) => setStatus(val as 'draft' | 'published')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Content */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">محتوى المقالة *</h2>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="اكتب محتوى المقالة هنا..."
            />
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/admin/dashboard')}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              حفظ المقالة
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
