import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  categoryId: number | null;
  createdAt: Date;
  readingTime: number | null;
}

export default function Home() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const articlesQuery = trpc.articles.list.useQuery({ limit: 12 });
  const categoriesQuery = trpc.categories.list.useQuery();

  useEffect(() => {
    if (articlesQuery.data) {
      setFeatured(articlesQuery.data.slice(0, 3));
      setLatest(articlesQuery.data.slice(3));
      setLoading(false);
    }
  }, [articlesQuery.data]);

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId || !categoriesQuery.data) return 'عام';
    const category = categoriesQuery.data.find(c => c.id === categoryId);
    return category?.name || 'عام';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
        <div className="container py-6">
          <h1 className="text-4xl font-bold text-gray-900">مجلة مودرن</h1>
          <p className="text-gray-600 mt-2">منصة المحتوى الإلكتروني الأنيقة</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="editorial-hero">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Article */}
            {loading ? (
              <Skeleton className="lg:col-span-2 h-96" />
            ) : featured.length > 0 ? (
              <Link href={`/article/${featured[0].slug}`}>
                <a className="lg:col-span-2 group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg h-96 bg-gray-100">
                    {featured[0].imageUrl && (
                      <img
                        src={featured[0].imageUrl}
                        alt={featured[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                      <span className="text-amber-400 text-sm font-semibold mb-3">
                        {getCategoryName(featured[0].categoryId)}
                      </span>
                      <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                        {featured[0].title}
                      </h2>
                      <p className="text-gray-200 text-sm">
                        {formatDate(featured[0].createdAt)} • {featured[0].readingTime || 3} دقائق قراءة
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ) : null}

            {/* Side Featured Articles */}
            <div className="space-y-6">
              {loading ? (
                <>
                  <Skeleton className="h-48" />
                  <Skeleton className="h-48" />
                </>
              ) : (
                featured.slice(1, 3).map((article) => (
                  <Link key={article.id} href={`/article/${article.slug}`}>
                    <a className="group block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        {article.imageUrl && (
                          <div className="h-32 overflow-hidden bg-gray-100">
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <span className="text-amber-700 text-xs font-semibold">
                            {getCategoryName(article.categoryId)}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-500 text-xs mt-2">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                      </Card>
                    </a>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            أحدث المقالات
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latest.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <a className="group">
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                      {article.imageUrl && (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <span className="text-amber-700 text-xs font-semibold">
                          {getCategoryName(article.categoryId)}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mt-3 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(article.createdAt)}</span>
                          <span>{article.readingTime || 3} دقائق</span>
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="container text-center text-gray-600">
          <p>© {new Date().getFullYear()} مجلة مودرن. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
