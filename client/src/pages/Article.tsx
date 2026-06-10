import { useParams, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const articleQuery = trpc.articles.bySlug.useQuery({ slug: slug || '' }, { enabled: !!slug });
  const categoriesQuery = trpc.categories.list.useQuery();
  const authorsQuery = trpc.authors.list.useQuery();

  const article = articleQuery.data;
  const author = article?.authorId ? authorsQuery.data?.find(a => a.id === article.authorId) : null;
  const category = article?.categoryId ? categoriesQuery.data?.find(c => c.id === article.categoryId) : null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (articleQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container py-12">
          <Skeleton className="h-96 mb-8" />
          <Skeleton className="h-12 mb-4" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">المقال غير موجود</h1>
          <Link href="/">
            <a className="text-amber-700 hover:text-amber-800 font-semibold">
              العودة إلى الرئيسية
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
        <div className="container py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">مجلة مودرن</h1>
          <Link href="/">
            <a className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة
            </a>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {/* Metadata */}
          <div className="mb-8">
            <span className="text-amber-700 text-sm font-semibold">
              {category?.name || 'عام'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>{formatDate(article.createdAt)}</span>
              <span>•</span>
              <span>{article.readingTime || 3} دقائق قراءة</span>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12 text-gray-700 leading-relaxed">
            <div
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Author Card */}
          {author && (
            <Card className="p-8 bg-gray-50 border-gray-200">
              <div className="flex items-start gap-6">
                {author.imageUrl && (
                  <img
                    src={author.imageUrl}
                    alt={author.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name}</h3>
                  {author.bio && (
                    <p className="text-gray-600 leading-relaxed">{author.bio}</p>
                  )}
                  {author.email && (
                    <p className="text-sm text-gray-500 mt-3">البريد الإلكتروني: {author.email}</p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container text-center text-gray-600">
          <p>© {new Date().getFullYear()} مجلة مودرن. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
