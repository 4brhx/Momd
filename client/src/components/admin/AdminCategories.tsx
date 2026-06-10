import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const categoriesQuery = trpc.categories.list.useQuery();

  if (categoriesQuery.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!categoriesQuery.data || categoriesQuery.data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600 text-lg">لا توجد تصنيفات حالياً</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categoriesQuery.data.map((category) => (
        <Card key={category.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: category.color || '#000000' }}
                />
                <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(category.createdAt).toLocaleDateString('ar-EG')}
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
