import React, { useEffect, useState } from 'react';
import Timeline from '@/components/ui/Timeline';
import { Tooltip } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface LatestUpdate {
  title: string;
  slug: string;
  date: string;
}

const Updates = () => {
  const [updates, setUpdates] = useState<LatestUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('https://ihrcgroup.com/api/latest-updates');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUpdates(data.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Function to truncate text and add ellipsis
  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function to handle title click
  const handleTitleClick = (slug: string) => {
    window.open(`https://www.ihrcgroup.com/blog/${slug}`, '_blank');
  };

  // Function to handle View All click
  const handleViewAllClick = () => {
    window.open('https://www.ihrcgroup.com/blog', '_blank');
  };

  if (loading) {
    return <div className="max-w-[700px]">Loading latest updates...</div>;
  }

  if (error) {
    return <div className="max-w-[700px] text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-[700px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Latest Updates
        </h2>
        <button 
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={handleViewAllClick}
        >
          View All
        </button>
      </div>
      <Timeline>
        {updates.map((update, index) => (
          <Timeline.Item key={index}>
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {update.date}
              </span>
              <span className="mx-2">-</span>
              <Tooltip title={update.title}>
                <span 
                  className="cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => handleTitleClick(update.slug)}
                >
                  {truncateText(update.title)}
                </span>
              </Tooltip>
            </p>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default Updates;