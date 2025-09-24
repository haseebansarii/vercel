import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, Menu, X, Database, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, signOut, isAdmin, isSupabaseConnected } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-red-600 shadow-sm border-b border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">DinTalk</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/browse" 
              className="text-white hover:text-red-200 transition-colors"
            >
              Browse Reports
            </Link>
            {user && (
              <>
                <Link 
                  to="/submit-report" 
                  className="text-white hover:text-red-200 transition-colors"
                >
                  Submit Report
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-red-200 transition-colors"
                >
                  My Reports
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-white hover:text-red-200 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-white">{user.email}</span>
                  {isAdmin && (
                    <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full">Admin</span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white hover:bg-red-700">
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-white hover:bg-red-700">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')} className="bg-white text-red-600 hover:bg-red-50">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-red-700"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/browse" 
                className="text-white hover:text-red-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Reports
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/submit-report" 
                    className="text-white hover:text-red-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Submit Report
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-white hover:text-red-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Reports
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-white hover:text-red-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-red-100 mb-2">
                      Signed in as {user.email}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="border-white text-white hover:bg-red-700">
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-2 pt-3 border-t border-red-500">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:bg-red-700"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="bg-white text-red-600 hover:bg-red-50"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}