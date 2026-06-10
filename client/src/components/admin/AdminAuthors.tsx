import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Trash2 } from 'lucide-react';

export default function AdminAuthors() {
  const authorsQuery = trpc.authors.list.useQuery();

  if (authorsQuery.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!authorsQuery.data || authorsQuery.data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600 text-lg">لا يوجد كتّاب حالياً</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {authorsQuery.data.map((author) => (
        <Card key={author.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                {author.imageUrl && (
                  <img
                    src={author.imageUrl}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{author.name}</h3>
                  {author.email && (
                    <p className="text-sm text-gray-600">{author.email}</p>
                  )}
                </div>
              </div>
              {author.bio && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{author.bio}</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(author.createdAt).toLocaleDateString('ar-EG')}
              </p>
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
