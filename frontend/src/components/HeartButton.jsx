import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const HeartButton = ({ exerciseId, childIndex = 0, isFavInitial = false }) => {
  const [isFav, setIsFav] = useState(isFavInitial);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('authToken');

    try {
      await axios.post(`http://localhost:5000/api/favorites/${exerciseId}`, {
        childIndex
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFav(!isFav);
      toast.success(isFav ? 'Removed from favorites ❤️‍🩹' : 'Added to favorites 💖');
    } catch (err) {
      toast.error('Failed to update favorites');
      console.error(err);
    }
  };

  return (
    <button onClick={toggleFavorite} title="Toggle Favorite">
      <FaHeart className={`text-xl transition-all ${isFav ? 'text-pink-500 scale-110' : 'text-gray-300 hover:text-pink-400'}`} />
    </button>
  );
};

export default HeartButton;
