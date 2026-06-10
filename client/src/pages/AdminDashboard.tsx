import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus } from 'lucide-react';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminAuthors from '@/components/admin/AdminAuthors';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setLocation('/admin/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="articles">المقالات</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات</TabsTrigger>
            <TabsTrigger value="authors">الكتّاب</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إدارة المقالات</h2>
              <a href="/admin/articles/new">
                <Button className="bg-amber-700 hover:bg-amber-800 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  مقالة جديدة
                </Button>
              </a>
            </div>
            <AdminArticles />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إدارة التصنيفات</h2>
              <Button className="bg-amber-700 hover:bg-amber-800 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                تصنيف جديد
              </Button>
            </div>
            <AdminCategories />
          </TabsContent>

          <TabsContent value="authors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إدارة الكتّاب</h2>
              <Button className="bg-amber-700 hover:bg-amber-800 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                كاتب جديد
              </Button>
            </div>
            <AdminAuthors />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
