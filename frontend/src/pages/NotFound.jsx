import React from 'react';
import { Link } from 'react-router-dom';
//import { Button, Card } from '../Common/index';
import { Button, Card } from '../components/Common';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="text-center max-w-md w-full">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Go to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
