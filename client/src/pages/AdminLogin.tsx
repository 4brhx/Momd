import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminToken', 'authenticated');
      setLocation('/admin/dashboard');
    } else {
      setError('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">أدخل كلمة المرور للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="أدخل كلمة المرور"
              className="w-full"
            />
          </div>

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white">
            دخول
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          للأغراض التوضيحية: كلمة المرور = admin123
        </p>
      </Card>
    </div>
  );
}
