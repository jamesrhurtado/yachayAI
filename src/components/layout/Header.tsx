import React from 'react';
import { GraduationCap, User, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Header() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">YachayAI</h1>
              <p className="text-blue-100 text-sm">Aprende con inteligencia artificial</p>
            </div>
          </div>

          {/* User Info */}
          {user && profile && (
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <Trophy size={16} />
                  <span>{profile.total_points} pts</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <Flame size={16} />
                  <span>{profile.streak_days} días</span>
                </div>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-2">
                  <User size={20} />
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-blue-100 text-xs">Nivel {profile.level}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-white hover:bg-white/20"
              >
                Salir
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}