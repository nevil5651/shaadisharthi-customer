// CategoryCard.tsx (updated)
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
  const bgClass = isSelected
    ? 'bg-white text-primary shadow-md'
    : `${colorClass.bg} ${colorClass.text}`;

  return (
    <button
      onClick={() => onClick(category)}
      className={`flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-all ${
        isSelected ? 'shadow-md' : ''
      }`}
      aria-pressed={isSelected}
    >
      <div className={`category-icon w-10 h-10 rounded-full flex items-center justify-center mr-3 ${bgClass}`}>
        <IconComponent />
      </div>
      <span className="font-medium">{category}</span>
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