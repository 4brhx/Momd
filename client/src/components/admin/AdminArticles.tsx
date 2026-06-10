import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Trash2 } from 'lucide-react';

export default function AdminArticles() {
  const articlesQuery = trpc.articles.list.useQuery({ limit: 100 });

  if (articlesQuery.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!articlesQuery.data || articlesQuery.data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600 text-lg">لا توجد مقالات حالياً</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {articlesQuery.data.map((article) => (
        <Card key={article.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {article.excerpt || 'بدون وصف'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  الحالة:{' '}
                  <span className={article.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>
                    {article.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                </span>
                <span>
                  {new Date(article.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mr-4">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                تعديل
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
