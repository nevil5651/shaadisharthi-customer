import React, { memo } from 'react';
import * as Icons from './Icons';

interface CategoryCardProps {
  category: string;
  icon: string;
  colorClass: { bg: string; text: string };
  isSelected: boolean;
  onClick: (category: string) => void;
}

// Map icon names to components
const iconComponentMap: Record<string, React.FC<{ className?: string }>> = {
  'fa-camera': Icons.CameraIcon,
  'fa-building': Icons.BuildingIcon,
  'fa-volume-up': Icons.VolumeUpIcon,
  'fa-utensils': Icons.UtensilsIcon,
  'fa-paint-brush': Icons.PaintBrushIcon,
  'fa-tshirt': Icons.TShirtIcon,
  'fa-gem': Icons.GemIcon,
  'fa-gift': Icons.GiftIcon,
  'fa-clipboard-list': Icons.ClipboardListIcon,
  'fa-magic': Icons.MagicIcon,
  'fa-video': Icons.VideoIcon,
  'fa-user-tie': Icons.UserTieIcon,
  'fa-birthday-cake': Icons.BirthdayCakeIcon,
  'fa-envelope': Icons.EnvelopeIcon,
  'fa-music': Icons.MusicIcon,
  'fa-star': Icons.StarIcon,
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
  colorClass,
  isSelected,
  onClick,
}) => {
  const IconComponent = iconComponentMap[icon] || Icons.StarIcon;
  
  return (
    <button
      onClick={() => onClick(category)}
      className={`flex items-center p-3 rounded-lg hover:shadow-md transition-all w-full ${
        isSelected 
          ? 'bg-primary text-white shadow-md' 
          : `bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${colorClass.text}`
      }`}
      aria-pressed={isSelected}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
        isSelected ? 'bg-white/20' : colorClass.bg
      }`}>
        <IconComponent className={isSelected ? 'text-white' : ''} />
      </div>
      <span className="font-medium text-sm truncate">{category}</span>
    </button>
  );
};

const areEqual = (prevProps: CategoryCardProps, nextProps: CategoryCardProps) => {
  return prevProps.category === nextProps.category &&
         prevProps.icon === nextProps.icon &&
         prevProps.colorClass.bg === nextProps.colorClass.bg &&
         prevProps.colorClass.text === nextProps.colorClass.text &&
         prevProps.isSelected === nextProps.isSelected;
};

export default memo(CategoryCard, areEqual);